import { MatchSchedule } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://esportscalender-nzpn.onrender.com';

// 사용자 관련 API
export const signup = async (loginId: string, password: string, teamName: string) => {
  const response = await fetch(`${API_BASE}/api/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ loginId, password, teamName }),
  });

  if (!response.ok) {
    throw new Error('회원가입 실패');
  }

  return response.text();
};

export const login = async (loginId: string, password: string) => {
  const response = await fetch(`${API_BASE}/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ loginId, password }),
  });

  if (!response.ok) {
    throw new Error('로그인 실패');
  }

  return response.text();
};

// 경기 일정 관련 API
export const fetchMatches = async (from?: string, to?: string) => {
  const params = new URLSearchParams();
  if (from) params.append('from', from);
  if (to) params.append('to', to);
  
  const response = await fetch(`${API_BASE}/api/schedules?${params.toString()}`, {
    headers: {
      'Authorization': `Basic ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('경기 일정 조회 실패');
  }

  return response.json() as Promise<MatchSchedule[]>;
};

export const fetchTeamMatches = async (team: string) => {
  const response = await fetch(`${API_BASE}/api/schedules/team/${team}`, {
    headers: {
      'Authorization': `Basic ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('팀 경기 일정 조회 실패');
  }

  return response.json() as Promise<MatchSchedule[]>;
};

export const crawlMatches = async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await fetch(`${API_BASE}/api/schedules/crawl?${params.toString()}`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('경기 일정 크롤링 실패');
  }

  return response.text();
};

// 디스코드 알림 관련 API
export const testDiscordWebhook = async (webhookUrl: string) => {
  const response = await fetch(`${API_BASE}/api/alerts/discord/test`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ webhookUrl }),
  });

  if (!response.ok) {
    throw new Error('디스코드 웹훅 테스트 실패');
  }

  return response.json();
};

export const subscribeToTeam = async (teamName: string, webhookUrl: string, advanceMin: number = 10) => {
  const response = await fetch(`${API_BASE}/api/alerts/discord/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ teamName, webhookUrl, advanceMin }),
  });

  if (!response.ok) {
    throw new Error('알림 구독 실패');
  }

  return response.json();
};

export const listSubscriptions = async () => {
  const response = await fetch(`${API_BASE}/api/alerts/discord/subscriptions`, {
    headers: {
      'Authorization': `Basic ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('구독 목록 조회 실패');
  }

  return response.json();
};

export const deactivateSubscription = async (id: number) => {
  const response = await fetch(`${API_BASE}/api/alerts/discord/subscriptions/${id}/deactivate`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Basic ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('구독 비활성화 실패');
  }

  return response.json();
};

export const deleteSubscription = async (id: number) => {
  const response = await fetch(`${API_BASE}/api/alerts/discord/subscriptions/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Basic ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('구독 삭제 실패');
  }

  return response.json();
}; 