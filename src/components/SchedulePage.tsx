'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { teams } from '@/lib/data';
import { fetchMatches, crawlMatches, fetchTeamMatches } from '@/lib/api';
import { MatchSchedule, TeamName } from '@/types';
import { showToast } from '@/lib/toast';
import MatchCard from './MatchCard';

type SelectedTeam = TeamName | 'all';

export default function SchedulePage() {
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState<SelectedTeam>('all');
  const [matches, setMatches] = useState<MatchSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

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
        
        // 먼저 2025년 전체 일정 크롤링
        await crawlMatches();
        
        // 크롤링 완료 후 3초 대기 (백엔드에서 데이터 저장 시간 확보)
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // 크롤링된 데이터 가져오기 (최대 3번 시도)
        let allMatches: MatchSchedule[] = [];
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
          try {
            allMatches = await fetchMatches();
            if (allMatches.length > 0) break;
            
            console.log(`데이터가 비어있음. 재시도 ${retryCount + 1}/${maxRetries}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            retryCount++;
          } catch (error) {
            console.error('데이터 가져오기 실패:', error);
            await new Promise(resolve => setTimeout(resolve, 2000));
            retryCount++;
          }
        }

        if (allMatches.length === 0) {
          throw new Error('경기 일정을 가져오지 못했습니다. 잠시 후 다시 시도해주세요.');
        }

        // LCK 리그만 필터링하고 CL 리그는 제외
        const lckMatches = allMatches.filter(match => 
          match.leagueName.includes('LCK') && !match.leagueName.includes('CL')
        );
        setMatches(lckMatches);
      } catch (error) {
        setError(error instanceof Error ? error.message : '경기 일정을 불러오는데 실패했습니다.');
        console.error('Failed to fetch matches:', error);
        showToast(error instanceof Error ? error.message : '경기 일정을 불러오는데 실패했습니다.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      loadMatches();
    }
  }, []);

  // 팀 선택 시 해당 팀의 경기만 보여주기
  const handleTeamSelect = async (team: SelectedTeam) => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedTeam(team);

      let filteredMatches;
      if (team === 'all') {
        // 전체 경기 가져오기
        const allMatches = await fetchMatches();
        filteredMatches = allMatches.filter(match => 
          match.leagueName.includes('LCK') && !match.leagueName.includes('CL')
        );
      } else {
        // 선택된 팀의 경기만 가져오기
        filteredMatches = await fetchTeamMatches(team);
      }
      setMatches(filteredMatches);
    } catch (error) {
      setError('경기 일정을 불러오는데 실패했습니다.');
      console.error('Failed to fetch matches:', error);
      showToast('경기 일정을 불러오는데 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 월 목록 자동 생성 (1월부터 12월까지)
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, '0');
    return `2025-${month}`;
  });

  // 현재 선택된 월 상태 ('all'은 전체 보기)
  const [currentMonth, setCurrentMonth] = useState<string | 'all'>('all');

  // 페이지네이션을 위한 상태
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 30;

  // 필터링된 경기 목록 (백엔드 필드 기준)
  const filteredMatches = matches
    .filter(m => {
      if (selectedTeam === 'all') return true;
      return m.teamA.includes(selectedTeam) || m.teamB.includes(selectedTeam);
    })
    .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());

  // 월별 또는 전체 필터링
  const monthFiltered = currentMonth === 'all' 
    ? filteredMatches 
    : filteredMatches.filter(m => {
        const matchDate = new Date(m.matchDate);
        const matchYearMonth = `${matchDate.getFullYear()}-${String(matchDate.getMonth() + 1).padStart(2, '0')}`;
        return matchYearMonth === currentMonth;
      });

  // 각 월별 경기 수 계산
  const matchesByMonth = months.reduce((acc, month) => {
    acc[month] = filteredMatches.filter(m => {
      const matchDate = new Date(m.matchDate);
      const matchYearMonth = `${matchDate.getFullYear()}-${String(matchDate.getMonth() + 1).padStart(2, '0')}`;
      return matchYearMonth === month;
    }).length;
    return acc;
  }, {} as Record<string, number>);

  // 페이지네이션 적용
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = monthFiltered.slice(indexOfFirstMatch, indexOfLastMatch);
  const totalPages = Math.ceil(monthFiltered.length / matchesPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  // 월 변경 핸들러
  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (currentMonth === 'all') return;
    
    const currentIndex = months.indexOf(currentMonth);
    let newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    
    // 경기가 있는 다음/이전 월 찾기
    while (newIndex >= 0 && newIndex < months.length) {
      if (matchesByMonth[months[newIndex]] > 0) {
        setCurrentMonth(months[newIndex]);
        setCurrentPage(1);
        break;
      }
      newIndex = direction === 'prev' ? newIndex - 1 : newIndex + 1;
    }
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
          {/* 월 선택 */}
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '1rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => handleMonthChange('prev')}
                disabled={currentMonth === 'all' || !months.slice(0, months.indexOf(currentMonth)).some(m => matchesByMonth[m] > 0)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#333',
                  border: 'none',
                  borderRadius: '5px',
                  color: 'white',
                  cursor: 'pointer',
                  opacity: currentMonth === 'all' || !months.slice(0, months.indexOf(currentMonth)).some(m => matchesByMonth[m] > 0) ? 0.5 : 1
                }}
              >
                ◀
              </button>
              <h2 style={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                {currentMonth === 'all' ? '전체' : `${parseInt(currentMonth.split('-')[1])}월`} 경기 일정
                {currentMonth !== 'all' && matchesByMonth[currentMonth] > 0 && ` (${matchesByMonth[currentMonth]}경기)`}
              </h2>
              <button
                onClick={() => handleMonthChange('next')}
                disabled={currentMonth === 'all' || !months.slice(months.indexOf(currentMonth) + 1).some(m => matchesByMonth[m] > 0)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#333',
                  border: 'none',
                  borderRadius: '5px',
                  color: 'white',
                  cursor: 'pointer',
                  opacity: currentMonth === 'all' || !months.slice(months.indexOf(currentMonth) + 1).some(m => matchesByMonth[m] > 0) ? 0.5 : 1
                }}
              >
                ▶
              </button>
              <button
                onClick={() => {
                  if (currentMonth === 'all') {
                    // 경기가 있는 첫 번째 월 찾기
                    const firstMonthWithMatches = months.find(m => matchesByMonth[m] > 0);
                    if (firstMonthWithMatches) {
                      setCurrentMonth(firstMonthWithMatches);
                    }
                  } else {
                    setCurrentMonth('all');
                  }
                  setCurrentPage(1);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: currentMonth === 'all' ? '#4A5568' : '#333',
                  border: 'none',
                  borderRadius: '5px',
                  color: 'white',
                  cursor: 'pointer',
                  marginLeft: '1rem'
                }}
              >
                {currentMonth === 'all' ? '월별 보기' : '전체 보기'}
              </button>
            </div>
            {/* 월별 경기 수 표시 */}
            {currentMonth === 'all' && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginTop: '1rem',
                flexWrap: 'wrap'
              }}>
                {months.map(month => matchesByMonth[month] > 0 && (
                  <button
                    key={month}
                    onClick={() => {
                      setCurrentMonth(month);
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#333',
                      border: 'none',
                      borderRadius: '5px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    {parseInt(month.split('-')[1])}월 ({matchesByMonth[month]}경기)
                  </button>
                ))}
              </div>
            )}
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
                  onClick={() => handleTeamSelect(team.id as TeamName)}
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
                <MatchCard key={m.id} match={m} />
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