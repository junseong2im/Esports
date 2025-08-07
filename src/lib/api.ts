import { UserLoginRequest, UserSignupRequest } from '@/types';

const API_BASE = 'https://esportscalender-nzpn.onrender.com';
const MAX_RETRIES = 2;
const RETRY_DELAY = 2000; // 2초

// 재시도 로직을 포함한 fetch 함수
const fetchWithRetry = async (url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    if (!response.ok && retries > 0) {
      // 500 에러나 네트워크 에러의 경우 재시도
      if (response.status === 500 || response.status === 503 || response.status === 504) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchWithRetry(url, options, retries - 1);
      }
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};

// ✅ 회원가입: loginId + password + teamName
export const signup = async (loginId: string, password: string, teamName: string): Promise<string> => {
  try {
    const request: UserSignupRequest = { loginId, password, teamName };
    const response = await fetchWithRetry(`${API_BASE}/api/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
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
    const request: UserLoginRequest = { loginId, password };
    const response = await fetchWithRetry(`${API_BASE}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
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

// 경기 일정 관련 API
export const fetchMatches = async () => {
  try {
    const response = await fetchWithRetry(`${API_BASE}/api/schedules/crawl`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error('경기 일정을 불러오는데 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    throw error;
  }
};

// 경기 알림 설정
export const subscribeToMatch = async (matchId: string, token: string) => {
  try {
    const response = await fetchWithRetry(`${API_BASE}/api/matches/${matchId}/subscribe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('경기 알림 설정에 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to subscribe to match:', error);
    throw error;
  }
};

// 경기 알림 해제
export const unsubscribeFromMatch = async (matchId: string, token: string) => {
  try {
    const response = await fetchWithRetry(`${API_BASE}/api/matches/${matchId}/unsubscribe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('경기 알림 해제에 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to unsubscribe from match:', error);
    throw error;
  }
};

// 백엔드 연결 테스트
export const testConnection = async () => {
  try {
    console.log('Attempting to connect to:', `${API_BASE}/api/users`);
    const response = await fetchWithRetry(`${API_BASE}/api/users`, {
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