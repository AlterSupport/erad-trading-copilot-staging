'use client'

import { useEffect, useState } from 'react'
import { useBlotterStore } from '@/store/useBlotterStore'
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

  useEffect(() => {
    const fetchMarketNews = async () => {
      setIsLoading(true)
      try {
        const newsUrl = process.env.NEXT_PUBLIC_MARKET_INTELLIGENCE_URL
        if (!newsUrl) {
          throw new Error('Market intelligence URL is not configured.')
        }

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

        const response = await fetch(newsUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ symbols }),
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

        const response = await fetch(newsUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ symbols }),
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
          {!isLoading && events.map((event, index) => (
            <div
              key={index}
              className={cn(
                'p-4 rounded-md border',
                {
                  'bg-green-50 border-green-200': event.sentiment === 'POSITIVE',
                  'bg-red-50 border-red-200': event.sentiment === 'NEGATIVE',
                }
              )}
            >
              <h4 className='font-semibold'>{event.event_title}</h4>
              <p className='text-sm text-muted-foreground mt-1'>
                {event.summary}
              </p>
              <p className='text-sm mt-2'>
                <strong>Sentiment:</strong> {event.sentiment}
              </p>
              <p className='text-sm mt-1'>
                <strong>Trading Impact:</strong> {event.trading_impact}
              </p>
              <a
                href={event.source_url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-xs text-blue-500 hover:underline mt-2 block'
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
