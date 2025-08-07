// 백엔드 DTO와 일치하는 타입 정의
export type TeamName = 'T1' | 'GEN' | 'KT' | 'HLE' | 'DK' | 'KDF' | 'LSB' | 'NS' | 'BRO' | 'DRX';

export const VALID_TEAMS: TeamName[] = ['T1', 'GEN', 'KT', 'HLE', 'DK', 'KDF', 'LSB', 'NS', 'BRO', 'DRX'];

export interface UserLoginRequest {
  loginId: string;
  password: string;
}

export interface UserSignupRequest {
  loginId: string;
  password: string;
  teamName: TeamName;
}

export interface MatchSchedule {
  id: number;
  date: string;
  time: string;
  teamA: TeamName;
  teamB: TeamName;
  score?: string;
  isNotificationEnabled?: boolean;
} 