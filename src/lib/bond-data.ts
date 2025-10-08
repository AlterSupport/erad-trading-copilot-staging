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
    title: 'Qatar 4.817% 2049',
    cusip: 'XS1963932839',
    price: 102.5,
    change: 0.35,
    recommendation: 'BUY',
    confidence: 88,
    description:
      'Strong sovereign credit rating and favorable energy market outlook.',
    thresholds: {
      targetExit: 104.0,
      stopLoss: 101.0,
      upsideTarget: 105.5,
    },
    risk: 'LOW RISK',
    percentage: 80,
    updated: '4 minutes ago',
  },
  {
    id: 2,
    title: 'Saudi Aramco 4.375% 2029',
    cusip: 'XS1982113225',
    price: 105.2,
    change: -0.1,
    recommendation: 'HOLD',
    confidence: 82,
    description:
      'Solid fundamentals but exposed to oil price volatility. Hold for income.',
    thresholds: {
      targetExit: 106.0,
      stopLoss: 104.0,
      upsideTarget: 107.0,
    },
    risk: 'MEDIUM RISK',
    percentage: 75,
    updated: '8 minutes ago',
  },
  {
    id: 3,
    title: 'South Africa 5.875% 2030',
    cusip: 'XS2010028260',
    price: 98.7,
    change: 0.6,
    recommendation: 'BUY',
    confidence: 76,
    description:
      'Higher yield offering compensation for political and economic risks.',
    thresholds: {
      targetExit: 100.0,
      stopLoss: 97.0,
      upsideTarget: 101.5,
    },
    risk: 'HIGH RISK',
    percentage: 65,
    updated: '3 minutes ago',
  },
  {
    id: 4,
    title: 'Nigeria 7.143% 2030',
    cusip: 'XS1717010965',
    price: 101.8,
    change: -0.25,
    recommendation: 'SELL',
    confidence: 68,
    description:
      'Currency and inflation risks are mounting, suggesting caution.',
    thresholds: {
      targetExit: 100.5,
      stopLoss: 99.0,
      upsideTarget: 102.5,
    },
    risk: 'HIGH RISK',
    percentage: 60,
    updated: '15 minutes ago',
  },
  {
    id: 5,
    title: 'China Development Bank 2.5% 2027',
    cusip: 'XS2296399744',
    price: 99.5,
    change: 0.15,
    recommendation: 'HOLD',
    confidence: 85,
    description:
      'Stable issuer with strong state backing. Good for portfolio diversification.',
    thresholds: {
      targetExit: 100.0,
      stopLoss: 98.5,
      upsideTarget: 101.0,
    },
    risk: 'LOW RISK',
    percentage: 85,
    updated: '6 minutes ago',
  },
  {
    id: 6,
    title: 'Korea Development Bank 1.75% 2026',
    cusip: 'XS2282977322',
    price: 98.2,
    change: 0.05,
    recommendation: 'HOLD',
    confidence: 89,
    description:
      'Excellent credit quality but low yield. Suitable for capital preservation.',
    thresholds: {
      targetExit: 99.0,
      stopLoss: 97.5,
      upsideTarget: 99.8,
    },
    risk: 'LOW RISK',
    percentage: 90,
    updated: '11 minutes ago',
  },
]
