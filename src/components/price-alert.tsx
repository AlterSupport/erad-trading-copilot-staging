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

  useEffect(() => {
    const symbols = [
      'US 10YR',
      'US 30YR',
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
        {!isLoading && alerts.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className={cn(
              'flex items-center justify-between py-2 px-4 rounded',
              {
                'bg-green-50': item.direction === 'up',
                'bg-red-50': item.direction === 'down',
              }
            )}
          >
            <div className='flex items-center gap-3'>
              <div
                className={cn(
                  'flex justify-center items-center h-9 w-9 p-1 rounded-full',
                  {
                    'bg-green-100 text-green-700': item.direction === 'up',
                    'bg-red-100 text-red-700': item.direction === 'down',
                  }
                )}
              >
                {item.direction === 'up' ? (
                  <TrendingUp className='h-3 w-3 text-green-700' />
                ) : (
                  <TrendingDown className='h-3 w-3 text-red-700' />
                )}
              </div>
              <div className='flex flex-col gap-1'>
                <h4 className='text-sm font-semibold'>{item.name}</h4>
                <div className='flex items-center gap-2 text-sm text-ring'>
                  <p className='text-muted-foreground'>
                    Yield: {item.yield ? item.yield.toFixed(2) + '%' : 'N/A'}
                  </p>
                  <div className='h-[20px] w-[1px] border-l border-gray-300' />
                  <span className=''>{new Date(item.updated).toLocaleTimeString()}</span>
                </div>
                {item.snippets && (
                  <p className='text-xs text-gray-500 mt-1'>{item.snippets}</p>
                )}
              </div>
            </div>
            <div className='flex flex-col gap-1 text-sm'>
              <p className='font-medium'>{item.yield ? item.yield.toFixed(2) + '%' : 'N/A'}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
