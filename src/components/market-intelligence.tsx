'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Skeleton } from './ui/skeleton'
import { Button } from './ui/button'
import { RefreshCw } from 'lucide-react'
import { PRICE_ALERT_BONDS } from '@/config/price-alert-bonds'

interface MarketEvent {
  event_title: string
  summary: string
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
  trading_impact: string
  source_url: string
}

export default function MarketIntelligence() {
  const [events, setEvents] = useState<MarketEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const sentimentVariants: Record<MarketEvent['sentiment'], string> = {
    POSITIVE:
      'border-emerald-200/70 bg-emerald-50/80 dark:border-emerald-400/40 dark:bg-emerald-500/15',
    NEGATIVE:
      'border-rose-200/70 bg-rose-50/80 dark:border-rose-400/40 dark:bg-rose-500/15',
    NEUTRAL:
      'border-border/70 bg-muted/70 dark:border-border/40 dark:bg-muted/20',
  }

  const sentimentText: Record<MarketEvent['sentiment'], string> = {
    POSITIVE: 'text-emerald-700 dark:text-emerald-200',
    NEGATIVE: 'text-rose-700 dark:text-rose-200',
    NEUTRAL: 'text-muted-foreground',
  }

  useEffect(() => {
    const fetchMarketNews = async () => {
      setIsLoading(true)
      try {
        const newsUrl = process.env.NEXT_PUBLIC_MARKET_INTELLIGENCE_URL
        if (!newsUrl) {
          throw new Error('Market intelligence URL is not configured.')
        }

        const response = await fetch(newsUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ symbols: PRICE_ALERT_BONDS }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch market news.')
        }

        const data = await response.json()
        if (data && Array.isArray(data.market_events)) {
          setEvents(data.market_events)
        } else {
          setEvents([])
        }
      } catch (error) {
        console.error('Error fetching market news:', error)
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarketNews()
  }, [])

  const handleRefresh = () => {
    // Manually trigger the fetch function
    const fetchMarketNews = async () => {
      setIsLoading(true)
      try {
        const newsUrl = process.env.NEXT_PUBLIC_MARKET_INTELLIGENCE_URL
        if (!newsUrl) {
          throw new Error('Market intelligence URL is not configured.')
        }

        const response = await fetch(newsUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ symbols: PRICE_ALERT_BONDS }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch market news.')
        }

        const data = await response.json()
        if (data && Array.isArray(data.market_events)) {
          setEvents(data.market_events)
        } else {
          setEvents([])
        }
      } catch (error) {
        console.error('Error fetching market news:', error)
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchMarketNews()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Market Intelligence</CardTitle>
          <CardDescription>
            Real-time news and analysis from global markets.
          </CardDescription>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {isLoading && (
            <>
              <Skeleton className="h-48 w-full rounded-md" />
              <Skeleton className="h-48 w-full rounded-md" />
              <Skeleton className="h-48 w-full rounded-md" />
            </>
          )}
          {!isLoading && events.length === 0 && (
            <p className="col-span-full">No market events found for your portfolio.</p>
          )}
          {!isLoading &&
            events.map((event, index) => (
              <div
                key={index}
                className={cn(
                  'rounded-xl border bg-card/80 p-4 shadow-sm transition-colors',
                  sentimentVariants[event.sentiment]
                )}
              >
                <h4 className='font-semibold text-foreground'>
                  {event.event_title}
                </h4>
                <p className='mt-1 text-sm text-muted-foreground'>
                  {event.summary}
                </p>
                <p className='mt-3 text-sm'>
                  <span className='font-semibold text-foreground'>
                    Sentiment:{' '}
                  </span>
                  <span className={sentimentText[event.sentiment]}>
                    {event.sentiment}
                  </span>
                </p>
                <p className='mt-1 text-sm text-foreground'>
                  <span className='font-semibold'>Trading Impact:</span>{' '}
                  <span className='text-muted-foreground'>
                    {event.trading_impact}
                  </span>
                </p>
                <a
                  href={event.source_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-3 block text-xs font-medium text-primary hover:underline'
                >
                  Source
                </a>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
