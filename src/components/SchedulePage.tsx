'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { teams } from '@/lib/data';
import { fetchMatches, crawlMatches, fetchTeamMatches } from '@/lib/api';
import { MatchSchedule } from '@/types';
import { showToast } from '@/lib/toast';
import MatchCard from './MatchCard';

export default function SchedulePage() {
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [matches, setMatches] = useState<MatchSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 30;

  // 디스코드 연동 핸들러
  const handleDiscordConnect = () => {
    // TODO: 실제 디스코드 연동 로직 구현
    window.open('https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=0&scope=bot', '_blank');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/');
        return;
      }
    }
  }, [router]);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 크롤링 시도 (최대 3번)
        let crawlSuccess = false;
        for (let i = 0; i < 3; i++) {
          try {
            const result = await crawlMatches('2025-08-01', '2025-08-31');
            console.log(`크롤링 시도 ${i + 1} 완료:`, result);
            crawlSuccess = true;
            break;
          } catch (error) {
            console.error(`크롤링 시도 ${i + 1} 실패:`, error);
            if (i < 2) {
              await new Promise(resolve => setTimeout(resolve, 3000)); // 재시도 전 3초 대기
            }
          }
        }

        if (!crawlSuccess) {
          throw new Error('크롤링에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }

        // 크롤링 성공 후 5초 대기 (DB 저장 시간 고려)
        console.log('크롤링 성공, 5초 대기 후 데이터를 가져옵니다.');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 데이터 가져오기 시도 (최대 3번)
        let fetchSuccess = false;
        let allMatches: MatchSchedule[] = [];
        
        for (let i = 0; i < 3; i++) {
          try {
            if (selectedTeam === 'all') {
              allMatches = await fetchMatches('2025-08-01', '2025-08-31');
            } else {
              allMatches = await fetchTeamMatches(selectedTeam);
            }

            // 데이터가 있는지 확인
            if (allMatches && allMatches.length > 0) {
              // 2024년도와 CL 리그 제외
              allMatches = allMatches.filter(match => {
                const isNotCL = !match.leagueName?.includes('CL');
                const is2025 = match.matchDate?.startsWith('2025');
                return isNotCL && is2025;
              });

              // 날짜순 정렬
              allMatches.sort((a, b) => {
                const dateA = new Date(a.matchDate.replace(' ', 'T'));
                const dateB = new Date(b.matchDate.replace(' ', 'T'));
                return dateA.getTime() - dateB.getTime();
              });

              console.log(`데이터 가져오기 시도 ${i + 1} 결과:`, allMatches);
              
              if (allMatches.length > 0) {
                fetchSuccess = true;
                break;
              }
            }

            // 데이터가 없으면 3초 대기 후 재시도
            console.log(`데이터가 없어서 재시도 ${i + 1}`);
            await new Promise(resolve => setTimeout(resolve, 3000));
          } catch (error) {
            console.error(`데이터 가져오기 시도 ${i + 1} 실패:`, error);
            if (i < 2) {
              await new Promise(resolve => setTimeout(resolve, 3000));
            }
          }
        }

        if (!fetchSuccess) {
          throw new Error('경기 일정을 가져오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
        }

        setMatches(allMatches);
      } catch (error) {
        console.error('데이터 로딩 에러:', error);
        setError(error instanceof Error ? error.message : '경기 일정을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMatches();
  }, [selectedTeam]);

  // 팀 선택 핸들러
  const handleTeamSelect = (team: string) => {
    setSelectedTeam(team);
    setCurrentPage(1);  // 팀 변경시 1페이지로 리셋
  };

  // 페이지네이션
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);
  const totalPages = Math.ceil(matches.length / matchesPerPage);

  // 날짜는 크롤링된 데이터 그대로 반환
  const formatMatchDate = (dateString: string) => dateString;

  // 디버깅용: 필터 단계별 개수 로깅
  useEffect(() => {
    if (!matches) return;

    // 전체 데이터 수 확인
    const total = matches.length;
    console.log('\n=== 8월 일정 데이터 검증 시작 ===');
    console.log(`총 경기 수: ${total}`);

    // LCK 경기만 필터링 (CL 제외)
    const lckMatches = matches.filter(m => m.leagueName?.includes('LCK') && !m.leagueName?.includes('CL'));
    console.log(`LCK 경기 수 (CL 제외): ${lckMatches.length}`);

    // 2025년 8월 경기만 필터링
    const augustMatches = lckMatches.filter(m => {
      const matchDate = m.matchDate?.split(' ')[0]; // 날짜 부분만 추출
      return matchDate?.startsWith('2025-08');
    });
    console.log(`2025년 8월 LCK 경기 수: ${augustMatches.length}`);

    // 8월 날짜별 경기 수 집계
    const matchesByDate = new Map<string, number>();
    augustMatches.forEach(match => {
      const date = match.matchDate?.split(' ')[0]; // YYYY-MM-DD 형식
      if (date) {
        matchesByDate.set(date, (matchesByDate.get(date) || 0) + 1);
      }
    });

    // 8월 1일부터 31일까지 날짜별 경기 수 출력
    console.log('\n=== 8월 날짜별 경기 현황 ===');
    for (let day = 1; day <= 31; day++) {
      const date = `2025-08-${day.toString().padStart(2, '0')}`;
      const count = matchesByDate.get(date) || 0;
      console.log(`${date}: ${count}경기`);
    }

    // 데이터가 있는 날짜 수 확인
    const daysWithMatches = Array.from(matchesByDate.keys()).length;
    console.log(`\n8월 중 경기가 있는 날: ${daysWithMatches}일`);
    
    if (daysWithMatches === 0) {
      console.warn('⚠️ 경고: 8월 경기 데이터가 없습니다!');
    } else if (daysWithMatches < 5) {
      console.warn('⚠️ 경고: 8월 경기 데이터가 너무 적습니다!');
    }

    console.log('=== 데이터 검증 완료 ===\n');
  }, [matches]);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'black', padding: '2rem', position: 'relative' }}>
      {/* 오른쪽 사이드바 */}
      <div style={{
        position: 'fixed',
        right: '2rem',
        top: '2rem',
        width: '300px',
        backgroundColor: '#1a1a1a',
        borderRadius: '10px',
        padding: '1.5rem',
        color: 'white',
        zIndex: 100
      }}>
        {/* 디스코드 연동 버튼 */}
        <button
          onClick={handleDiscordConnect}
          style={{
            backgroundColor: '#7289DA',
            color: 'white',
            padding: '0.75rem',
            width: '100%',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
            marginBottom: '1.5rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(114, 137, 218, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4C14.89 4.23 14.76 4.57 14.67 4.85C13.06 4.61 11.47 4.61 9.88 4.85C9.79 4.57 9.66 4.23 9.54 4C8.04 4.26 6.6 4.71 5.27 5.33C1.81 10.37 0.87 15.29 1.34 20.13C3.14 21.49 4.89 22.31 6.61 22.88C7.04 22.28 7.42 21.65 7.75 20.98C7.13 20.76 6.54 20.49 5.97 20.16C6.09 20.07 6.21 19.98 6.32 19.89C10.19 21.64 14.43 21.64 18.24 19.89C18.36 19.98 18.47 20.07 18.59 20.16C18.02 20.49 17.43 20.76 16.81 20.98C17.14 21.65 17.52 22.28 17.95 22.88C19.67 22.31 21.42 21.49 23.22 20.13C23.77 14.52 22.33 9.64 19.27 5.33ZM8.57 17.23C7.47 17.23 6.56 16.19 6.56 14.91C6.56 13.63 7.45 12.59 8.57 12.59C9.69 12.59 10.6 13.63 10.58 14.91C10.58 16.19 9.69 17.23 8.57 17.23ZM15.99 17.23C14.89 17.23 13.98 16.19 13.98 14.91C13.98 13.63 14.87 12.59 15.99 12.59C17.11 12.59 18.02 13.63 18 14.91C18 16.19 17.11 17.23 15.99 17.23Z" fill="currentColor"/>
          </svg>
          디스코드 알림 받기
        </button>

        {/* 가이드라인 섹션 */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ 
            color: 'white', 
            fontSize: '1.1rem', 
            marginBottom: '1rem',
            borderBottom: '1px solid #333',
            paddingBottom: '0.5rem'
          }}>
            알림 받는 방법
          </h3>
          <ol style={{ 
            color: '#888',
            fontSize: '0.9rem',
            paddingLeft: '1.2rem',
            lineHeight: '1.6'
          }}>
            <li>디스코드 알림 받기 버튼 클릭</li>
            <li>디스코드 봇을 서버에 초대</li>
            <li>채널에서 !알림설정 입력</li>
            <li>경기 30분 전 자동 알림</li>
          </ol>
        </div>

        {/* 개인정보 처리 방침 */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ 
            color: 'white', 
            fontSize: '1.1rem', 
            marginBottom: '1rem',
            borderBottom: '1px solid #333',
            paddingBottom: '0.5rem'
          }}>
            개인정보 처리 방침
          </h3>
          <ul style={{ 
            color: '#888',
            fontSize: '0.9rem',
            listStyle: 'none',
            padding: 0,
            lineHeight: '1.6'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>• 수집하는 개인정보 항목: 디스코드 서버 ID, 채널 ID</li>
            <li style={{ marginBottom: '0.5rem' }}>• 수집 목적: 경기 알림 서비스 제공</li>
            <li style={{ marginBottom: '0.5rem' }}>• 보유 기간: 알림 해제 시까지</li>
            <li>• 제3자 제공: 없음</li>
          </ul>
        </div>

        {/* 이용 약관 */}
        <div>
          <h3 style={{ 
            color: 'white', 
            fontSize: '1.1rem', 
            marginBottom: '1rem',
            borderBottom: '1px solid #333',
            paddingBottom: '0.5rem'
          }}>
            이용 약관
          </h3>
          <ul style={{ 
            color: '#888',
            fontSize: '0.9rem',
            listStyle: 'none',
            padding: 0,
            lineHeight: '1.6'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>• 본 서비스는 무료로 제공됩니다</li>
            <li style={{ marginBottom: '0.5rem' }}>• 알림은 경기 일정에 따라 자동 발송</li>
            <li style={{ marginBottom: '0.5rem' }}>• 서비스 이용 중 발생하는 문제에 대한 책임은 사용자에게 있습니다</li>
            <li>• 부적절한 사용 시 서비스 이용이 제한될 수 있습니다</li>
          </ul>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 - 오른쪽 사이드바 공간 확보 */}
      <div style={{ 
        maxWidth: 'calc(100% - 350px)', 
        marginRight: '320px'
      }}>
        {/* LCK 로고 영역 */}
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto 2rem auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '900',
              color: 'white',
              letterSpacing: '0.1em',
              textShadow: '0 0 20px rgba(255,255,255,0.3)'
            }}>
              LCK
            </h1>
            <p style={{
              color: '#888',
              fontSize: '1.2rem',
              marginTop: '0.5rem'
            }}>
              League of Legends Champions Korea
            </p>
          </div>

          {/* 가이드라인 버튼 */}
          <button
            onClick={() => setShowGuide(!showGuide)}
            style={{
              backgroundColor: 'transparent',
              color: '#888',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              padding: '0.5rem',
              textDecoration: 'underline'
            }}
          >
            {showGuide ? '가이드라인 닫기' : '가이드라인 보기'}
          </button>

          {/* 가이드라인 내용 */}
          {showGuide && (
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '1.5rem',
              borderRadius: '10px',
              color: '#888',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              maxWidth: '800px',
              margin: '1rem 0'
            }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>LCK 경기 알림 받는 방법</h3>
              <ol style={{ paddingLeft: '1.5rem' }}>
                <li>위의 &quot;디스코드 알림 받기&quot; 버튼을 클릭합니다.</li>
                <li>디스코드 봇을 서버에 초대합니다.</li>
                <li>원하는 채널에서 !알림설정 명령어를 입력합니다.</li>
                <li>경기 시작 30분 전에 자동으로 알림을 받을 수 있습니다.</li>
              </ol>
              <p style={{ marginTop: '1rem', color: '#666' }}>
                * 알림을 받고 싶지 않으시다면 !알림해제 명령어를 입력하세요.
              </p>
            </div>
          )}

          <div style={{
            width: '100%',
            height: '1px',
            background: 'linear-gradient(to right, transparent, #333, transparent)',
            margin: '1rem 0'
          }} />
        </div>

        {/* 상단 컨트롤 영역 */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: 'black',
          paddingBottom: '1rem',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* 전체 경기 수 표시 */}
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            textAlign: 'center',
            color: 'white'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: 0
            }}>
              전체 경기 일정 ({matches.length}경기)
            </h2>
          </div>

          {/* 팀 필터 */}
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '1.5rem',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '1600px',
            margin: '0 auto',
            boxSizing: 'border-box'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              justifyContent: 'center',
              flexWrap: 'nowrap'
            }}>
              {/* 전체 버튼 */}
              <button
                onClick={() => handleTeamSelect('all')}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: selectedTeam === 'all' ? '#4A5568' : '#333',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  width: '100px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '45px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = selectedTeam === 'all' ? '#4A5568' : '#444';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = selectedTeam === 'all' ? '#4A5568' : '#333';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                전체
              </button>
              {/* 팀 버튼들 */}
              {teams.filter(team => team.id !== 'all').map(team => (
                <button
                  key={team.id}
                  onClick={() => handleTeamSelect(team.id)}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: selectedTeam === team.id ? '#4A5568' : '#333',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    fontWeight: 'normal',
                    fontSize: '0.9rem',
                    width: '160px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '45px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = selectedTeam === team.id ? '#4A5568' : '#444';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = selectedTeam === team.id ? '#4A5568' : '#333';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {team.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 경기 일정 목록 */}
        <div style={{
          maxWidth: '1000px',
          margin: '2rem auto',
          padding: '0 1rem'
        }}>
          {isLoading ? (
            <div style={{
              color: '#888',
              textAlign: 'center',
              padding: '2rem'
            }}>
              경기 일정을 불러오는 중...
            </div>
          ) : error ? (
            <div style={{
              color: '#ff4444',
              textAlign: 'center',
              padding: '2rem',
              backgroundColor: 'rgba(255, 68, 68, 0.1)',
              borderRadius: '10px'
            }}>
              {error}
            </div>
          ) : currentMatches.length === 0 ? (
            <div style={{
              color: '#888',
              textAlign: 'center',
              padding: '2rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px'
            }}>
              표시할 경기 일정이 없습니다.
            </div>
          ) : (
            <>
              {currentMatches.map(m => (
                <MatchCard 
                  key={`${m.teamA}-${m.teamB}-${m.matchDate}`} 
                  match={{
                    ...m,
                    matchDate: formatMatchDate(m.matchDate)
                  }} 
                />
              ))}
              
              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '2rem'
                }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: currentPage === pageNumber ? '#4A5568' : '#333',
                        border: 'none',
                        borderRadius: '5px',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 