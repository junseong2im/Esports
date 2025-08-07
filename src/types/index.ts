// 사용자 관련 타입
export interface User {
  id: number;
  loginId: string;
  password?: string;
  teamName: string;
}

export interface UserSignupRequest {
  loginId: string;
  password: string;
  teamName: string;
}

export interface UserLoginRequest {
  loginId: string;
  password: string;
}

export interface MatchSchedule {
  gameType: string;
  team1: string;
  team2: string;
  dateTime: string;
  tournamentName: string;
  status: string;
}

// 팀 목록 상수
export const VALID_TEAMS = [
  "T1",
  "Gen.G",
  "DK",
  "HLE",
  "KT",
  "NS",
  "BRO",
  "DRX",
  "KDF",
  "LSB"
] as const;

export type TeamName = typeof VALID_TEAMS[number]; 