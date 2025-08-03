import { UserLoginRequest, UserSignupRequest } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const fetchMatchSchedule = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/matches`);
    if (!response.ok) {
      throw new Error('Failed to fetch match schedule');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching match schedule:', error);
    throw error;
  }
};

export const login = async (loginId: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ loginId, password } as UserLoginRequest),
    });
    
    const text = await response.text();
    
    if (!response.ok) {
      throw new Error(text || 'Login failed');
    }
    
    return text;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('로그인 중 오류가 발생했습니다.');
  }
};

export const signup = async (loginId: string, password: string, teamName: string) => {
  try {
    const response = await fetch(`${API_BASE}/api/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ loginId, password, teamName } as UserSignupRequest),
    });
    
    const text = await response.text();
    
    if (!response.ok) {
      throw new Error(text || 'Signup failed');
    }
    
    return text;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('회원가입 중 오류가 발생했습니다.');
  }
}; 