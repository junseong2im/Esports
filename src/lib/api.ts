import { UserLoginRequest, UserSignupRequest } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
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

// User 인터페이스 정의 (백엔드 User 엔티티와 매칭)
export interface User {
  id: number;
  loginId: string;
  password?: string; // 보안상 응답에서는 제외
  teamName: string;
  username?: string;
}

interface LoginResponse {
  token: string;
  message: string;
}

interface SignupResponse {
  message: string;
}

export const login = async (loginId: string, password: string): Promise<string> => {
  try {
    const response = await fetchWithRetry(`${API_BASE}/api/users/login`, {
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

    const text = await response.text();
    return text;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('로그인 중 오류가 발생했습니다.');
  }
};

export const signup = async (loginId: string, password: string, teamName: string): Promise<string> => {
  try {
    const response = await fetchWithRetry(`${API_BASE}/api/users/signup`, {
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

    const text = await response.text();
    return text;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('회원가입 중 오류가 발생했습니다.');
  }
};

// ✅ 전체 유저 조회 (백엔드 컨트롤러와 매칭)
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await fetchWithRetry(`${API_BASE}/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || '사용자 목록을 불러오는데 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('사용자 목록 조회 중 오류가 발생했습니다.');
  }
};

// ✅ 단일 유저 조회 (백엔드 컨트롤러와 매칭)
export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await fetchWithRetry(`${API_BASE}/api/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || '사용자 정보를 불러오는데 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('사용자 정보 조회 중 오류가 발생했습니다.');
  }
};

export const fetchMatches = async () => {
  try {
    const response = await fetchWithRetry(`${API_BASE}/api/schedules/crawl`, {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error('경기 일정을 불러오는데 실패했습니다.');
    }
    return await response.text();
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    throw error;
  }
};

// 추후 구현 예정
/*
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
*/

export const testConnection = async () => {
  try {
    console.log('Attempting to connect to:', `${API_BASE}/api/users`);  // URL 로깅 추가
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