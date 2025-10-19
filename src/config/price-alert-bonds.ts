import {
  DEFAULT_MARKET_ASSET_IDS,
  MARKET_ASSETS,
  MARKET_ASSET_GROUPS,
  MARKET_ASSETS_BY_ID,
  type MarketAsset,
  type MarketAssetMetric,
  type MarketAssetPriceSource,
} from './market-assets'

export const PRICE_ALERT_BONDS = MARKET_ASSETS.filter(
  (asset) => asset.category === 'Sovereign Bonds'
).map((asset) => asset.symbol)

export type PriceAlertBond = string

export {
  DEFAULT_MARKET_ASSET_IDS,
  MARKET_ASSETS,
  MARKET_ASSET_GROUPS,
  MARKET_ASSETS_BY_ID,
  type MarketAsset,
  type MarketAssetMetric,
  type MarketAssetPriceSource,
}
