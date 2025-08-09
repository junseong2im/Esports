'use client';

import { MatchSchedule } from '@/types';

interface MatchCardProps {
  match: MatchSchedule;
}

export default function MatchCard({ match }: MatchCardProps) {
  // 날짜와 시간 포맷팅
  const formatDateTime = (dateTimeStr: string) => {
    const dateTime = new Date(dateTimeStr);
    const date = dateTime.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
    const time = dateTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    return { date, time };
  };

  const { date, time } = formatDateTime(match.matchDate);

  return (
    <div
      className="relative flex items-center justify-between p-4 mb-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:transform hover:scale-[1.02]"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Team A */}
      <div className="flex-1 text-center">
        <span className="text-white font-bold">{match.teamA}</span>
      </div>

      {/* Match Info */}
      <div className="flex-1 text-center">
        <div className="text-sm text-gray-400">{date}</div>
        <div className="font-bold my-1 text-white">VS</div>
        <div className="text-sm text-gray-400">{time}</div>
      </div>

      {/* Team B */}
      <div className="flex-1 text-center">
        <span className="text-white font-bold">{match.teamB}</span>
      </div>

      {/* League Name */}
      <div className="absolute top-2 right-2 text-xs text-gray-500">
        {match.leagueName}
      </div>
    </div>
  );
} 