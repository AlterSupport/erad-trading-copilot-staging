export const PRICE_ALERT_BONDS = [
  'US 10YR',
  'US 30YR',
  'NIGERIA DEC 2034',
  'NIGERIA JAN 2049',
  'NIGERIA SEP 2051',
  'ANGOLA APR 2032',
  'ANGOLA MAY 2048',
  'ANGOLA NOV 2049',
] as const

export type PriceAlertBond = (typeof PRICE_ALERT_BONDS)[number]
