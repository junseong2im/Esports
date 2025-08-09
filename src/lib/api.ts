import { UserLoginRequest, UserSignupRequest, MatchSchedule } from '@/types';

const API_BASE = 'https://esportscalender-nzpn.onrender.com';

// ✅ 회원가입: loginId + password + teamName
export const signup = async (loginId: string, password: string, teamName: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE}/api/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ loginId, password, teamName }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || '회원가입에 실패했습니다.');
    }

    return await response.text();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('회원가입 중 오류가 발생했습니다.');
  }
};

// ✅ 로그인: loginId + password
export const login = async (loginId: string, password: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ loginId, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || '로그인에 실패했습니다.');
    }

    return await response.text();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('로그인 중 오류가 발생했습니다.');
  }
};

// 백엔드 연결 테스트
export const testConnection = async () => {
  try {
    console.log('Attempting to connect to:', `${API_BASE}/api/users`);
    const response = await fetch(`${API_BASE}/api/users`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    console.log('Backend connection test:', data);
    return data;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    throw error;
  }
};

// ✅ 경기 일정 수동 크롤링 실행 (POST /api/schedules/crawl)
export const crawlMatches = async (startDate: string, endDate: string): Promise<string> => {
  try {
    const params = new URLSearchParams({ startDate, endDate });
    const response = await fetch(`${API_BASE}/api/schedules/crawl?${params.toString()}`, {
      method: 'POST',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || '크롤링에 실패했습니다.');
    }

    return await response.text();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('크롤링 중 오류가 발생했습니다.');
  }
};

// ✅ 경기 일정 조회 (GET /api/schedules?from=...&to=...)
export const fetchMatches = async (from?: string, to?: string): Promise<MatchSchedule[]> => {
  try {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);

    const url = `${API_BASE}/api/schedules${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch matches:', response.status, errorText);
      throw new Error('경기 일정을 불러오는데 실패했습니다.');
    }

    const data = await response.json();
    console.log('Raw API response:', data);
    return data as MatchSchedule[];
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    throw error;
  }
}; 