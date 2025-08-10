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

// ✅ 경기 일정 조회
export const fetchMatches = async (): Promise<MatchSchedule[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
    }

    const response = await fetch(`${API_BASE}/api/schedules`, {
      headers: {
        'Authorization': `Basic ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(errorText || '경기 일정을 불러오는데 실패했습니다.');
    }

    const matches = await response.json();
    return matches;
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('경기 일정을 불러오는데 실패했습니다.');
  }
};

// ✅ LCK 전체 시즌 크롤링
export const crawlMatches = async (): Promise<string> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
    }

    // 2025년 1월 1일부터 8월 31일까지 크롤링
    const startDate = '2025-01-01';
    const endDate = '2025-08-31';

    const response = await fetch(`${API_BASE}/api/schedules/crawl?startDate=${startDate}&endDate=${endDate}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(errorText || '크롤링에 실패했습니다.');
    }

    return await response.text();
  } catch (error) {
    console.error('Failed to crawl matches:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('크롤링 중 오류가 발생했습니다.');
  }
};

// ✅ 팀별 경기 일정 조회
export const fetchTeamMatches = async (team: string): Promise<MatchSchedule[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
    }

    const response = await fetch(`${API_BASE}/api/schedules/team/${encodeURIComponent(team)}`, {
      headers: {
        'Authorization': `Basic ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(errorText || '팀 경기 일정을 불러오는데 실패했습니다.');
    }

    const matches = await response.json();
    return matches;
  } catch (error) {
    console.error('Failed to fetch team matches:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('팀 경기 일정을 불러오는데 실패했습니다.');
  }
};

// ✅ 다가오는 경기 조회
export const fetchUpcomingMatches = async (count: number = 5): Promise<MatchSchedule[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
    }

    const response = await fetch(`${API_BASE}/api/schedules/upcoming?n=${count}`, {
      headers: {
        'Authorization': `Basic ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(errorText || '다가오는 경기 일정을 불러오는데 실패했습니다.');
    }

    const matches = await response.json();
    return matches;
  } catch (error) {
    console.error('Failed to fetch upcoming matches:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('다가오는 경기 일정을 불러오는데 실패했습니다.');
  }
}; 