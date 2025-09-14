export interface TreasuryData {
  id: number
  name: string
  rate: number
  change: number
  direction: 'up' | 'down'
  current: number
  updated: string
}

export const treasuryData: TreasuryData[] = [
  {
    id: 1,
    name: 'US 30Y Treasury',
    rate: 2.17,
    change: 0.27,
    direction: 'up',
    current: 2.17,
    updated: '2 min ago',
  },
  {
    id: 2,
    name: 'US 30Y Treasury',
    rate: 2.17,
    change: -0.27,
    direction: 'down',
    current: 2.17,
    updated: '2 min ago',
  },
  {
    id: 3,
    name: 'US 30Y Treasury',
    rate: 2.17,
    change: 0.27,
    direction: 'up',
    current: 2.17,
    updated: '2 min ago',
  },
]
