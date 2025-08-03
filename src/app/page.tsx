'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, signup } from '@/lib/api';
import { VALID_TEAMS, TeamName } from '@/types';

// 배경 동영상
const backgroundVideo = '/videos/background.mp4';

export default function Home() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<TeamName>("T1");
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // 동영상 자동 재생 설정
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
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
    
    if (!isLogin && (!agreeTerms || !agreePrivacy)) {
      setMessage('이용약관과 개인정보 처리방침에 동의해주세요.');
      return;
    }

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
      {/* 배경 동영상 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}>
        <iframe
          src="https://www.youtube.com/embed/MzS9SlcL33E?autoplay=1&mute=1&controls=0&loop=1&playlist=MzS9SlcL33E&showinfo=0&rel=0&vq=hd1080&hd=1&modestbranding=1&iv_load_policy=3&disablekb=1&playsinline=1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100vw',
            height: '100vh',
            transform: 'translate(-50%, -50%) scale(1.1)',
            border: 'none',
            objectFit: 'cover',
            pointerEvents: 'none',
          }}
          loading="eager"
          title="LCK Background Video"
          frameBorder="0"
        />
      </div>

      {/* 어두운 오버레이 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 1
      }} />

      {/* 우승팀 정보 */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '0.9rem',
        textAlign: 'right',
        zIndex: 2,
        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        padding: '0.75rem 1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: '5px',
      }}>
        2024 LCK Summer Split 우승팀 Hanwha Life Esports
      </div>

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
              <>
                <div style={{ marginBottom: '1.5rem' }}>
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
                      appearance: 'none',
                      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.7rem top 50%',
                      backgroundSize: '0.65rem auto',
                    }}
                  >
                    {VALID_TEAMS.map((team) => (
                      <option 
                        key={team} 
                        value={team}
                        style={{
                          backgroundColor: 'rgb(30, 30, 30)',
                          color: '#ffffff',
                          padding: '0.5rem'
                        }}
                      >
                        {team}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    marginBottom: '0.5rem'
                  }}>
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      style={{
                        width: '1rem',
                        height: '1rem',
                        accentColor: '#1da1f2'
                      }}
                    />
                    서비스 이용약관 동의 (필수)
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={agreePrivacy}
                      onChange={(e) => setAgreePrivacy(e.target.checked)}
                      style={{
                        width: '1rem',
                        height: '1rem',
                        accentColor: '#1da1f2'
                      }}
                    />
                    개인정보 수집 및 이용 동의 (필수)
                  </label>
                </div>
              </>
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
                {isLoading ? '처리 중...' : (isLogin ? '로그인' : '가입하기')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setLoginId('');
                  setPassword('');
                  setMessage('');
                  setAgreeTerms(false);
                  setAgreePrivacy(false);
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
                {!isLogin ? '돌아가기' : '계정 만들기'}
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
