import { NextResponse } from 'next/server'
import {
  MARKET_ASSETS,
  MARKET_ASSETS_BY_ID,
  type MarketAsset,
  type MarketAssetMetric,
  type MarketAssetPriceSource,
} from '@/config/market-assets'

const PRICE_ALERTS_SERVICE_URL =
  process.env.PRICE_ALERTS_SERVICE_URL ?? process.env.NEXT_PUBLIC_PRICE_ALERTS_URL

interface PriceAlertPayload {
  assetId?: unknown
  symbol?: unknown
}

interface NormalisedPriceAlert {
  assetId: string
  symbol: string
  name: string
  metric: MarketAssetMetric
  priceSource: MarketAssetPriceSource
  direction: 'up' | 'down'
  updated: string
  value: number | null
  change: number | null
  changePercent: number | null
  snippet?: string
  currency?: string
}

const findAssetBySymbol = (symbol?: string | null): MarketAsset | null => {
  if (!symbol) return null
  const normalised = symbol.trim().toLowerCase()
  return (
    MARKET_ASSETS.find(
      (asset) =>
        asset.symbol.toLowerCase() === normalised ||
        asset.label.toLowerCase() === normalised
    ) ?? null
  )
}

const resolveDirection = (change?: number | null, fallback?: string | null) => {
  if (typeof change === 'number') {
    return change >= 0 ? 'up' : 'down'
  }
  return fallback === 'down' ? 'down' : 'up'
}

const coerceNumber = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null

const normalisePriceServiceData = (
  asset: MarketAsset,
  data: Record<string, unknown>
): NormalisedPriceAlert => {
  const rawYield = coerceNumber(data.yield)
  const rawPriceCandidates = [
    coerceNumber(data.price),
    coerceNumber((data as Record<string, unknown>).current),
    coerceNumber((data as Record<string, unknown>).lastPrice),
    coerceNumber((data as Record<string, unknown>).last_price),
    coerceNumber((data as Record<string, unknown>).currentPrice),
    coerceNumber((data as Record<string, unknown>).current_price),
    coerceNumber(data.value),
  ]
  const rawPrice = rawPriceCandidates.find(
    (candidate): candidate is number => candidate !== null
  )
  const rawChange =
    coerceNumber(data.change) ??
    coerceNumber((data as Record<string, unknown>).change_value)
  const rawChangePercent =
    coerceNumber((data as Record<string, unknown>).changePercent) ??
    coerceNumber((data as Record<string, unknown>).change_percent) ??
    coerceNumber((data as Record<string, unknown>).change_percentage)

  const name =
    typeof data.name === 'string' && data.name.trim().length > 0
      ? data.name
      : asset.label
  const updated =
    typeof data.updated === 'string' && data.updated.trim().length > 0
      ? data.updated
      : new Date().toISOString()
  const snippet =
    typeof data.snippets === 'string'
      ? data.snippets
      : typeof data.snippet === 'string'
        ? data.snippet
        : undefined

  return {
    assetId: asset.id,
    symbol: asset.symbol,
    name,
    metric: asset.metric,
    priceSource: asset.priceSource,
    direction: resolveDirection(
      rawChange,
      typeof data.direction === 'string' ? data.direction : null
    ),
    updated,
    value: asset.metric === 'yield' ? rawYield : rawPrice ?? rawYield,
    change: rawChange,
    changePercent: rawChangePercent,
    snippet,
    currency: asset.currency,
  }
}

const fetchFromPriceService = async (asset: MarketAsset) => {
  if (!PRICE_ALERTS_SERVICE_URL) {
    throw new Error('Price alerts service URL is not configured.')
  }

  const upstreamResponse = await fetch(PRICE_ALERTS_SERVICE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ symbol: asset.symbol }),
    cache: 'no-store',
  })

  if (!upstreamResponse.ok) {
    const errorText = await upstreamResponse.text().catch(() => '')
    const error = new Error('Failed to fetch price alert from upstream service.')
    ;(error as Error & { status?: number; details?: string }).status =
      upstreamResponse.status
    ;(error as Error & { status?: number; details?: string }).details = errorText
    throw error
  }

  const data = (await upstreamResponse.json()) as Record<string, unknown>
  return normalisePriceServiceData(asset, data)
}

export async function POST(request: Request) {
  try {
    const payload = (await request
      .json()
      .catch(() => null)) as PriceAlertPayload | null

    const symbol =
      typeof payload?.symbol === 'string' && payload.symbol.trim().length > 0
        ? payload.symbol
        : null

    const assetId =
      typeof payload?.assetId === 'string' && payload.assetId.trim().length > 0
        ? payload.assetId
        : null

    const asset =
      (assetId ? MARKET_ASSETS_BY_ID[assetId] ?? null : null) ??
      findAssetBySymbol(symbol)

    if (!asset) {
      return NextResponse.json(
        { error: 'Requested asset is not supported.' },
        { status: 400 },
      )
    }

    const result = await fetchFromPriceService(asset)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Price alerts proxy error:', error)

    const status =
      typeof (error as Error & { status?: number }).status === 'number'
        ? (error as Error & { status: number }).status
        : 500
    const details =
      typeof (error as Error & { details?: string }).details === 'string'
        ? (error as Error & { details: string }).details
        : undefined

    return NextResponse.json(
      { error: (error as Error).message, details },
      { status },
    )
  }
}
