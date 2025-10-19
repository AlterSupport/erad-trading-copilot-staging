'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { SlidersHorizontal, TrendingDown, TrendingUp } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Skeleton } from './ui/skeleton'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  MARKET_ASSET_GROUPS,
  MARKET_ASSETS_BY_ID,
  type MarketAsset,
  type MarketAssetMetric,
} from '@/config/market-assets'
import { useMarketAssetsStore } from '@/store/useMarketAssetsStore'

interface AssetPriceAlert {
  assetId: string
  symbol: string
  name: string
  direction: 'up' | 'down'
  updated: string
  value: number | null
  change: number | null
  changePercent: number | null
  snippet?: string
  metric: MarketAssetMetric
  currency?: string
}

const ASSET_GROUP_ENTRIES = Object.entries(MARKET_ASSET_GROUPS)

export default function PriceAlert() {
  const [alerts, setAlerts] = useState<AssetPriceAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const selectedAssetIds = useMarketAssetsStore((state) => state.selectedAssetIds)
  const toggleAsset = useMarketAssetsStore((state) => state.toggleAsset)
  const resetToDefault = useMarketAssetsStore((state) => state.resetToDefault)

  const selectedAssets = useMemo<MarketAsset[]>(() => {
    return selectedAssetIds
      .map((id) => MARKET_ASSETS_BY_ID[id])
      .filter((asset): asset is MarketAsset => Boolean(asset))
  }, [selectedAssetIds])

  const directionVariants: Record<'up' | 'down', string> = {
    up: 'border-emerald-200/70 bg-emerald-50/70 dark:border-emerald-400/40 dark:bg-emerald-500/15',
    down: 'border-rose-200/70 bg-rose-50/70 dark:border-rose-400/40 dark:bg-rose-500/15',
  }

  const iconVariants: Record<'up' | 'down', string> = {
    up: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-200',
    down: 'bg-rose-100 text-rose-700 dark:bg-rose-400/20 dark:text-rose-200',
  }

  const fetchPriceAlerts = useCallback(async () => {
    if (selectedAssets.length === 0) {
      setAlerts([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const results = await Promise.allSettled(
        selectedAssets.map(async (asset) => {
          const response = await fetch('/api/price-alerts', {
            method: 'POST',
            cache: 'no-store',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ assetId: asset.id, symbol: asset.symbol }),
          })

          if (!response.ok) {
            throw new Error(`Failed to fetch price alert for ${asset.symbol}.`)
          }

          const data = (await response.json()) as AssetPriceAlert
          return { asset, data }
        })
      )

      const alertsByAssetId = new Map<string, AssetPriceAlert>()

      for (const result of results) {
        if (result.status === 'fulfilled') {
          const { asset, data } = result.value
          alertsByAssetId.set(asset.id, {
            assetId: data.assetId ?? asset.id,
            symbol: data.symbol ?? asset.symbol,
            name: asset.label,
            direction: data.direction ?? 'up',
            updated: data.updated ?? new Date().toISOString(),
            value: typeof data.value === 'number' ? data.value : null,
            change: typeof data.change === 'number' ? data.change : null,
            changePercent:
              typeof data.changePercent === 'number' ? data.changePercent : null,
            snippet: data.snippet,
            metric: data.metric ?? asset.metric,
            currency: data.currency ?? asset.currency,
          })
        } else {
          console.error('Error fetching price alert:', result.reason)
        }
      }

      const orderedAlerts = selectedAssets.flatMap((asset) => {
        const alert = alertsByAssetId.get(asset.id)
        return alert ? [alert] : []
      })

      setAlerts(orderedAlerts)
    } catch (error) {
      console.error('Error fetching price alerts:', error)
      setAlerts([])
    } finally {
      setIsLoading(false)
    }
  }, [selectedAssets])

  useEffect(() => {
    fetchPriceAlerts()

    if (selectedAssets.length === 0) {
      return
    }

    const interval = setInterval(fetchPriceAlerts, 300000)

    return () => clearInterval(interval)
  }, [fetchPriceAlerts, selectedAssets.length])

  const formatMetricValue = (asset: MarketAsset, alert: AssetPriceAlert) => {
    if (typeof alert.value !== 'number') {
      return 'N/A'
    }

    if (alert.metric === 'yield') {
      return `${alert.value.toFixed(2)}%`
    }

    const currency = asset.currency ?? alert.currency ?? 'USD'
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
      }).format(alert.value)
    } catch {
      return alert.value.toFixed(2)
    }
  }

  const formatChangeValue = (asset: MarketAsset, alert: AssetPriceAlert) => {
    const parts: string[] = []
    if (typeof alert.change === 'number') {
      if (alert.metric === 'yield') {
        parts.push(`${alert.change >= 0 ? '+' : ''}${alert.change.toFixed(2)}%`)
      } else {
        const currency = asset.currency ?? alert.currency ?? 'USD'
        const sign = alert.change >= 0 ? '+' : '-'
        try {
          parts.push(
            `${sign}${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency,
              maximumFractionDigits: 2,
            }).format(Math.abs(alert.change))}`
          )
        } catch {
          parts.push(
            `${sign}${Math.abs(alert.change).toFixed(2)}`
          )
        }
      }
    }

    if (typeof alert.changePercent === 'number') {
      parts.push(
        `${alert.changePercent >= 0 ? '+' : ''}${alert.changePercent.toFixed(2)}%`
      )
    }

    return parts.join(' / ')
  }

  const getMetricLabel = (metric: MarketAssetMetric) =>
    metric === 'yield' ? 'Yield' : 'Price'

  return (
    <Card className='border border-border rounded-md space-y-4'>
      <CardHeader className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <CardTitle className='font-semibold text-lg'>
            Price Change Alerts
          </CardTitle>
          <CardDescription>
            Real-time market movement & thresholds
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className='inline-flex items-center gap-2'
            >
              <SlidersHorizontal className='h-4 w-4' />
              Manage assets
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='w-72 max-h-80 overflow-y-auto'
          >
            <DropdownMenuLabel>Select tracked assets</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ASSET_GROUP_ENTRIES.map(([category, assets], index) => (
              <div key={category}>
                <DropdownMenuLabel className='text-xs font-medium text-muted-foreground'>
                  {category}
                </DropdownMenuLabel>
                {assets.map((asset) => (
                  <DropdownMenuCheckboxItem
                    key={asset.id}
                    checked={selectedAssetIds.includes(asset.id)}
                    onCheckedChange={() => toggleAsset(asset.id)}
                  >
                    {asset.label}
                  </DropdownMenuCheckboxItem>
                ))}
                {index < ASSET_GROUP_ENTRIES.length - 1 && (
                  <DropdownMenuSeparator />
                )}
              </div>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => resetToDefault()}>
              Reset to defaults
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className='space-y-5'>
        <div>
          <p className='text-xs font-medium uppercase text-muted-foreground'>
            Selected assets
          </p>
          <div className='mt-2 flex flex-wrap gap-2'>
            {selectedAssets.length > 0 ? (
              selectedAssets.map((asset) => (
                <Badge key={asset.id} variant='secondary'>
                  {asset.label}
                </Badge>
              ))
            ) : (
              <span className='text-xs text-muted-foreground'>
                Select assets to monitor price alerts.
              </span>
            )}
          </div>
        </div>
        {isLoading && (
          <>
            <Skeleton className='h-12 w-full rounded-md' />
            <Skeleton className='h-12 w-full rounded-md' />
            <Skeleton className='h-12 w-full rounded-md' />
          </>
        )}
        {!isLoading && alerts.length === 0 && (
          <p>No price alerts found for the selected assets.</p>
        )}
        {!isLoading &&
          alerts.map((item) => {
            const asset = selectedAssets.find(
              (candidate) => candidate.id === item.assetId
            )
            if (!asset) {
              return null
            }
            const metricLabel = getMetricLabel(item.metric ?? asset.metric)
            const formattedValue = formatMetricValue(asset, item)
            const formattedChange = formatChangeValue(asset, item)

            return (
              <div
                key={item.assetId}
                className={cn(
                  'flex items-center justify-between rounded-lg border bg-card/80 px-4 py-3 shadow-sm transition-colors',
                  directionVariants[item.direction]
                )}
              >
                <div className='flex items-center gap-3'>
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full',
                      iconVariants[item.direction]
                    )}
                  >
                    {item.direction === 'up' ? (
                      <TrendingUp className='h-4 w-4' />
                    ) : (
                      <TrendingDown className='h-4 w-4' />
                    )}
                  </div>
                  <div className='flex flex-col gap-1'>
                    <h4 className='text-sm font-semibold text-foreground'>
                      {item.name}
                    </h4>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                      <p>
                        {metricLabel}: {formattedValue}
                      </p>
                      <div className='h-5 w-px border-l border-border/60' />
                      <span>
                        {item.updated
                          ? new Date(item.updated).toLocaleTimeString()
                          : '—'}
                      </span>
                    </div>
                    {formattedChange && (
                      <p className='text-xs text-muted-foreground'>
                        Change: {formattedChange}
                      </p>
                    )}
                    {item.snippet && (
                      <p className='mt-1 text-xs text-muted-foreground'>
                        {item.snippet}
                      </p>
                    )}
                  </div>
                </div>
                <div className='text-sm font-medium text-foreground'>
                  {formattedValue}
                </div>
              </div>
            )
          })}
      </CardContent>
    </Card>
  )
}
