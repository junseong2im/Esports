'use client';

import { MatchSchedule } from '@/types';

interface MatchCardProps {
  match: MatchSchedule;
}

export default function MatchCard({ match }: MatchCardProps) {
  // 날짜/시간 포맷팅
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      borderRadius: '10px',
      padding: '1.5rem',
      marginBottom: '1rem',
      color: 'white',
      position: 'relative'
    }}>
      {/* 경기 시간 */}
      <div style={{
        fontSize: '1.1rem',
        color: '#888',
        marginBottom: '1rem'
      }}>
        {formatDateTime(match.matchDate)}
      </div>

      {/* 팀 매치업 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        fontSize: '1.5rem',
        fontWeight: 'bold'
      }}>
        <span>{match.teamA}</span>
        <span style={{ color: '#666' }}>vs</span>
        <span>{match.teamB}</span>
      </div>

      {/* 리그/토너먼트 정보 */}
      <div style={{
        marginTop: '1rem',
        fontSize: '0.9rem',
        color: '#666',
        textAlign: 'center'
      }}>
        {match.leagueName}
      </div>

      {/* 경기 상태 */}
      {match.matchStatus && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          backgroundColor: '#333',
          padding: '0.5rem 1rem',
          borderRadius: '5px',
          fontSize: '0.9rem',
          color: '#aaa'
        }}>
          {match.matchStatus}
        </div>
      )}
    </div>
  );
} 