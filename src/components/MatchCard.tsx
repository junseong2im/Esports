'use client';

import { MatchSchedule } from '@/types';
import { teamFullNames } from '@/lib/data';

interface MatchCardProps {
  match: MatchSchedule;
}

export default function MatchCard({ match }: MatchCardProps) {
  // 팀 이름 변환 (약어 -> 전체 이름)
  const getFullTeamName = (teamName: string) => {
    return teamFullNames[teamName] || teamName;
  };

  return (
    <div style={{
      backgroundColor: 'rgba(26, 26, 26, 0.95)',
      borderRadius: '10px',
      padding: '1.5rem',
      marginBottom: '1rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.2s ease',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flex: 1
        }}>
          {/* 팀 A */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flex: 1,
            justifyContent: 'flex-end'
          }}>
            <span style={{
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textAlign: 'right'
            }}>
              {getFullTeamName(match.teamA)}
            </span>
            {match.teamALogo && (
              <img
                src={match.teamALogo}
                alt={`${match.teamA} logo`}
                style={{
                  width: '30px',
                  height: '30px',
                  objectFit: 'contain'
                }}
              />
            )}
          </div>

          {/* VS */}
          <div style={{
            color: '#666',
            fontSize: '0.9rem',
            padding: '0 1rem'
          }}>
            VS
          </div>

          {/* 팀 B */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flex: 1
          }}>
            {match.teamBLogo && (
              <img
                src={match.teamBLogo}
                alt={`${match.teamB} logo`}
                style={{
                  width: '30px',
                  height: '30px',
                  objectFit: 'contain'
                }}
              />
            )}
            <span style={{
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              {getFullTeamName(match.teamB)}
            </span>
          </div>
        </div>
      </div>

      {/* 경기 정보 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '1rem'
      }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {/* 날짜 */}
          <span style={{
            color: '#888',
            fontSize: '0.9rem'
          }}>
            {match.matchDate}
          </span>

          {/* 리그 */}
          <span style={{
            color: '#666',
            fontSize: '0.8rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px'
          }}>
            {match.leagueName}
          </span>
        </div>

        {/* 상태 */}
        <span style={{
          color: match.matchStatus === 'SCHEDULED' ? '#00C851' : 
                match.matchStatus === 'LIVE' ? '#ff4444' : '#888',
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}>
          {match.matchStatus === 'SCHEDULED' ? '예정' :
           match.matchStatus === 'LIVE' ? '진행중' : '종료'}
        </span>
      </div>
    </div>
  );
} 