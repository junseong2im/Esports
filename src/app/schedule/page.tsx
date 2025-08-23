import type { Metadata } from 'next';
import SchedulePage from '@/components/SchedulePage';

export const metadata: Metadata = {
  title: 'LCK 경기 일정 | eSports Calendar',
  description: 'LCK 경기 일정을 확인하고 디스코드 알림을 설정하세요.',
};

export default function Page() {
  return <SchedulePage />;
} 