'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { TrendingDown, TrendingUp } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Skeleton } from './ui/skeleton'

interface PriceAlert {
  id: string
  name: string
  direction: 'up' | 'down'
  current: number
  updated: string
  change: number
  yield: number
  snippets: string
}

export default function PriceAlert() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const directionVariants: Record<PriceAlert['direction'], string> = {
    up: 'border-emerald-200/70 bg-emerald-50/70 dark:border-emerald-400/40 dark:bg-emerald-500/15',
    down: 'border-rose-200/70 bg-rose-50/70 dark:border-rose-400/40 dark:bg-rose-500/15',
  }

  const iconVariants: Record<PriceAlert['direction'], string> = {
    up: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-200',
    down: 'bg-rose-100 text-rose-700 dark:bg-rose-400/20 dark:text-rose-200',
  }

  useEffect(() => {
    const symbols = [
      'US 10YR',
      'US 30YR',
      'NIGERIA DEC 2034',
      'NIGERIA JAN 2049',
      'NIGERIA SEP 2051',
      'ANGOLA APR 2032',
      'ANGOLA MAY 2048',
      'ANGOLA NOV 2049',
    ]

    const fetchPriceAlerts = async () => {
      setIsLoading(true)

      const alertsUrl = process.env.NEXT_PUBLIC_PRICE_ALERTS_URL
      if (!alertsUrl) {
        console.error('Price alerts URL is not configured.')
        setIsLoading(false)
        return
      }

      try {
        const promises = symbols.map(async (symbol) => {
          const response = await fetch(alertsUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ symbol }),
          })

          if (!response.ok) {
            throw new Error(`Failed to fetch price alert for ${symbol}.`)
          }

          return response.json()
        })

        const results = await Promise.all(promises)
        const validAlerts = results.filter((data) => data && data.yield)
        setAlerts(validAlerts)
      } catch (error) {
        console.error('Error fetching price alerts:', error)
        setAlerts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPriceAlerts()

    const interval = setInterval(fetchPriceAlerts, 300000) // Refresh every 5 minutes

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className='border border-border rounded-md space-y-4'>
      <CardHeader className='h-8'>
        <CardTitle className='font-semibold text-lg'>
          Price Change Alerts
        </CardTitle>
        <CardDescription>
          Real-time market movement & thresholds
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-5'>
        {isLoading && (
          <>
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
          </>
        )}
        {!isLoading && alerts.length === 0 && (
          <p>No price alerts found for your portfolio.</p>
        )}
        {!isLoading &&
          alerts.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
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
                      Yield:{' '}
                      {item.yield ? item.yield.toFixed(2) + '%' : 'N/A'}
                    </p>
                    <div className='h-5 w-px border-l border-border/60' />
                    <span>{new Date(item.updated).toLocaleTimeString()}</span>
                  </div>
                  {item.snippets && (
                    <p className='mt-1 text-xs text-muted-foreground'>
                      {item.snippets}
                    </p>
                  )}
                </div>
              </div>
              <div className='text-sm font-medium text-foreground'>
                {item.yield ? item.yield.toFixed(2) + '%' : 'N/A'}
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  )
}
