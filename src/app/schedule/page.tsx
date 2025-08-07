import { Metadata } from 'next';
import SchedulePage from '@/components/SchedulePage';

export const metadata: Metadata = {
  title: 'LCK 경기 알림 - 일정',
  description: 'LCK 경기 일정을 확인하고 알림을 설정하세요.',
};

export default function Page() {
  return <SchedulePage />;
} 