'use client'

import ChatInterface from '@/components/chat-interface'
import PortfolioSummary from '@/components/portfolio-summary'
import RisksObservations from '@/components/risks-observations'
import TradingStyle from '@/components/trading-style'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useBlotterStore } from '@/store/useBlotterStore'
import { cn } from '@/lib/utils'
import {
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react'
import MarketIntelligence from '@/components/market-intelligence'
import PriceAlert from '@/components/price-alert'

export default function DashboardPage() {
  const { analysisResults, selectedFile } = useBlotterStore()
  const analysisResult = selectedFile ? analysisResults[selectedFile.name] : null

  return (
    <main className='max-h-full space-y-5'>
      <section className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
        <div className='col-span-full lg:col-span-2 space-y-5'>
          <MarketIntelligence />
        </div>
        <div className='col-span-full lg:col-span-1 space-y-5'>
          <PriceAlert />
        </div>
      </section>
      <PortfolioSummary />
      <section className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
        <div className='col-span-full lg:col-span-2 space-y-5'>
          <Card className='border-none ring-0 rounded-md shadow'>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <div className='flex flex-col gap-1'>
                  <CardTitle className='flex flex-row items-center gap-3'>
                    Trading Insights{' '}
                    <Badge className='uppercase h-7 rounded-md px-4 text-secondary-badge bg-secondary-badge-foreground'>
                      real-time
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    AI-powered insights for the Eurobond market.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='relative'>
              <div className='w-full overflow-x-auto flex snap-x snap-mandatory space-x-6 py-6 px-1 scrollbar-hide '>
                {analysisResult ? (
                  analysisResult.trading_insights.map((rec) => (
                    <div
                      key={rec.symbol}
                      className='snap-center flex-none w-[300px] lg:w-[330px] md:w-[330px] bg-white rounded-md p-5 border transform transition duration-300 hover:scale-105 hover:border-black cursor-pointer space-y-4'
                    >
                      <div className='flex justify-between items-center gap-5 '>
                        <div className='flex flex-col gap-2 w-2/3'>
                          <h3 className='font-semibold '>{rec.symbol}</h3>
                        </div>
                        <div className='flex flex-col gap-2'>
                          <span className='font-semibold'>
                            ${rec.final_sell_price?.toFixed(2) || 'N/A'}
                          </span>
                          <span
                            className={cn(`text-sm flex items-center gap-1`, {
                              'text-green-600':
                                rec.yield_rate && rec.yield_rate >= 0,
                              'text-red-600':
                                rec.yield_rate && rec.yield_rate < 0,
                            })}
                          >
                            {rec.yield_rate && rec.yield_rate >= 0 ? (
                              <TrendingUp size={12} />
                            ) : (
                              <TrendingDown size={12} />
                            )}
                            {rec.yield_rate?.toFixed(2) || '0.00'}%
                          </span>
                        </div>
                      </div>
                      <p className='text-sm bg-gray-100 p-2 rounded-md'>
                        {rec.summary}
                      </p>
                      <div className='flex justify-between items-center gap-5'>
                        <span
                          className={cn(
                            `px-2 py-1 text-xs rounded uppercase text-white`,
                            {
                              'bg-green-500': rec.recommendation === 'BUY',
                              'bg-[#E41F1F] ': rec.recommendation === 'SELL',
                              'bg-[#1294E5]': rec.recommendation === 'HOLD',
                            }
                          )}
                        >
                          {rec.recommendation}
                        </span>
                        <span className='text-xs text-gray-600 border-2 font-semibold rounded uppercase py-1 px-2'>
                          Confidence level: {rec.confidence}%
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='p-4'>
                    No trading insights to display. Upload a blotter to get
                    started.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          <RisksObservations />
        </div>
        <div className='col-span-full lg:col-span-1 space-y-5'>
          <TradingStyle />
        </div>
      </section>

      <Dialog>
        <DialogTrigger className='fixed bottom-5 right-5 w-14 h-14 rounded-full cursor-pointer shadow-lg text-white flex justify-center items-center bg-primary'>
          <Zap />
        </DialogTrigger>

        <DialogContent className='grid grid-cols-1 lg:grid-cols-3 gap-5 w-full sm:min-w-[90vw] md:min-w-[70vw] h-[80vh] sm:h-[85vh] md:h-[80vh] rounded-md'>
          <ChatInterface />
        </DialogContent>
      </Dialog>
    </main>
  )
}
