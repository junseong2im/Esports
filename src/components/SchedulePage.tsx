'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { teams } from '@/lib/data';
import { fetchMatches } from '@/lib/api';
import { MatchSchedule } from '@/types';
import MatchCard from './MatchCard';

export default function SchedulePage() {
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [matches, setMatches] = useState<MatchSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 경기 일정에서 월 목록 추출
  const months = [...new Set(matches.map(match => {
    const [year, month] = match.date.split('-');
    return `${year}-${month}`;
  }))].sort().map(yearMonth => {
    const [year, month] = yearMonth.split('-');
    return {
      value: yearMonth,
      label: `${parseInt(month)}월`
    };
  });

  const [currentMonth, setCurrentMonth] = useState(months[0]?.value || '2024-03');

  useEffect(() => {
    // 로그인 체크
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/');
        return;
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchMatches();
        setMatches(data);
        // 첫 번째 경기의 월을 현재 월로 설정
        if (data.length > 0) {
          const [year, month] = data[0].date.split('-');
          setCurrentMonth(`${year}-${month}`);
        }
      } catch (err) {
        setError('경기 일정을 불러오는데 실패했습니다.');
        console.error('Failed to fetch matches:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMatches();
  }, []);

  // 필터링된 경기 목록
  const filteredMatches = matches.filter(match => {
    const matchMonth = match.date.split('-').slice(0, 2).join('-'); // YYYY-MM
    const teamMatches = selectedTeam === 'all' || match.teamA === selectedTeam || match.teamB === selectedTeam;
    return matchMonth === currentMonth && teamMatches;
  }).sort((a, b) => {
    // 날짜순으로 정렬
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'black',
      padding: '2rem',
      position: 'relative'
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
            alignItems: 'center'
          }}>
            <button
              onClick={() => {
                const currentIndex = months.findIndex(m => m.value === currentMonth);
                if (currentIndex > 0) {
                  setCurrentMonth(months[currentIndex - 1].value);
                }
              }}
              disabled={months.findIndex(m => m.value === currentMonth) === 0}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#333',
                border: 'none',
                borderRadius: '5px',
                color: 'white',
                cursor: 'pointer',
                opacity: months.findIndex(m => m.value === currentMonth) === 0 ? 0.5 : 1
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
              {months.find(m => m.value === currentMonth)?.label || '경기 일정'} 경기 일정
            </h2>
            <button
              onClick={() => {
                const currentIndex = months.findIndex(m => m.value === currentMonth);
                if (currentIndex < months.length - 1) {
                  setCurrentMonth(months[currentIndex + 1].value);
                }
              }}
              disabled={months.findIndex(m => m.value === currentMonth) === months.length - 1}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#333',
                border: 'none',
                borderRadius: '5px',
                color: 'white',
                cursor: 'pointer',
                opacity: months.findIndex(m => m.value === currentMonth) === months.length - 1 ? 0.5 : 1
              }}
            >
              ▶
            </button>
          </div>
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
              onClick={() => setSelectedTeam('all')}
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
                onClick={() => setSelectedTeam(team.id)}
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
        ) : filteredMatches.length === 0 ? (
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
          filteredMatches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              onNotificationToggle={(matchId) => {
                // TODO: 알림 토글 구현
                console.log('Toggle notification for match:', matchId);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
} 