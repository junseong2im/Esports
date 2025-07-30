import { useState } from 'react';
import Image from 'next/image';
import { Match } from '@/types';

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-4 flex items-center justify-between">
      <div className="flex items-center flex-1">
        <div className="flex items-center">
          <div className="w-12 h-12 relative">
            <Image
              src={match.team1.logo}
              alt={match.team1.name}
              fill
              className="object-contain"
            />
          </div>
          <span className="mx-2 font-semibold text-white">{match.team1.name}</span>
        </div>
        
        <span className="mx-4 text-gray-400">vs</span>
        
        <div className="flex items-center">
          <span className="mx-2 font-semibold text-white">{match.team2.name}</span>
          <div className="w-12 h-12 relative">
            <Image
              src={match.team2.logo}
              alt={match.team2.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end ml-4">
        <div className="text-gray-400 text-sm mb-2">
          {new Date(match.date).toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric'
          })}
          <br />
          {match.time}
        </div>
        <button
          onClick={() => setIsSubscribed(!isSubscribed)}
          className={`px-4 py-2 rounded-full transition-colors ${
            isSubscribed
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubscribed ? '✅ 설정됨' : '🔔 알림 설정'}
        </button>
      </div>
    </div>
  );
} 