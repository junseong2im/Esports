import { Metadata } from 'next';
import LoginPage from '@/components/LoginPage';

export const metadata: Metadata = {
  title: 'LCK 경기 알림 - 로그인',
  description: 'LCK 경기 일정을 확인하고 알림을 설정하세요.',
};

export default function Page() {
  return <LoginPage />;
}
