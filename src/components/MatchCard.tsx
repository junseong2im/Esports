'use client';

import { useState } from 'react';
import { MatchSchedule } from '@/types';
import { teams } from '@/lib/data';

interface MatchCardProps {
  match: MatchSchedule;
  onNotificationToggle?: (matchId: number) => void;
}

export default function MatchCard({ match, onNotificationToggle }: MatchCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getTeamName = (teamId: string) => {
    return teams.find(team => team.id === teamId)?.name || teamId;
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered ? 'rgba(74, 85, 104, 0.2)' : 'rgba(26, 32, 44, 0.4)',
        backdropFilter: 'blur(10px)',
        padding: '1.5rem',
        borderRadius: '15px',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isHovered ? '0 8px 16px rgba(0, 0, 0, 0.2)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* 팀 A */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.5rem'
        }}>
          {/* 팀 로고 들어갈 자리 */}
        </div>
        <span style={{
          color: '#ffffff',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          {getTeamName(match.teamA)}
        </span>
      </div>

      {/* 경기 정보 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        minWidth: '200px'
      }}>
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          color: '#A0AEC0',
          fontSize: '0.9rem',
          letterSpacing: '0.5px'
        }}>
          {match.date}
        </div>
        <div style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {match.score || 'VS'}
        </div>
        <div style={{
          backgroundColor: 'rgba(66, 153, 225, 0.1)',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          color: '#4299E1',
          fontSize: '0.9rem',
          letterSpacing: '0.5px'
        }}>
          {match.time}
        </div>
      </div>

      {/* 팀 B */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.5rem'
        }}>
          {/* 팀 로고 들어갈 자리 */}
        </div>
        <span style={{
          color: '#ffffff',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          {getTeamName(match.teamB)}
        </span>
      </div>

      {/* 알림 버튼 */}
      {onNotificationToggle && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNotificationToggle(match.id);
          }}
          style={{
            backgroundColor: match.isNotificationEnabled ? 'rgba(66, 153, 225, 0.2)' : 'transparent',
            border: `2px solid ${match.isNotificationEnabled ? '#4299E1' : 'rgba(113, 128, 150, 0.4)'}`,
            color: match.isNotificationEnabled ? '#4299E1' : '#718096',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            outline: 'none',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {match.isNotificationEnabled ? (
            <>
              <span>🔔</span>
              알림 켜짐
            </>
          ) : (
            <>
              <span>🔕</span>
              알림 받기
            </>
          )}
        </button>
      )}
    </div>
  );
} 