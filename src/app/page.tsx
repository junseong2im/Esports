'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// 배경 이미지 배열
const backgroundImages = [
  '/images/background/slide1.jpg',
  '/images/background/slide2.jpg',
  '/images/background/slide3.jpg',
  '/images/background/slide4.jpg',
  '/images/background/slide5.jpg',
  '/images/background/slide6.jpg',
  '/images/background/slide7.jpg'
];

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 이미지 슬라이드쇼 효과
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3500); // 이미지 전환 간격 (3.5초)

    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      router.push('/schedule');
    } else {
      setMessage('회원가입이 완료되었습니다.');
      setIsLogin(true);
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
        <Image
          src={backgroundImages[currentImageIndex]}
          alt="Background"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          priority
        />
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
                placeholder="아이디"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            <div style={{ marginBottom: '2rem' }}>
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button
                type="submit"
                style={{
                  padding: '0.8rem 1.5rem',
                  fontSize: '1rem',
                  backgroundColor: isLogin ? '#1da1f2' : 'transparent',
                  border: isLogin ? 'none' : '1px solid #1da1f2',
                  borderRadius: '5px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '45%',
                  fontWeight: 'bold'
                }}
              >
                {isLogin ? '로그인' : '회원가입'}
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                style={{
                  padding: '0.8rem 1.5rem',
                  fontSize: '1rem',
                  backgroundColor: !isLogin ? '#1da1f2' : 'transparent',
                  border: !isLogin ? 'none' : '1px solid #1da1f2',
                  borderRadius: '5px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '45%',
                  fontWeight: 'bold'
                }}
              >
                {!isLogin ? '회원가입' : '계정 만들기'}
              </button>
            </div>
            {message && (
              <p style={{
                marginTop: '1rem',
                textAlign: 'center',
                color: '#4CAF50'
              }}>
                {message}
              </p>
            )}
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
