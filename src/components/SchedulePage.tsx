'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { teams } from '@/lib/data';

export default function SchedulePage() {
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [currentMonth, setCurrentMonth] = useState('2024-03');

  useEffect(() => {
    // 로그인 체크
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/');
        return;
      }
    };

    checkAuth();
  }, [router]);

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
              onClick={() => setSelectedTeam('all')}
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
                onClick={() => setSelectedTeam(team.id)}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: selectedTeam === team.id ? '#4A5568' : '#333',
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
                  e.currentTarget.style.backgroundColor = selectedTeam === team.id ? '#4A5568' : '#444';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = selectedTeam === team.id ? '#4A5568' : '#333';
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
        <div style={{
          color: '#888',
          textAlign: 'center',
          padding: '2rem'
        }}>
          백엔드 API 연동 후 경기 일정이 표시됩니다.
        </div>
      </div>
    </div>
  );
} 