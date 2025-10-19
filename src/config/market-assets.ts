export type MarketAssetPriceSource = 'price-service' | 'yfinance'
export type MarketAssetMetric = 'yield' | 'price'

export interface MarketAsset {
  id: string
  label: string
  symbol: string
  category: string
  description?: string
  defaultSelected?: boolean
  priceSource: MarketAssetPriceSource
  metric: MarketAssetMetric
  currency?: string
}

export const MARKET_ASSETS: MarketAsset[] = [
  {
    id: 'us-10yr',
    label: 'US 10YR Treasury',
    symbol: 'US 10YR',
    category: 'Sovereign Bonds',
    defaultSelected: true,
    priceSource: 'price-service',
    metric: 'yield',
  },
  {
    id: 'us-30yr',
    label: 'US 30YR Treasury',
    symbol: 'US 30YR',
    category: 'Sovereign Bonds',
    defaultSelected: true,
    priceSource: 'price-service',
    metric: 'yield',
  },
  {
    id: 'nigeria-dec-2034',
    label: 'Nigeria DEC 2034',
    symbol: 'NIGERIA DEC 2034',
    category: 'Sovereign Bonds',
    defaultSelected: true,
    priceSource: 'price-service',
    metric: 'yield',
  },
  {
    id: 'nigeria-jan-2049',
    label: 'Nigeria JAN 2049',
    symbol: 'NIGERIA JAN 2049',
    category: 'Sovereign Bonds',
    defaultSelected: true,
    priceSource: 'price-service',
    metric: 'yield',
  },
  {
    id: 'nigeria-sep-2051',
    label: 'Nigeria SEP 2051',
    symbol: 'NIGERIA SEP 2051',
    category: 'Sovereign Bonds',
    defaultSelected: true,
    priceSource: 'price-service',
    metric: 'yield',
  },
  {
    id: 'angola-apr-2032',
    label: 'Angola APR 2032',
    symbol: 'ANGOLA APR 2032',
    category: 'Sovereign Bonds',
    defaultSelected: true,
    priceSource: 'price-service',
    metric: 'yield',
  },
  {
    id: 'angola-may-2048',
    label: 'Angola MAY 2048',
    symbol: 'ANGOLA MAY 2048',
    category: 'Sovereign Bonds',
    defaultSelected: true,
    priceSource: 'price-service',
    metric: 'yield',
  },
  {
    id: 'angola-nov-2049',
    label: 'Angola NOV 2049',
    symbol: 'ANGOLA NOV 2049',
    category: 'Sovereign Bonds',
    defaultSelected: true,
    priceSource: 'price-service',
    metric: 'yield',
  },
  {
    id: 'gold',
    label: 'Gold Futures',
    symbol: 'GC=F',
    category: 'Commodities',
    description: 'Gold spot price via COMEX futures (GC=F)',
    priceSource: 'price-service',
    metric: 'price',
    currency: 'USD',
  },
  {
    id: 'brent-crude',
    label: 'Brent Crude Oil',
    symbol: 'BZ=F',
    category: 'Commodities',
    description: 'ICE Brent Crude futures (BZ=F)',
    priceSource: 'price-service',
    metric: 'price',
    currency: 'USD',
  },
  {
    id: 'wti-crude',
    label: 'WTI Crude Oil',
    symbol: 'CL=F',
    category: 'Commodities',
    description: 'NYMEX WTI light sweet crude oil (CL=F)',
    priceSource: 'price-service',
    metric: 'price',
    currency: 'USD',
  },
  {
    id: 'sp-500',
    label: 'S&P 500 Index',
    symbol: '^GSPC',
    category: 'Equity Indices',
    description: 'S&P 500 benchmark index (^GSPC)',
    priceSource: 'price-service',
    metric: 'price',
    currency: 'USD',
  },
  {
    id: 'nasdaq-100',
    label: 'NASDAQ 100 Index',
    symbol: '^NDX',
    category: 'Equity Indices',
    description: 'NASDAQ 100 technology index (^NDX)',
    priceSource: 'price-service',
    metric: 'price',
    currency: 'USD',
  },
  {
    id: 'eur-usd',
    label: 'EUR/USD FX',
    symbol: 'EURUSD=X',
    category: 'FX Rates',
    description: 'Euro to US Dollar spot rate (EURUSD=X)',
    priceSource: 'price-service',
    metric: 'price',
    currency: 'USD',
  },
  {
    id: 'gbp-usd',
    label: 'GBP/USD FX',
    symbol: 'GBPUSD=X',
    category: 'FX Rates',
    description: 'British Pound to US Dollar spot rate (GBPUSD=X)',
    priceSource: 'price-service',
    metric: 'price',
    currency: 'USD',
  },
]

export const DEFAULT_MARKET_ASSET_IDS = MARKET_ASSETS.filter(
  (asset) => asset.defaultSelected
).map((asset) => asset.id)

export const MARKET_ASSETS_BY_ID = MARKET_ASSETS.reduce<Record<string, MarketAsset>>(
  (acc, asset) => {
    acc[asset.id] = asset
    return acc
  },
  {}
)

export const MARKET_ASSET_GROUPS = MARKET_ASSETS.reduce<
  Record<string, MarketAsset[]>
>((acc, asset) => {
  if (!acc[asset.category]) {
    acc[asset.category] = []
  }
  acc[asset.category].push(asset)
  return acc
}, {})
