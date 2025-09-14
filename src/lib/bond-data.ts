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
    title: 'Apple Inc 2.4% 2028',
    cusip: 'US037833100',
    price: 98.75,
    change: 0.46,
    recommendation: 'SELL',
    confidence: 75,
    description:
      'Federal Reserve policy shift indicates potential rate increases. Duration risk high for long-term positions.',
    thresholds: {
      targetExit: 98.5,
      stopLoss: 97.8,
      upsideTarget: 98.25,
    },
    risk: 'HIGH RISK',
    percentage: 80,
    updated: '2 minutes ago',
  },
  {
    id: 2,
    title: 'Microsoft Corp 3.1% 2029',
    cusip: 'US594918104',
    price: 102.4,
    change: -0.32,
    recommendation: 'HOLD',
    confidence: 80,
    description:
      'Market uncertainty and inflationary concerns weigh on medium-term bonds.',
    thresholds: {
      targetExit: 101.5,
      stopLoss: 99.5,
      upsideTarget: 104.5,
    },
    risk: 'MEDIUM RISK',
    percentage: 80,
    updated: '5 minutes ago',
  },
  {
    id: 3,
    title: 'Tesla Inc 5% 2030',
    cusip: 'US88160R1014',
    price: 89.25,
    change: 1.25,
    recommendation: 'BUY',
    confidence: 70,
    description: 'Strong growth outlook but volatility remains elevated.',
    thresholds: {
      targetExit: 95.0,
      stopLoss: 85.0,
      upsideTarget: 105.0,
    },
    risk: 'VERY HIGH RISK',
    percentage: 70,
    updated: '10 minutes ago',
  },
  {
    id: 4,
    title: 'Amazon Corp 2.8% 2027',
    cusip: 'US023135106',
    price: 95.6,
    change: -0.85,
    recommendation: 'BUY',
    confidence: 85,
    description:
      'Current price presents attractive entry point given strong fundamentals.',
    thresholds: {
      targetExit: 98.0,
      stopLoss: 93.0,
      upsideTarget: 100.0,
    },
    risk: 'MEDIUM RISK',
    percentage: 75,
    updated: '15 minutes ago',
  },
  {
    id: 5,
    title: 'Google LLC 3.5% 2031',
    cusip: 'US38259P5089',
    price: 99.8,
    change: 0.65,
    recommendation: 'HOLD',
    confidence: 78,
    description: 'Stable credit metrics but duration risk requires monitoring.',
    thresholds: {
      targetExit: 101.0,
      stopLoss: 98.0,
      upsideTarget: 103.0,
    },
    risk: 'LOW RISK',
    percentage: 65,
    updated: '8 minutes ago',
  },
  {
    id: 6,
    title: 'NVIDIA Corp 4.2% 2029',
    cusip: 'US67066G1040',
    price: 103.25,
    change: 1.45,
    recommendation: 'SELL',
    confidence: 82,
    description:
      'Semiconductor restrictions may impact credit quality near-term.',
    thresholds: {
      targetExit: 102.5,
      stopLoss: 100.0,
      upsideTarget: 105.0,
    },
    risk: 'HIGH RISK',
    percentage: 85,
    updated: '3 minutes ago',
  },
]
