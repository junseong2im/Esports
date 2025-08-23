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
  user?: User;  // optional: 로그인 안 쓰면 null 허용
  teamName: string;  // "T1", "Gen.G" 등
  webhookUrl: string;  // 디스코드 Webhook URL
  advanceMin: number;  // 몇 분 전 알림 (기본 10분)
  active: boolean;  // 구독 활성 여부
  createdAt: string;  // ISO 8601 형식
  updatedAt: string;  // ISO 8601 형식
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

// 디스코드 웹훅 관련 타입
export interface DiscordWebhookRequest {
  webhookUrl: string;  // ^https://discord\.com/api/webhooks/.+
}

export interface SubscribeRequest {
  teamName: string;    // "ALL" 또는 팀명 (예: "T1")
  webhookUrl: string;  // 디스코드 Webhook URL
  advanceMin: number;  // 기본값 10, 최소 1
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