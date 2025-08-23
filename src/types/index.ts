// 경기 일정 관련 타입
export interface MatchSchedule {
  id: number;
  teamA: string;
  teamB: string;
  matchDate: string;
  leagueName: string;
  matchStatus: string;
}

// 사용자 관련 타입
export interface User {
  id: number;
  loginId: string;
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
  loginId: string;
  password: string;
  teamName: string;
}

export interface UserLoginRequest {
  loginId: string;
  password: string;
}

export interface DiscordWebhookRequest {
  webhookUrl: string;
}

export interface SubscribeRequest {
  teamName: string;
  webhookUrl: string;
  advanceMin: number;
} 