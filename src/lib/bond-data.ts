export interface BondData {
  id: number
  title: string
  cusip: string
  price: number
  change: number
  recommendation: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  description: string
  thresholds: {
    targetExit: number
    stopLoss: number
    upsideTarget: number
  }
  risk: string
  percentage: number
  updated: string
}

export const bondData: BondData[] = [
  {
    id: 1,
    title: 'Societe Generale 4.75% 2029',
    cusip: 'XS2010039895',
    price: 101.2,
    change: 0.25,
    recommendation: 'BUY',
    confidence: 85,
    description:
      'Strong credit fundamentals and attractive yield in the current environment.',
    thresholds: {
      targetExit: 102.5,
      stopLoss: 100.0,
      upsideTarget: 103.5,
    },
    risk: 'MEDIUM RISK',
    percentage: 75,
    updated: '3 minutes ago',
  },
  {
    id: 2,
    title: 'Deutsche Bank 2.1% 2027',
    cusip: 'XS1591331923',
    price: 99.8,
    change: -0.15,
    recommendation: 'HOLD',
    confidence: 78,
    description:
      'Stable outlook but sensitive to ECB policy changes. Monitor for rate adjustments.',
    thresholds: {
      targetExit: 100.5,
      stopLoss: 99.0,
      upsideTarget: 101.0,
    },
    risk: 'LOW RISK',
    percentage: 65,
    updated: '7 minutes ago',
  },
  {
    id: 3,
    title: 'Enel SpA 1.375% 2028',
    cusip: 'XS2296399744',
    price: 96.5,
    change: 0.5,
    recommendation: 'BUY',
    confidence: 88,
    description:
      'Favorable position in the renewable energy sector. Potential for capital appreciation.',
    thresholds: {
      targetExit: 98.0,
      stopLoss: 95.0,
      upsideTarget: 99.5,
    },
    risk: 'MEDIUM RISK',
    percentage: 80,
    updated: '5 minutes ago',
  },
  {
    id: 4,
    title: 'Volkswagen Int 3.875% 2030',
    cusip: 'XS2343989938',
    price: 103.1,
    change: -0.4,
    recommendation: 'SELL',
    confidence: 72,
    description:
      'Automotive sector facing headwinds from supply chain issues and rising costs.',
    thresholds: {
      targetExit: 102.0,
      stopLoss: 101.0,
      upsideTarget: 104.0,
    },
    risk: 'HIGH RISK',
    percentage: 82,
    updated: '12 minutes ago',
  },
  {
    id: 5,
    title: 'BNP Paribas 1.0% 2026',
    cusip: 'XS2282977322',
    price: 98.9,
    change: 0.1,
    recommendation: 'HOLD',
    confidence: 81,
    description:
      'Solid credit profile, but low yield offers limited upside. Hold for stability.',
    thresholds: {
      targetExit: 99.5,
      stopLoss: 98.0,
      upsideTarget: 100.0,
    },
    risk: 'LOW RISK',
    percentage: 70,
    updated: '9 minutes ago',
  },
  {
    id: 6,
    title: 'Repsol Int 2.25% 2029',
    cusip: 'XS2010037170',
    price: 97.4,
    change: 0.6,
    recommendation: 'BUY',
    confidence: 90,
    description:
      'Energy sector tailwinds and strong cash flow generation support a positive outlook.',
    thresholds: {
      targetExit: 99.0,
      stopLoss: 96.0,
      upsideTarget: 100.5,
    },
    risk: 'MEDIUM RISK',
    percentage: 85,
    updated: '2 minutes ago',
  },
]
