'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, signup } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageTransition from '@/components/PageTransition';
import { showToast } from '@/lib/toast';
import { teams } from '@/lib/data';
import { validateLoginId, validatePassword, validateTeamName } from '@/types';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [teamName, setTeamName] = useState('T1');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(loginId, password);
        localStorage.setItem('token', btoa(`${loginId}:${password}`));
        showToast('로그인 성공!');
        router.push('/schedule');
      } else {
        // 회원가입 시 프론트엔드에서도 유효성 검사
        if (!validateLoginId(loginId)) {
          showToast('ID는 영어 알파벳만 사용할 수 있습니다.');
          return;
        }
        if (!validatePassword(password)) {
          showToast('비밀번호는 영어+숫자 조합으로 6자 이상이어야 합니다.');
          return;
        }
        if (!validateTeamName(teamName)) {
          showToast('존재하지 않는 팀입니다.');
          return;
        }

        await signup(loginId, password, teamName);
        showToast('회원가입 성공! 로그인해주세요.');
        setIsLogin(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message);
      } else {
        showToast(isLogin ? '로그인 실패' : '회원가입 실패');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.4)' }}
        >
          <source src="/videos/login-bg.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 bg-black bg-opacity-70 p-8 rounded-lg shadow-xl w-96">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            {isLogin ? '로그인' : '회원가입'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="아이디"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
            {!isLogin && (
              <div>
                <select
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  {teams.filter(team => team.id !== 'all').map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {loading ? <LoadingSpinner /> : (isLogin ? '로그인' : '회원가입')}
            </button>
          </form>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-gray-400 mt-4 hover:text-white focus:outline-none"
          >
            {isLogin ? '회원가입하기' : '로그인하기'}
          </button>
        </div>
      </div>
    </PageTransition>
  );
} 