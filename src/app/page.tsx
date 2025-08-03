'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { login, signup } from '@/lib/api';
import { VALID_TEAMS, TeamName } from '@/types';

// 배경 이미지 배열
const backgroundImages = [
  '/images/background/slide1.jpg',
  // 다른 이미지들은 주석 처리하거나 제거
];

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<TeamName>("T1");
  const [message, setMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 이미지가 2개 이상일 때만 슬라이드쇼 실행
  useEffect(() => {
    if (backgroundImages.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 3500);

      return () => clearInterval(intervalId);
    }
  }, []);

  // 입력값 유효성 검사
  const validateInput = () => {
    if (!loginId || !password) {
      setMessage('아이디와 비밀번호를 모두 입력해주세요.');
      return false;
    }

    if (!isLogin) {
      // 회원가입 시 추가 검증
      if (!loginId.match("^[a-zA-Z]+$")) {
        setMessage('ID는 영어 알파벳만 사용할 수 있습니다.');
        return false;
      }

      if (!password.match("^(?=.*[a-zA-Z])(?=.*\\d).{6,}$")) {
        setMessage('비밀번호는 영어+숫자 조합으로 6자 이상이어야 합니다.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInput()) return;

    setIsLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const response = await login(loginId, password);
        if (response.includes('성공')) {
          router.push('/schedule');
        } else {
          setMessage(response);
        }
      } else {
        await signup(loginId, password, selectedTeam);
        setMessage('회원가입이 완료되었습니다.');
        setIsLogin(true);
        setLoginId('');
        setPassword('');
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden',
      backgroundColor: '#000'
    }}>
      {/* 배경 이미지 슬라이드쇼 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}>
        {backgroundImages.map((image, index) => (
          <div
            key={image}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: index === currentImageIndex ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: index === currentImageIndex ? 1 : 0,
            }}
          >
            <Image
              src={image}
              alt={`Background ${index + 1}`}
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* 어두운 오버레이 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1
      }} />

      {/* 로그인 컨테이너 */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        {/* LCK 타이틀 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#ffffff',
            textShadow: '0 0 10px rgba(0,0,0,0.5)'
          }}>LCK</h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#ffffff',
            opacity: 0.9,
            textShadow: '0 0 5px rgba(0,0,0,0.5)'
          }}>League of Legends Champions Korea</p>
        </div>

        {/* 로그인 폼 */}
        <div style={{
          backgroundColor: 'rgba(15, 15, 15, 0.9)',
          backdropFilter: 'blur(10px)',
          padding: '2.5rem',
          borderRadius: '10px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="아이디 (영문)"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  fontSize: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '5px',
                  color: '#ffffff',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>
            <div style={{ marginBottom: !isLogin ? '1.5rem' : '2rem' }}>
              <input
                type="password"
                placeholder="비밀번호 (영문+숫자 6자 이상)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  fontSize: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '5px',
                  color: '#ffffff',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>
            {!isLogin && (
              <div style={{ marginBottom: '2rem' }}>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value as TeamName)}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    fontSize: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '5px',
                    color: '#ffffff',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                >
                  {VALID_TEAMS.map((team) => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
            )}
            {message && (
              <p style={{
                marginBottom: '1rem',
                textAlign: 'center',
                color: message.includes('성공') ? '#4CAF50' : '#f44336',
                fontSize: '0.9rem'
              }}>
                {message}
              </p>
            )}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '0.8rem 1.5rem',
                  fontSize: '1rem',
                  backgroundColor: isLogin ? '#1da1f2' : 'transparent',
                  border: isLogin ? 'none' : '1px solid #1da1f2',
                  borderRadius: '5px',
                  color: '#ffffff',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  width: '45%',
                  fontWeight: 'bold',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setLoginId('');
                  setPassword('');
                  setMessage('');
                }}
                disabled={isLoading}
                style={{
                  padding: '0.8rem 1.5rem',
                  fontSize: '1rem',
                  backgroundColor: !isLogin ? '#1da1f2' : 'transparent',
                  border: !isLogin ? 'none' : '1px solid #1da1f2',
                  borderRadius: '5px',
                  color: '#ffffff',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  width: '45%',
                  fontWeight: 'bold',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {!isLogin ? '회원가입' : '계정 만들기'}
              </button>
            </div>
          </form>
        </div>

        {/* 면책 조항 */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.8rem',
          maxWidth: '600px',
          padding: '0 1rem',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          <p>본 서비스는 Riot Games 및 LCK와 무관한 비공식 프로젝트입니다.</p>
          <p>이 프로젝트는 팬 커뮤니티를 위한 비영리 서비스입니다.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
            배경 이미지 출처: © LCK Flickr (https://www.flickr.com/photos/leagueoflegendslck/)
          </p>
        </div>
      </div>
    </div>
  );
}
