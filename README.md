# LCK 경기 알림 서비스

LCK 경기 일정을 확인하고 알림을 설정할 수 있는 웹 서비스입니다.
현재는 프론트엔드 데모 버전이며, 향후 백엔드 연동을 통해 실시간 기능이 추가될 예정입니다.

## 🚀 주요 기능

- 사용자 인증 (로그인/회원가입)
- LCK 경기 일정 조회
- 팀별 필터링
- 경기 알림 설정
- 디스코드 알림 연동

## 🛠 기술 스택

- **Frontend**: Next.js 14 (TypeScript)
- **스타일링**: Inline Styles
- **상태 관리**: React Hooks (useState)
- **이미지 최적화**: Next.js Image
- **배포**: Vercel

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 로그인/회원가입 페이지
│   ├── schedule/
│   │   └── page.tsx         # 경기 일정 페이지
│   ├── layout.tsx           # 전역 레이아웃
│   └── globals.css          # 전역 스타일
├── lib/
│   └── data.ts             # 임시 데이터 (백엔드 연동 시 API로 대체)
└── types/
    └── index.ts            # TypeScript 타입 정의

public/
└── team/                   # 팀 로고 이미지 (선택사항)
```

## 🔄 백엔드 연동 가이드

### 1. API 엔드포인트

```typescript
// 예상되는 API 엔드포인트
const API = {
  // 사용자 인증
  auth: {
    login: '/api/auth/login',
    signup: '/api/auth/signup',
    checkDuplicate: '/api/auth/check-duplicate',
  },
  
  // 경기 일정
  matches: {
    list: '/api/matches',
    byTeam: '/api/matches/team/:teamId',
    byMonth: '/api/matches/month/:month',
  },
  
  // 알림 설정
  notifications: {
    toggle: '/api/notifications/:matchId',
    settings: '/api/notifications/settings',
  },
  
  // 디스코드 연동
  discord: {
    connect: '/api/discord/connect',
    disconnect: '/api/discord/disconnect',
    webhook: '/api/discord/webhook',
  }
};
```

### 2. 데이터 모델

```typescript
// 사용자 정보
interface User {
  id: string;
  email?: string;
  discordId?: string;
  preferences: {
    selectedTeams: string[];
    theme: 'light' | 'dark';
  };
}

// 경기 정보
interface Match {
  id: string;
  date: string;
  time: string;
  team1: {
    id: string;
    name: string;
    score?: number;
  };
  team2: {
    id: string;
    name: string;
    score?: number;
  };
  status: 'scheduled' | 'live' | 'completed';
  notificationEnabled?: boolean;
}

// 알림 설정
interface Notification {
  userId: string;
  matchId: string;
  type: 'discord' | 'email';
  status: 'pending' | 'sent';
  scheduledFor: Date;
}
```

### 3. 백엔드 요구사항

1. **인증 시스템**
   - OAuth 2.0 지원 (소셜 로그인)
   - JWT 기반 인증
   - 세션 관리

2. **데이터베이스**
   - 사용자 정보 저장
   - 경기 일정 관리
   - 알림 설정 저장

3. **실시간 기능**
   - WebSocket 연결 (경기 상태 업데이트)
   - 실시간 알림 발송

4. **크롤링 시스템**
   - LCK 공식 사이트 경기 일정 수집
   - 실시간 경기 정보 업데이트

### 4. 보안 요구사항

- HTTPS 적용
- API 요청 인증
- CORS 설정
- Rate Limiting
- 데이터 암호화

## 🚀 시작하기

1. 프로젝트 클론
```bash
git clone [repository-url]
cd lck-alert
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm run dev
```

4. 빌드
```bash
npm run build
npm start
```

## 🔒 환경 변수

```env
# .env.local 예시
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_WS_URL=ws://localhost:3000
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
```

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## ⚠️ 면책 조항

본 서비스는 Riot Games 및 LCK와 무관한 비공식 팬 프로젝트입니다.
모든 게임 관련 자산의 저작권은 해당 소유자에게 있습니다.
