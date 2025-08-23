// 경기 일정 관련 타입
export interface MatchSchedule {
  id: number;
  externalGameId?: string;
  gameName: string;
  teamA: string;
  teamB: string;
  matchDate: string;
  notified: boolean;
  matchStatus: string;
  leagueName: string;
  teamALogo?: string;
  teamBLogo?: string;
  createdAt: string;
  updatedAt: string;
}

// 사용자 관련 타입
export interface User {
  id: number;
  loginId: string;
  username: string;
  teamName: string;
}

// 알림 구독 관련 타입
export interface UserAlarm {
  id: number;
  teamName: string;
  webhookUrl: string;
  advanceMin: number;
  active: boolean;
}

// API 요청 타입
export interface UserSignupRequest {
  loginId: string;  // 알파벳만 허용
  password: string; // 영어+숫자 조합, 6자 이상
  teamName: string; // validTeams에 포함된 값만 허용
}

export interface UserLoginRequest {
  loginId: string;
  password: string;
}

export interface DiscordWebhookRequest {
  webhookUrl: string; // https://discord.com/api/webhooks/로 시작
}

export interface SubscribeRequest {
  teamName: string;   // "ALL" 또는 팀명
  webhookUrl: string; // Discord Webhook URL
  advanceMin: number; // 기본값 10, 최소 1
}

// 유효성 검사 함수
export const validateLoginId = (loginId: string): boolean => {
  return /^[a-zA-Z]+$/.test(loginId);
};

export const validatePassword = (password: string): boolean => {
  return /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/.test(password);
};

export const validateWebhookUrl = (url: string): boolean => {
  return /^https:\/\/discord\.com\/api\/webhooks\/.+/.test(url);
};

export const validateTeamName = (teamName: string): boolean => {
  const validTeams = ['T1', 'Gen.G', 'DK', 'HLE', 'KT', 'NS', 'BRO', 'DRX', 'KDF', 'LSB'];
  return validTeams.includes(teamName);
}; 