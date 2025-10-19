import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  DEFAULT_MARKET_ASSET_IDS,
  MARKET_ASSETS,
  MARKET_ASSETS_BY_ID,
} from '@/config/market-assets'

const assetOrder = MARKET_ASSETS.map((asset) => asset.id)

const sortByAssetOrder = (ids: string[]) => {
  const uniqueIds = new Set(ids)
  return assetOrder.filter((id) => uniqueIds.has(id))
}

const filterValidAssetIds = (ids: string[]) =>
  ids.filter((id) => id in MARKET_ASSETS_BY_ID)

const getDefaultSelection = () => [...DEFAULT_MARKET_ASSET_IDS]

interface MarketAssetsState {
  selectedAssetIds: string[]
  setSelectedAssetIds: (assetIds: string[]) => void
  toggleAsset: (assetId: string) => void
  resetToDefault: () => void
}

export const useMarketAssetsStore = create<MarketAssetsState>()(
  persist(
    (set, get) => ({
      selectedAssetIds: sortByAssetOrder(getDefaultSelection()),
      setSelectedAssetIds: (assetIds) => {
        const cleanedIds = sortByAssetOrder(filterValidAssetIds(assetIds))
        set({ selectedAssetIds: cleanedIds })
      },
      toggleAsset: (assetId) => {
        if (!(assetId in MARKET_ASSETS_BY_ID)) {
          return
        }
        const { selectedAssetIds } = get()
        const exists = selectedAssetIds.includes(assetId)
        const nextIds = exists
          ? selectedAssetIds.filter((id) => id !== assetId)
          : [...selectedAssetIds, assetId]
        set({ selectedAssetIds: sortByAssetOrder(nextIds) })
      },
      resetToDefault: () => {
        set({ selectedAssetIds: sortByAssetOrder(getDefaultSelection()) })
      },
    }),
    {
      name: 'market-asset-selection',
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.selectedAssetIds = sortByAssetOrder(
            filterValidAssetIds(state.selectedAssetIds)
          )
        }
      },
    }
  )
)
