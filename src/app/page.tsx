'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<{ id: string; password: string; }[]>([]);
  const [message, setMessage] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const user = users.find(u => u.id === username && u.password === password);
      if (user) {
        router.push('/schedule');
      } else {
        setMessage('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } else {
      if (!isIdChecked) {
        setMessage('아이디 중복 확인을 해주세요.');
        return;
      }
      setUsers([...users, { id: username, password }]);
      setMessage('회원가입이 완료되었습니다.');
      setIsLogin(true);
      setUsername('');
      setPassword('');
      setIsIdChecked(false);
    }
  };

  const checkDuplicateId = () => {
    if (!username) {
      setMessage('아이디를 입력해주세요.');
      return;
    }
    if (users.some(user => user.id === username)) {
      setMessage('이미 사용 중인 아이디입니다.');
      setIsIdChecked(false);
    } else {
      setMessage('사용 가능한 아이디입니다.');
      setIsIdChecked(true);
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
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setIsIdChecked(false);
                }}
                placeholder="아이디"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#333',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  color: 'white'
                }}
              />
              {!isLogin && (
                <button
                  type="button"
                  onClick={checkDuplicateId}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#4A5568',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  중복확인
                </button>
              )}
            </div>
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
                color: 'white'
              }}
            />
        </div>

          {message && (
            <p style={{ 
              textAlign: 'center', 
              marginBottom: '1rem',
              color: message.includes('완료') || message.includes('사용 가능') ? '#4CAF50' : '#f44336',
              fontSize: '0.875rem'
            }}>
              {message}
            </p>
          )}

          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#4A5568',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {isLogin ? '로그인' : '회원가입'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setUsername('');
                setPassword('');
                setMessage('');
                setIsIdChecked(false);
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#333',
                color: 'white',
                border: '1px solid #444',
                borderRadius: '5px',
                cursor: 'pointer'
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
