import { useState } from 'react';
import { MatchSchedule } from '@/types';

interface MatchCardProps {
  match: MatchSchedule;
}

export default function MatchCard({ match }: MatchCardProps) {
  const [isNotificationSet, setIsNotificationSet] = useState(false);

  return (
    <div style={{
      backgroundColor: 'rgba(30, 30, 30, 0.9)',
      borderRadius: '10px',
      padding: '1.5rem',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem'
    }}>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <span style={{ color: '#ffffff', fontSize: '1.1rem' }}>{match.team1}</span>
      </div>

      <div style={{ 
        textAlign: 'center',
        padding: '0 1rem'
      }}>
        <div style={{ color: '#888', fontSize: '0.9rem' }}>
          {new Date(match.dateTime).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <div style={{ color: '#888', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          {new Date(match.dateTime).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      <div style={{ flex: 1, textAlign: 'center' }}>
        <span style={{ color: '#ffffff', fontSize: '1.1rem' }}>{match.team2}</span>
      </div>

      <button
        onClick={() => setIsNotificationSet(!isNotificationSet)}
        style={{
          backgroundColor: isNotificationSet ? '#4CAF50' : 'transparent',
          border: `1px solid ${isNotificationSet ? '#4CAF50' : '#666'}`,
          color: '#ffffff',
          padding: '0.5rem 1rem',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          fontSize: '0.9rem'
        }}
      >
        {isNotificationSet ? '✓ 설정됨' : '알림 설정'}
      </button>
    </div>
  );
} 