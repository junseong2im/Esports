'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { teams } from '@/lib/data';
import { fetchMatches } from '@/lib/api';
import { MatchSchedule, TeamName } from '@/types';
import MatchCard from './MatchCard';

type SelectedTeam = TeamName | 'all';

export default function SchedulePage() {
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState<SelectedTeam>('all');
  const [matches, setMatches] = useState<MatchSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const data = await fetchMatches();
        // CL 리그 제외하고 LCK 일정만 필터링
        const lckMatches = data.filter(match => 
          match.leagueName.includes('LCK') && 
          !match.leagueName.toLowerCase().includes('cl')
        );
        setMatches(lckMatches);
      } catch (err) {
        setError('경기 일정을 불러오는데 실패했습니다.');
        console.error('Failed to fetch matches:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      loadMatches();
    }
  }, []);

  // 필터링된 경기 목록 (백엔드 필드 기준)
  const filteredMatches = matches
    .filter(m => selectedTeam === 'all' || m.teamA === selectedTeam || m.teamB === selectedTeam)
    .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());

  // 월 목록 생성
  const months = [...new Set(matches.map(m => m.matchDate.slice(0, 7)))].sort();
  const [currentMonth, setCurrentMonth] = useState<string>(months[0] || '');

  useEffect(() => {
    if (months.length && !currentMonth) setCurrentMonth(months[0]);
  }, [months, currentMonth]);

  const monthFiltered = filteredMatches.filter(m => m.matchDate.startsWith(currentMonth || ''));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'black', padding: '2rem', position: 'relative' }}>
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
                const idx = months.findIndex(m => m === currentMonth);
                if (idx > 0) setCurrentMonth(months[idx - 1]);
              }}
              disabled={!currentMonth || months.findIndex(m => m === currentMonth) === 0}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#333',
                border: 'none',
                borderRadius: '5px',
                color: 'white',
                cursor: 'pointer',
                opacity: !currentMonth || months.findIndex(m => m === currentMonth) === 0 ? 0.5 : 1
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
              {currentMonth ? `${parseInt(currentMonth.split('-')[1])}월` : '경기 일정'} 경기 일정
            </h2>
            <button
              onClick={() => {
                const idx = months.findIndex(m => m === currentMonth);
                if (idx < months.length - 1) setCurrentMonth(months[idx + 1]);
              }}
              disabled={!currentMonth || months.findIndex(m => m === currentMonth) === months.length - 1}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#333',
                border: 'none',
                borderRadius: '5px',
                color: 'white',
                cursor: 'pointer',
                opacity: !currentMonth || months.findIndex(m => m === currentMonth) === months.length - 1 ? 0.5 : 1
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
                onClick={() => setSelectedTeam(team.id as TeamName)}
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
        ) : monthFiltered.length === 0 ? (
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
          monthFiltered.map(m => (
            <MatchCard key={m.id} match={m} />
          ))
        )}
      </div>
    </div>
  );
} 