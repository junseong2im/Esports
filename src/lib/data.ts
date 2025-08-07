import { TeamName } from '@/types';

interface Team {
  id: TeamName;
  name: string;
  logo?: string;
}

export const teams: Team[] = [
  { id: "T1", name: "T1" },
  { id: "GEN", name: "Gen.G" },
  { id: "KT", name: "KT Rolster" },
  { id: "HLE", name: "Hanwha Life" },
  { id: "DK", name: "Dplus KIA" },
  { id: "KDF", name: "Kwangdong Freecs" },
  { id: "LSB", name: "Liiv SANDBOX" },
  { id: "NS", name: "NongShim RedForce" },
  { id: "BRO", name: "OKSavingsBank BRION" },
  { id: "DRX", name: "DRX" }
];

export const matches = [
  {
    id: '1',
    team1: { id: 'hanwha', name: 'Hanwha Life Esports' },
    team2: { id: 'geng', name: 'Gen.G' },
    date: '2024-03-20',
    time: '17:00'
  },
  {
    id: '2',
    team1: { id: 'dplus', name: 'Dplus KIA' },
    team2: { id: 'nongshim', name: 'Nongshim RedForce' },
    date: '2024-03-20',
    time: '19:30'
  },
  {
    id: '3',
    team1: { id: 'kt', name: 'kt Rolster' },
    team2: { id: 't1', name: 'T1' },
    date: '2024-03-21',
    time: '17:00'
  },
  {
    id: '4',
    team1: { id: 'drx', name: 'DRX' },
    team2: { id: 'brion', name: 'OKSavingsBank BRION' },
    date: '2024-03-21',
    time: '19:30'
  },
  {
    id: '5',
    team1: { id: 'fearx', name: 'BNK FEARX' },
    team2: { id: 'hanwha', name: 'Hanwha Life Esports' },
    date: '2024-03-22',
    time: '17:00'
  }
]; 