import { TeamName } from '@/types';

interface Team {
  id: TeamName | 'all';
  name: string;
  logo?: string;
}

export const teams = [
  { id: 'all', name: '전체 팀' },
  { id: 'T1', name: 'T1' },
  { id: 'Gen.G', name: 'Gen.G' },
  { id: 'KT Rolster', name: 'KT Rolster' },
  { id: 'Dplus KIA', name: 'Dplus KIA' },
  { id: 'Hanwha Life', name: 'Hanwha Life' },
  { id: 'OK BRION', name: 'OK BRION' },
  { id: 'DRX', name: 'DRX' },
  { id: 'Nongshim RedForce', name: 'Nongshim RedForce' },
  { id: 'Kwangdong Freecs', name: 'Kwangdong Freecs' },
] as const; 