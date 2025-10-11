'use client'

import { cn } from '@/lib/utils'
import { TrendingUp, Zap } from 'lucide-react'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'
import { useBlotterStore } from '@/store/useBlotterStore'

export default function TradingStyle() {
  const { analysisResults, selectedFile } = useBlotterStore()
  const analysisResult = selectedFile
    ? analysisResults[selectedFile.name]
    : null
  const tradingStyle = analysisResult?.trading_style

  return (
    <Tabs defaultValue='patterns' className='w-full'>
      <Card className='border-none ring-0 rounded-md shadow'>
        <CardHeader className='h-26'>
          <CardTitle className='capitalize font-semibold text-xl'>
            Trading Styles
          </CardTitle>
          <CardDescription>
            Real-time market movement & thresholds
          </CardDescription>
          <TabsList className='h-11 p-1'>
            <TabsTrigger value='patterns'>Patterns</TabsTrigger>
            <TabsTrigger value='opportunities'>Opportunities</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className='space-y-5'>
          <TabsContent value='patterns' className='space-y-5'>
            {tradingStyle?.patterns?.length ? (
              tradingStyle.patterns.map((pattern, index) => (
                <div
                  key={index}
                  className='border border-border rounded-md p-4 space-y-4'
                >
                  <div className='flex flex-col gap-1'>
                    <header className='flex items-center gap-3'>
                      <div className='flex items-center gap-2'>
                        <TrendingUp
                          size={15}
                          className='text-amber-700 dark:text-amber-300'
                        />
                        <h3 className='font-semibold'>{pattern.title}</h3>
                      </div>
                      <Badge
                        className={cn(
                          'rounded py-1 px-4',
                          pattern.type === 'weakness'
                            ? 'border border-amber-400 bg-amber-100 text-amber-800 dark:border-amber-300/40 dark:bg-amber-500/20 dark:text-amber-100'
                            : 'border border-emerald-400 bg-emerald-100 text-emerald-700 dark:border-emerald-300/40 dark:bg-emerald-500/20 dark:text-emerald-100'
                        )}
                      >
                        {pattern.type}
                      </Badge>
                    </header>
                    <p className='text-sm text-ring'>{pattern.description}</p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span className='text-sm'>Frequency:</span>
                    <div className='flex items-center gap-3'>
                      <Progress
                        indicatorColor='bg-blue-700 dark:bg-blue-400'
                        value={pattern.frequency}
                        className='w-14'
                      />
                      <span className='text-sm text-ring'>
                        {pattern.frequency}%
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className='flex gap-2 font-semibold text-emerald-600 dark:text-emerald-300'>
                    <Zap />
                    <span>{pattern.suggestion}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No trading patterns identified.</p>
            )}
          </TabsContent>

          <TabsContent value='opportunities' className='space-y-5'>
            {tradingStyle?.opportunities?.length ? (
              tradingStyle.opportunities.map((opp, index) => (
                <Card
                  key={index}
                  className='border border-border rounded-md space-y-4'
                >
                  <CardContent className='space-y-5 pt-6'>
                    <header className='flex justify-between items-center'>
                      <div className='flex flex-col gap-2'>
                        <h4 className='font-medium'>{opp.symbol}</h4>
                        <div className='flex items-center gap-2 text-sm text-ring'>
                          <Button
                            variant={'outline'}
                            size={'sm'}
                            className='uppercase'
                          >
                            {opp.action}
                          </Button>
                          <span>{opp.expiry_date}</span>
                        </div>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <h5
                          className={cn(
                            'font-semibold',
                            opp.profit_potential > 0 &&
                              'text-emerald-600 dark:text-emerald-300',
                            opp.profit_potential < 0 &&
                              'text-red-600 dark:text-red-300'
                          )}
                        >
                          {opp.profit_potential?.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                              }) || 'N/A'}
                        </h5>
                        {!isNaN(Number(opp.profit_percentage)) && (
                          <span
                            className={cn(
                              'text-sm',
                              Number(opp.profit_percentage) > 0 &&
                                'text-emerald-600 dark:text-emerald-300',
                              Number(opp.profit_percentage) < 0 &&
                                'text-red-600 dark:text-red-300'
                            )}
                          >
                            ({Number(opp.profit_percentage).toFixed(2)}%)
                          </span>
                        )}
                      </div>
                    </header>
                    <div className='flex flex-col gap-2'>
                      <div className='flex justify-between items-center w-full text-sm'>
                        {opp.executed_price && (
                          <div className='flex items-center gap-2'>
                            <h4 className='text-ring'>Executed:</h4>
                            <span className='text-foreground'>
                              {opp.executed_price.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                              })}
                            </span>
                          </div>
                        )}
                          <div className='flex items-center gap-2'>
                            <h4 className='text-ring'>Optimal:</h4>
                            <span className='text-foreground'>
                              {opp.optimal_price?.toLocaleString('en-US', {
                                  style: 'currency',
                                  currency: 'USD',
                                }) || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center gap-2 text-sm'>
                        <h4 className='text-ring'>Optimal timing:</h4>
                        <span className='text-foreground'>
                          {opp.optimal_timing}
                        </span>
                      </div>
                      <p>{opp.reason}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No trading opportunities identified.</p>
            )}
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  )
}
