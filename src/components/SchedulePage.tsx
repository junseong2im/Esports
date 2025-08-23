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
  const [matches, setMatches] = useState<MatchSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const data = await fetchMatches('2025-08-01', '2025-08-31');
      // 2024년도와 CL 리그 제외
      const filteredMatches = data.filter(match => {
        const isNotCL = !match.leagueName?.includes('CL');
        const is2025 = match.matchDate?.startsWith('2025');
        return isNotCL && is2025;
      });
      setMatches(filteredMatches);
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message);
      } else {
        showToast('경기 일정을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTeamSelect = async (teamId: string) => {
    setLoading(true);
    setSelectedTeam(teamId);
    
    try {
      if (teamId === 'all') {
        await loadMatches();
      } else {
        const teamMatches = await fetchTeamMatches(teamId);
        // 2024년도와 CL 리그 제외
        const filteredMatches = teamMatches.filter(match => {
          const isNotCL = !match.leagueName?.includes('CL');
          const is2025 = match.matchDate?.startsWith('2025');
          return isNotCL && is2025;
        });
        setMatches(filteredMatches);
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message);
      } else {
        showToast('팀 경기 일정을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">LCK 경기 일정</h1>
        <div className="flex flex-wrap gap-2">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => handleTeamSelect(team.id)}
              className={`px-4 py-2 rounded ${
                selectedTeam === team.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {team.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : matches.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match, index) => (
            <MatchCard key={`${match.matchDate}-${index}`} match={match} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12">
          일정이 없습니다.
        </div>
      )}
    </div>
  );
} 