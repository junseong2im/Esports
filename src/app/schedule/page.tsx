'use client';

import { useState } from 'react';
import { teams, matches } from '@/lib/data';

// 팀별 브랜드 색상 정의
const teamColors: { [key: string]: string } = {
  hanwha: '#FF6B00',  // 한화생명
  geng: '#AA8A00',    // 젠지
  dplus: '#E4002B',   // DPlus
  nongshim: '#ED1C24', // 농심
  kt: '#FF1C1C',      // KT
  t1: '#E4002B',      // T1
  drx: '#0D6CB5',     // DRX
  brion: '#00A59B',   // 브리온
  fearx: '#1E3D6B',   // FEARX
};

export default function Schedule() {
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [notifications, setNotifications] = useState<{ [key: string]: boolean }>({});
  const [currentMonth, setCurrentMonth] = useState('2024-03');
  const [isDiscordConnected, setIsDiscordConnected] = useState(false);
  const [activePopup, setActivePopup] = useState<string | null>(null);

  // 팝업 내용 정의
  const popupContents = {
    privacy: {
      title: '개인정보 수집 및 이용 안내',
      content: `본 웹사이트는 로그인 및 알림 기능을 제공하기 위해 사용자 인증 정보를 수집할 수 있습니다.

수집되는 정보에는 이메일 주소, 사용자 ID(OAuth 제공자) 등이 포함되며, 이는 인증과 사용자별 설정 저장에만 활용됩니다.

수집된 정보는 외부에 제공되지 않으며, Firebase 등 보안 저장소를 통해 안전하게 관리됩니다.`
    },
    cookies: {
      title: '쿠키 및 로컬 저장소 사용 안내',
      content: `사용자 편의성 향상을 위해 웹 브라우저의 쿠키와 localStorage 기능을 활용할 수 있습니다.

예를 들어, 로그인 상태 유지, 테마 설정, 선호 팀 저장 등이 이에 해당됩니다.

개인 식별에는 사용되지 않으며, 브라우저 설정을 통해 언제든지 삭제하거나 차단할 수 있습니다.`
    },
    terms: {
      title: '서비스 이용 책임 고지',
      content: `본 사이트는 Riot Games 또는 LCK와 무관한 비공식 팬 프로젝트입니다.

표시되는 경기 일정, 알림 등 모든 정보는 공개된 출처를 기반으로 하며, 실시간성이나 정확성을 보장하지 않습니다.

사용자는 본인의 판단과 책임 하에 이 사이트를 이용해야 하며, 본 사이트는 이에 대한 법적 책임을 지지 않습니다.`
    },
    security: {
      title: '보안 및 오류 신고 안내',
      content: `사이트 이용 중 오류나 보안상 문제가 발생한 경우, 아래 이메일로 신고해 주세요.
문제 해결을 위해 성실히 검토 후 조치하겠습니다.

📩 lckalert@gmail.com`
    }
  };

  // 팀 선택 핸들러
  const handleTeamSelect = (teamId: string) => {
    setSelectedTeam(teamId);
  };

  // 필터링된 매치 목록
  const filteredMatches = matches.filter(match => 
    selectedTeam === 'all' || match.team1.id === selectedTeam || match.team2.id === selectedTeam
  );

  const matchesByDate = filteredMatches.reduce((acc, match) => {
    const date = match.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(match);
    return acc;
  }, {} as { [key: string]: typeof matches });

  const toggleNotification = (matchId: string) => {
    setNotifications(prev => ({
      ...prev,
      [matchId]: !prev[matchId]
    }));
  };

  const months = [
    { value: '2024-03', label: '3월' },
    { value: '2024-04', label: '4월' },
    { value: '2024-05', label: '5월' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'black',
      padding: '2rem',
      position: 'relative'
    }}>
      {/* 디스코드 연동 버튼 */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        right: '3rem',
        zIndex: 20
      }}>
        <button
          onClick={() => setIsDiscordConnected(!isDiscordConnected)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            backgroundColor: isDiscordConnected ? '#5865F2' : '#36393f',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="currentColor"/>
          </svg>
          {isDiscordConnected ? '연동됨' : '디스코드 연동'}
        </button>
      </div>

      {/* Resources 섹션 */}
      <div style={{
        position: 'absolute',
        top: '8rem',
        right: '3rem',
        zIndex: 20,
        backgroundColor: '#1a1a1a',
        padding: '1.5rem',
        borderRadius: '10px',
        width: '300px'
      }}>
        <h3 style={{
          color: 'white',
          fontSize: '1.2rem',
          marginTop: 0,
          marginBottom: '1rem',
          borderBottom: '1px solid #333',
          paddingBottom: '0.5rem'
        }}>
          Resources
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {Object.entries(popupContents).map(([key, { title }]) => (
            <button
              key={key}
              onClick={() => setActivePopup(activePopup === key ? null : key)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#888',
                textAlign: 'left',
                padding: '0.5rem',
                cursor: 'pointer',
                borderRadius: '5px',
                transition: 'all 0.2s',
                fontSize: '0.9rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#333';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#888';
              }}
            >
              {title}
            </button>
          ))}
        </div>
      </div>

      {/* 팝업 */}
      {activePopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '2rem',
            borderRadius: '10px',
            width: '90%',
            maxWidth: '500px',
            position: 'relative'
          }}>
            <button
              onClick={() => setActivePopup(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#888',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                borderRadius: '50%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#333';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#888';
              }}
            >
              ×
            </button>
            <h3 style={{
              color: 'white',
              marginTop: 0,
              marginBottom: '1.5rem',
              fontSize: '1.3rem'
            }}>
              {popupContents[activePopup as keyof typeof popupContents].title}
            </h3>
            <div style={{
              color: '#888',
              whiteSpace: 'pre-line',
              lineHeight: '1.6'
            }}>
              {popupContents[activePopup as keyof typeof popupContents].content}
            </div>
          </div>
        </div>
      )}

      {/* LCK 로고 영역 */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto 2rem auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '900',
            color: 'white',
            letterSpacing: '0.1em',
            textShadow: '0 0 20px rgba(255,255,255,0.3)'
          }}>
            LCK
          </h1>
          <p style={{
            color: '#888',
            fontSize: '1.2rem',
            marginTop: '0.5rem'
          }}>
            League of Legends Champions Korea
          </p>
        </div>
        <div style={{
          width: '100%',
          height: '1px',
          background: 'linear-gradient(to right, transparent, #333, transparent)',
          margin: '1rem 0'
        }} />
      </div>

      {/* 상단 컨트롤 영역 */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: 'black',
        paddingBottom: '1rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* 월 선택 */}
        <div style={{
          backgroundColor: '#1a1a1a',
          padding: '1rem',
          borderRadius: '10px',
          marginBottom: '1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <button
              onClick={() => {
                const currentIndex = months.findIndex(m => m.value === currentMonth);
                if (currentIndex > 0) {
                  setCurrentMonth(months[currentIndex - 1].value);
                }
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#333',
                border: 'none',
                borderRadius: '5px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              ◀
            </button>
            <h2 style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: 0
            }}>
              {months.find(m => m.value === currentMonth)?.label} 경기 일정
            </h2>
            <button
              onClick={() => {
                const currentIndex = months.findIndex(m => m.value === currentMonth);
                if (currentIndex < months.length - 1) {
                  setCurrentMonth(months[currentIndex + 1].value);
                }
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#333',
                border: 'none',
                borderRadius: '5px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              ▶
            </button>
          </div>
        </div>

        {/* 팀 필터 */}
        <div style={{
          backgroundColor: '#1a1a1a',
          padding: '1.5rem',
          borderRadius: '10px',
          width: '100%',
          maxWidth: '1600px',
          margin: '0 auto',
          boxSizing: 'border-box'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            justifyContent: 'center',
            flexWrap: 'nowrap'
          }}>
            {/* 전체 버튼 */}
            <button
              onClick={() => handleTeamSelect('all')}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: selectedTeam === 'all' ? '#4A5568' : '#333',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                width: '100px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '45px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = selectedTeam === 'all' ? '#4A5568' : '#444';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = selectedTeam === 'all' ? '#4A5568' : '#333';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              전체
            </button>
            {/* 팀 버튼들 */}
            {teams.filter(team => team.id !== 'all').map(team => (
              <button
                key={team.id}
                onClick={() => handleTeamSelect(team.id)}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: selectedTeam === team.id ? teamColors[team.id] || '#4A5568' : '#333',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  fontWeight: 'normal',
                  fontSize: '0.9rem',
                  width: '160px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '45px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = selectedTeam === team.id ? 
                    teamColors[team.id] || '#4A5568' : 
                    teamColors[team.id] ? `${teamColors[team.id]}99` : '#444';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = selectedTeam === team.id ? 
                    teamColors[team.id] || '#4A5568' : '#333';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {team.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 경기 일정 목록 */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        paddingTop: '1rem'
      }}>
        {Object.entries(matchesByDate).map(([date, dayMatches]) => (
          <div key={date} style={{
            marginBottom: '2rem'
          }}>
            {/* 날짜 헤더 */}
            <div style={{
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              padding: '0.5rem',
              borderBottom: '1px solid #333'
            }}>
              {new Date(date).toLocaleDateString('ko-KR', {
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </div>

            {/* 해당 날짜의 경기들 */}
            {dayMatches.map(match => (
              <div
                key={match.id}
                style={{
                  backgroundColor: '#1a1a1a',
                  padding: '1.25rem',
                  borderRadius: '10px',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {/* 팀1 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  width: '250px'
                }}>
                  <div style={{
                    color: teamColors[match.team1.id] || 'white',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}>
                    {match.team1.name}
                  </div>
                </div>

                {/* 경기 시간과 알림 */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    color: '#888',
                    fontSize: '1.25rem'
                  }}>
                    {match.time}
                  </div>
                  <button
                    onClick={() => toggleNotification(match.id)}
                    style={{
                      backgroundColor: notifications[match.id] ? '#4CAF50' : '#666',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    {notifications[match.id] ? '✅ 알림 설정됨' : '🔔 알림 설정'}
                  </button>
                </div>

                {/* 팀2 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  width: '250px',
                  justifyContent: 'flex-end'
                }}>
                  <div style={{
                    color: teamColors[match.team2.id] || 'white',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    textAlign: 'right'
                  }}>
                    {match.team2.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
} 