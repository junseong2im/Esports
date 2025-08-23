'use client';

interface MatchCardProps {
  match: {
    teamA: string;
    teamB: string;
    matchDate: string;
    leagueName?: string;
  };
}

export default function MatchCard({ match }: MatchCardProps) {
  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      borderRadius: '10px',
      padding: '1.5rem',
      marginBottom: '1rem',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      {/* 날짜 */}
      <div style={{
        fontSize: '1.1rem',
        color: '#888',
        textAlign: 'center'
      }}>
        {match.matchDate}
      </div>

      {/* 팀 정보 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2rem'
      }}>
        <div style={{
          flex: 1,
          textAlign: 'right',
          fontSize: '1.2rem',
          fontWeight: 'bold'
        }}>
          {match.teamA}
        </div>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#666'
        }}>
          VS
        </div>
        <div style={{
          flex: 1,
          textAlign: 'left',
          fontSize: '1.2rem',
          fontWeight: 'bold'
        }}>
          {match.teamB}
        </div>
      </div>

      {/* 리그 정보 */}
      {match.leagueName && (
        <div style={{
          fontSize: '0.9rem',
          color: '#666',
          textAlign: 'center'
        }}>
          {match.leagueName}
        </div>
      )}
    </div>
  );
} 