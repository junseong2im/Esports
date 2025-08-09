'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { teams } from '@/lib/data';
import { fetchMatches, crawlMatches } from '@/lib/api';
import { MatchSchedule, TeamName } from '@/types';
import MatchCard from './MatchCard';

type SelectedTeam = TeamName | 'all';

export default function SchedulePage() {
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState<SelectedTeam>('all');
  const [matches, setMatches] = useState<MatchSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCrawling, setIsCrawling] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/');
        return;
      }
    }
  }, [router]);

  // LCK 크롤링 실행 함수
  const handleCrawlLCK = async () => {
    try {
      setIsCrawling(true);
      setError(null);
      
      // LCK 2024 스프링 시즌 크롤링 (1월 16일 ~ 3월 24일)
      const springResult = await crawlMatches('2024-01-16', '2024-03-24');
      console.log('LCK 스프링 크롤링 결과:', springResult);
      
      // LCK 2024 서머 시즌 크롤링 (6월 13일 ~ 8월 18일)
      const summerResult = await crawlMatches('2024-06-13', '2024-08-18');
      console.log('LCK 서머 크롤링 결과:', summerResult);
      
      // 크롤링 후 일정 새로고침
      const data = await fetchMatches();
      setMatches(data);
    } catch (err) {
      setError('크롤링 중 오류가 발생했습니다.');
      console.error('크롤링 실패:', err);
    } finally {
      setIsCrawling(false);
    }
  };

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchMatches();
        setMatches(data);
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
      {/* 상단 컨트롤 */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'black', paddingBottom: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
        {/* 크롤링 버튼 */}
        <div style={{ backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '10px', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={handleCrawlLCK}
            disabled={isCrawling}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: isCrawling ? '#666' : '#4A5568',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isCrawling ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
          >
            {isCrawling ? '크롤링 중...' : 'LCK 2024 시즌 일정 가져오기'}
          </button>
        </div>

        {/* 월 선택 */}
        <div style={{ backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
            <button onClick={() => {
              const idx = months.findIndex(m => m === currentMonth);
              if (idx > 0) setCurrentMonth(months[idx - 1]);
            }} disabled={!currentMonth || months.findIndex(m => m === currentMonth) === 0}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#333', border: 'none', borderRadius: '5px', color: 'white', cursor: 'pointer', opacity: !currentMonth || months.findIndex(m => m === currentMonth) === 0 ? 0.5 : 1 }}>◀</button>
            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{currentMonth || '경기 일정'}</h2>
            <button onClick={() => {
              const idx = months.findIndex(m => m === currentMonth);
              if (idx < months.length - 1) setCurrentMonth(months[idx + 1]);
            }} disabled={!currentMonth || months.findIndex(m => m === currentMonth) === months.length - 1}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#333', border: 'none', borderRadius: '5px', color: 'white', cursor: 'pointer', opacity: !currentMonth || months.findIndex(m => m === currentMonth) === months.length - 1 ? 0.5 : 1 }}>▶</button>
          </div>
        </div>

        {/* 팀 필터 */}
        <div style={{ backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '10px', width: '100%', maxWidth: '1600px', margin: '0 auto', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', justifyContent: 'center', flexWrap: 'nowrap' }}>
            <button onClick={() => setSelectedTeam('all')} style={{ padding: '0.75rem 1rem', backgroundColor: selectedTeam === 'all' ? '#4A5568' : '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', fontWeight: 'bold', fontSize: '1.1rem', width: '100px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '45px' }}>전체</button>
            {teams.filter(t => t.id !== 'all').map(team => (
              <button key={team.id} onClick={() => setSelectedTeam(team.id as TeamName)} style={{ padding: '0.75rem 1rem', backgroundColor: selectedTeam === team.id ? '#4A5568' : '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', fontWeight: 'normal', fontSize: '0.9rem', width: '160px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '45px' }}>{team.name}</button>
            ))}
          </div>
        </div>
      </div>

      {/* 경기 일정 리스트 */}
      <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
        {isLoading ? (
          <div style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>경기 일정을 불러오는 중...</div>
        ) : error ? (
          <div style={{ color: '#ff4444', textAlign: 'center', padding: '2rem', backgroundColor: 'rgba(255, 68, 68, 0.1)', borderRadius: '10px' }}>{error}</div>
        ) : monthFiltered.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center', padding: '2rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px' }}>표시할 경기 일정이 없습니다.</div>
        ) : (
          monthFiltered.map(m => (
            <MatchCard key={m.id} match={m} />
          ))
        )}
      </div>
    </div>
  );
} 