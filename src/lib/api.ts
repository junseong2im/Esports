import { UserLoginRequest, UserSignupRequest } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface LoginResponse {
  token: string;
  message: string;
}

interface SignupResponse {
  message: string;
}

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

    const text = await response.text();
    return text;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('회원가입 중 오류가 발생했습니다.');
  }
};

export const fetchMatches = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/schedules/crawl`);
    if (!response.ok) {
      throw new Error('경기 일정을 불러오는데 실패했습니다.');
    }
    return await response.text();
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    throw error;
  }
};

export const subscribeToMatch = async (matchId: string, token: string) => {
  try {
    const response = await fetch(`${API_BASE}/api/matches/${matchId}/subscribe`, {
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
    const response = await fetch(`${API_BASE}/api/matches/${matchId}/unsubscribe`, {
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

export const testConnection = async () => {
  try {
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