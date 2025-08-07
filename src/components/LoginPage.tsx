'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, signup, testConnection } from '@/lib/api';
import { VALID_TEAMS, TeamName } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageTransition from '@/components/PageTransition';
import Toast from '@/components/Toast';
import { useNetwork } from '@/hooks/useNetwork';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<TeamName>("T1");
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [toastConfig, setToastConfig] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({ show: false, message: '', type: 'info' });
  
  const { isOnline, isConnectionSlow } = useNetwork();

  // 네트워크 상태 모니터링
  useEffect(() => {
    if (!isOnline) {
      showToast('인터넷 연결이 끊겼습니다. 연결을 확인해주세요.', 'error');
    }
    if (isConnectionSlow) {
      showToast('인터넷 연결이 불안정합니다.', 'warning');
    }
  }, [isOnline, isConnectionSlow]);

  useEffect(() => {
    // 백엔드 연결 테스트
    const testBackendConnection = async () => {
      try {
        await testConnection();
        console.log('Backend is connected!');
      } catch (error) {
        console.error('Backend connection failed:', error);
        showToast('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error');
      }
    };

    testBackendConnection();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToastConfig({ show: true, message, type });
  };

  // 비밀번호 강도 체크
  const checkPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.match(/[a-z]/)) strength++;
    if (pass.match(/[A-Z]/)) strength++;
    if (pass.match(/[0-9]/)) strength++;
    setPasswordStrength(strength);
  };

  // 아이디 유효성 검사
  const validateId = (id: string) => {
    return /^[a-zA-Z]+$/.test(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginId || !password) {
      showToast('아이디와 비밀번호를 입력해주세요.', 'error');
      return;
    }

    if (!isLogin && !selectedTeam) {
      showToast('응원하는 팀을 선택해주세요.', 'error');
      return;
    }

    if (!isLogin && (!agreeTerms || !agreePrivacy)) {
      showToast('이용약관과 개인정보 처리방침에 동의해주세요.', 'error');
      return;
    }

    if (!validateId(loginId)) {
      showToast('아이디는 영문만 사용 가능합니다.', 'error');
      return;
    }

    if (password.length < 6 || !password.match(/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/)) {
      showToast('비밀번호는 영문+숫자 조합으로 6자 이상이어야 합니다.', 'error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const response = await login(loginId, password);
        // 토큰 형식 수정
        const token = btoa(`${loginId}:${password}`);  // Base64 인코딩
        localStorage.setItem('token', token);
        showToast('로그인 성공!', 'success');
        setTimeout(() => router.push('/schedule'), 1000);
      } else {
        const response = await signup(loginId, password, selectedTeam);
        showToast('회원가입이 완료되었습니다!', 'success');
        setIsLogin(true);
        setLoginId('');
        setPassword('');
        setAgreeTerms(false);
        setAgreePrivacy(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
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
            src="https://www.youtube.com/embed/MzS9SlcL33E?autoplay=1&mute=1&controls=0&loop=1&playlist=MzS9SlcL33E&showinfo=0&rel=0&vq=hd1080&hd=1&modestbranding=1&iv_load_policy=3&disablekb=1&playsinline=1&enablejsapi=0&origin=http://localhost:3000&widget_referrer=http://localhost:3000&cc_load_policy=0&fs=0&modestbranding=1&autohide=1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '177.77777778vh', /* 16:9 비율 */
              height: '56.25vw',  /* 16:9 비율 */
              minWidth: '100%',
              minHeight: '100%',
              transform: 'translate(-50%, -50%)',
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
            marginBottom: '2rem',
            transform: 'translateY(-20px)',
            opacity: 1,
            transition: 'all 0.5s ease-in-out'
          }}>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 'bold',
              color: '#ffffff',
              textShadow: '0 0 10px rgba(0,0,0,0.5)',
              marginBottom: '0.5rem',
              letterSpacing: '2px'
            }}>LCK</h1>
            <p style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
              color: '#ffffff',
              opacity: 0.9,
              textShadow: '0 0 5px rgba(0,0,0,0.5)'
            }}>League of Legends Champions Korea</p>
          </div>

          {/* 로그인 폼 */}
          <div style={{
            backgroundColor: 'rgba(15, 15, 15, 0.9)',
            backdropFilter: 'blur(10px)',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transform: 'translateY(0)',
            opacity: 1,
            transition: 'all 0.3s ease-in-out'
          }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="아이디 (영문)"
                  value={loginId}
                  onChange={(e) => {
                    setLoginId(e.target.value);
                    if (!validateId(e.target.value)) {
                      setMessage('아이디는 영문만 사용 가능합니다.');
                    } else {
                      setMessage('');
                    }
                  }}
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
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1da1f2';
                    e.target.style.boxShadow = '0 0 0 2px rgba(29, 161, 242, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={{ marginBottom: !isLogin ? '1.5rem' : '2rem' }}>
                <input
                  type="password"
                  placeholder="비밀번호 (영문+숫자 6자 이상)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    checkPasswordStrength(e.target.value);
                  }}
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
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1da1f2';
                    e.target.style.boxShadow = '0 0 0 2px rgba(29, 161, 242, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {!isLogin && password && (
                  <div style={{
                    marginTop: '0.5rem',
                    height: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(passwordStrength / 4) * 100}%`,
                      height: '100%',
                      backgroundColor: passwordStrength <= 1 ? '#ff4444' : 
                                     passwordStrength === 2 ? '#ffbb33' : 
                                     passwordStrength === 3 ? '#00C851' : '#007E33',
                      transition: 'all 0.3s ease'
                    }} />
                  </div>
                )}
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
                        transition: 'all 0.2s ease',
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
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        marginBottom: '0.5rem',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#1da1f2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#ffffff';
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        style={{
                          width: '1rem',
                          height: '1rem',
                          accentColor: '#1da1f2',
                          cursor: 'pointer'
                        }}
                      />
                      서비스 이용약관 동의 (필수)
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#1da1f2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#ffffff';
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={agreePrivacy}
                        onChange={(e) => setAgreePrivacy(e.target.checked)}
                        style={{
                          width: '1rem',
                          height: '1rem',
                          accentColor: '#1da1f2',
                          cursor: 'pointer'
                        }}
                      />
                      개인정보 수집 및 이용 동의 (필수)
                    </label>
                  </div>
                </>
              )}
              {message && (
                <div style={{
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  borderRadius: '5px',
                  backgroundColor: message.includes('성공') ? 'rgba(0, 200, 81, 0.1)' : 'rgba(255, 68, 68, 0.1)',
                  border: `1px solid ${message.includes('성공') ? '#00C851' : '#ff4444'}`,
                  color: message.includes('성공') ? '#00C851' : '#ff4444',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  animation: 'fadeIn 0.3s ease-in-out'
                }}>
                  {message}
                </div>
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
                    transition: 'all 0.2s ease',
                    width: '45%',
                    fontWeight: 'bold',
                    opacity: isLoading ? 0.7 : 1,
                    transform: 'scale(1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.backgroundColor = isLogin ? '#1a91da' : 'rgba(29, 161, 242, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = isLogin ? '#1da1f2' : 'transparent';
                    }
                  }}
                  onMouseDown={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.transform = 'scale(0.98)';
                    }
                  }}
                  onMouseUp={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="small" color="#ffffff" />
                      <span>처리 중...</span>
                    </>
                  ) : (
                    isLogin ? '로그인' : '가입하기'
                  )}
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
                    transition: 'all 0.2s ease',
                    width: '45%',
                    fontWeight: 'bold',
                    opacity: isLoading ? 0.7 : 1,
                    transform: 'scale(1)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.backgroundColor = !isLogin ? '#1a91da' : 'rgba(29, 161, 242, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = !isLogin ? '#1da1f2' : 'transparent';
                    }
                  }}
                  onMouseDown={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.transform = 'scale(0.98)';
                    }
                  }}
                  onMouseUp={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  {!isLogin ? '돌아가기' : '계정 만들기'}
                </button>
              </div>
            </form>
          </div>

          {/* 저작권 및 법적 고지 */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '800px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
            textAlign: 'center',
            zIndex: 2,
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '5px',
          }}>
            <p>
              본 서비스는 Riot Games 및 LCK와 무관한 비공식 프로젝트입니다.
              이 프로젝트는 팬 커뮤니티를 위한 비영리 서비스입니다.
              배경 영상 출처: © 2024 LCK All Rights Reserved.
            </p>
          </div>

          {/* 토스트 메시지 */}
          {toastConfig.show && (
            <Toast
              message={toastConfig.message}
              type={toastConfig.type}
              onClose={() => setToastConfig(prev => ({ ...prev, show: false }))}
            />
          )}

          {/* 네트워크 상태 표시 (오프라인일 때) */}
          {!isOnline && (
            <div style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              backgroundColor: 'rgba(255, 68, 68, 0.9)',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '0.9rem',
              zIndex: 9999,
            }}>
              오프라인 모드
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
} 