// 백엔드 DTO와 일치하는 타입 정의
export type TeamName = 'T1' | 'Gen.G' | 'KT Rolster' | 'Hanwha Life' | 'Dplus KIA' | 'Kwangdong Freecs' | 'Nongshim RedForce' | 'OK BRION' | 'BRION' | 'DRX';

export const VALID_TEAMS: TeamName[] = ['T1', 'Gen.G', 'KT Rolster', 'Hanwha Life', 'Dplus KIA', 'Kwangdong Freecs', 'Nongshim RedForce', 'OK BRION', 'BRION', 'DRX'];

export interface UserSignupRequest {
  loginId: string;
  password: string;
  teamName: TeamName;
}

export interface UserLoginRequest {
  loginId: string;
  password: string;
}

// 백엔드 도메인에 맞춘 경기 일정 타입
export interface MatchSchedule {
  id: number;
  gameName: string;      // 예: "LOL"
  teamA: string;
  teamB: string;
  matchDate: string;     // ISO 또는 yyyy-MM-dd HH:mm[:ss]
  leagueName: string;    // 토너먼트/리그명
  matchStatus: string;   // 상태 또는 승자 정보
} 