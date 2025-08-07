'use client';

import { useState } from 'react';
import { MatchSchedule } from '@/types';

interface MatchCardProps {
  match: MatchSchedule;
  onNotificationToggle?: (matchId: number) => void;
}

export default function MatchCard({ match, onNotificationToggle }: MatchCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered ? '#2D3748' : '#1A202C',
        padding: '1.5rem',
        borderRadius: '10px',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
    >
      <div style={{ flex: 1, textAlign: 'center' }}>
        <span style={{ color: '#ffffff', fontSize: '1.1rem' }}>{match.teamA}</span>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        minWidth: '120px'
      }}>
        <span style={{ color: '#A0AEC0', fontSize: '0.9rem' }}>{match.date}</span>
        <span style={{ color: '#E2E8F0', fontSize: '1.2rem', fontWeight: 'bold' }}>
          {match.score || 'VS'}
        </span>
        <span style={{ color: '#A0AEC0', fontSize: '0.9rem' }}>{match.time}</span>
      </div>

      <div style={{ flex: 1, textAlign: 'center' }}>
        <span style={{ color: '#ffffff', fontSize: '1.1rem' }}>{match.teamB}</span>
      </div>

      {onNotificationToggle && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNotificationToggle(match.id);
          }}
          style={{
            backgroundColor: match.isNotificationEnabled ? '#4299E1' : 'transparent',
            border: `2px solid ${match.isNotificationEnabled ? '#4299E1' : '#718096'}`,
            color: '#ffffff',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            outline: 'none',
          }}
        >
          {match.isNotificationEnabled ? '알림 켜짐' : '알림 받기'}
        </button>
      )}
    </div>
  );
} 