'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = "https://esportscalender.onrender.com";
const VALID_TEAMS = ["T1", "Gen.G", "DK", "HLE", "KT", "NS", "BRO", "DRX", "KDF", "LSB"] as const;
type TeamName = typeof VALID_TEAMS[number];

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<TeamName>("T1");
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: username, password })
      });
      
      const text = await res.text();
      
      if (text.includes("로그인 성공")) {
        router.push('/schedule');
      } else {
        setMessage(text || '로그인에 실패했습니다.');
      }
    } catch (error) {
      setMessage('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
      console.error('Login error:', error);
    }
  };

  const handleSignup = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginId: username,
          password,
          teamName: selectedTeam
        })
      });

      const text = await res.text();
      
      if (res.ok) {
        setMessage('회원가입이 완료되었습니다.');
        setIsLogin(true);
        setUsername('');
        setPassword('');
      } else {
        setMessage(text || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      setMessage('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
      console.error('Signup error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !username || !password) {
      setMessage('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      if (isLogin) {
        await handleLogin();
      } else {
        await handleSignup();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'black',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '2rem',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '0.5rem'
          }}>LCK</h1>
          <p style={{ color: '#666' }}>League of Legends Champions Korea</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#333',
                border: '1px solid #444',
                borderRadius: '5px',
                color: 'white',
                marginBottom: '1rem'
              }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#333',
                border: '1px solid #444',
                borderRadius: '5px',
                color: 'white',
                marginBottom: !isLogin ? '1rem' : '0'
              }}
            />
            {!isLogin && (
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value as TeamName)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#333',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  color: 'white',
                  appearance: 'none',
                  cursor: 'pointer'
                }}
              >
                {VALID_TEAMS.map((team) => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            )}
          </div>

          {message && (
            <p style={{ 
              textAlign: 'center', 
              marginBottom: '1rem',
              color: message.includes('완료') || message.includes('성공') ? '#4CAF50' : '#f44336',
              fontSize: '0.875rem'
            }}>
              {message}
            </p>
          )}

          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: isLoading ? '#2D3748' : '#4A5568',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setIsLogin(!isLogin);
                setUsername('');
                setPassword('');
                setMessage('');
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#333',
                color: 'white',
                border: '1px solid #444',
                borderRadius: '5px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLogin ? '회원가입하기' : '로그인으로 돌아가기'}
            </button>
          </div>
        </form>
      </div>
      
      {/* 면책 조항 */}
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        textAlign: 'center',
        color: '#666',
        fontSize: '0.8rem',
        maxWidth: '400px',
        padding: '0 1rem'
      }}>
        <p style={{ margin: '0.5rem 0' }}>
          본 서비스는 Riot Games 및 LCK와 무관한 비공식 프로젝트입니다.
        </p>
        <p style={{ margin: '0.5rem 0', fontSize: '0.75rem' }}>
          이 프로젝트는 팬 커뮤니티를 위한 비영리 서비스입니다.
        </p>
      </div>
    </div>
  );
}
