// 백엔드 DTO와 일치하는 타입 정의
export interface UserSignupRequest {
  loginId: string;
  password: string;
  teamName: string;
}

export interface UserLoginRequest {
  loginId: string;
  password: string;
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