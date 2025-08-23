interface Team {
  id: string;
  name: string;
}

export const teams: Team[] = [
  { id: 'all', name: '전체 팀' },
  { id: 'T1', name: 'T1' },
  { id: 'Gen.G', name: 'Gen.G' },
  { id: 'DK', name: 'DK' },
  { id: 'HLE', name: 'HLE' },
  { id: 'KT', name: 'KT' },
  { id: 'NS', name: 'NS' },
  { id: 'BRO', name: 'BRO' },
  { id: 'DRX', name: 'DRX' },
  { id: 'KDF', name: 'KDF' },
  { id: 'LSB', name: 'LSB' },
];

export const teamFullNames: Record<string, string> = {
  'T1': 'T1',
  'Gen.G': 'Gen.G',
  'DK': 'Dplus KIA',
  'HLE': 'Hanwha Life',
  'KT': 'KT Rolster',
  'NS': 'Nongshim RedForce',
  'BRO': 'OK BRION',
  'DRX': 'DRX',
  'KDF': 'Kwangdong Freecs',
  'LSB': 'Liiv SANDBOX',
}; 