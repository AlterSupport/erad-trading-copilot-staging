'use client'

import ChatInterface from '@/components/chat-interface'
import MarketIntelligence from '@/components/market-intelligence'
import PriceAlert from '@/components/price-alert'
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
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useBlotterStore } from '@/store/useBlotterStore'
import { cn } from '@/lib/utils'
import { FileSpreadsheet, TrendingDown, TrendingUp, Zap } from 'lucide-react'

import { bondData as data } from '@/lib/bond-data'

export default function DashboardPage() {
  const { files, selectedFile, selectFile } = useBlotterStore()

  return (
    <main className='max-h-full space-y-5'>
      <Card className='border-none ring-0 rounded-md shadow'>
        <CardHeader className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div className='flex flex-col gap-1 w-full md:w-[60%] lg:w-[60%]'>
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

          <Select
            disabled={files.length === 0}
            onValueChange={selectFile}
            value={selectedFile?.name}
          >
            <SelectTrigger
              size='xl'
              className='lg:w-[250px] md:w-[250px] w-full py-0'
            >
              <SelectValue placeholder='Select a blotter' />
            </SelectTrigger>
            <SelectContent className='p-2'>
              {files.map((file) => (
                <SelectItem key={file.name} value={file.name} className='p-2'>
                  <div className='flex items-center gap-3'>
                    <FileSpreadsheet size={8} className='' />
                    <span>{file.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className='relative'>
          <div className='w-full overflow-x-auto flex snap-x snap-mandatory space-x-6 py-6 px-1 scrollbar-hide '>
            {data.map((bond) => (
              <div
                key={bond.id}
                className='snap-center flex-none w-[300px] lg:w-[330px] md:w-[330px] bg-white rounded-md p-5 border transform transition duration-300 hover:scale-105 hover:border-black cursor-pointer space-y-4'
              >
                <div className='flex justify-between items-center gap-5 '>
                  <div className='flex flex-col gap-2 w-2/3'>
                    <h3 className='font-semibold '>{bond.title}</h3>
                    <span className='text-xs text-gray-500'>{bond.cusip}</span>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <span className='font-semibold'>
                      ${bond.price.toFixed(2)}
                    </span>
                    <span
                      className={cn(`text-sm flex items-center gap-1`, {
                        'text-green-600': bond.change >= 0,
                        'text-red-600': bond.change < 0,
                      })}
                    >
                      {bond.change >= 0 ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      )}
                      {bond.change >= 0 ? `${bond.change}%` : `${bond.change}%`}
                    </span>
                  </div>
                </div>

                <p className='text-sm bg-gray-100 p-2 rounded-md'>
                  {bond.description}
                </p>

                <div className='flex justify-between items-center gap-5'>
                  <span
                    className={cn(
                      `px-2 py-1 text-xs rounded uppercase text-white`,
                      {
                        'bg-green-500': bond.recommendation === 'BUY',
                        'bg-[#E41F1F] ': bond.recommendation === 'SELL',
                        'bg-[#1294E5]': bond.recommendation === 'HOLD',
                      }
                    )}
                  >
                    {bond.recommendation}
                  </span>
                  <span className='text-xs text-gray-600 border-2 font-semibold rounded uppercase py-1 px-2'>
                    Confidence level: {bond.confidence}%
                  </span>
                </div>

                <Separator />

                <div className='flex justify-between items-center gap-5'>
                  <span className='font-semibold text-xs'>Sell Thresholds</span>

                  <span className='text-xs text-[#E41F1F] border border-[#E41F1F] font-semibold uppercase py-1 px-2'>
                    {bond.risk}
                  </span>
                </div>

                <div className='text-sm grid grid-cols-3 gap-2 lg:gap-5'>
                  <div className='flex flex-col gap-1'>
                    <h5 className='text-ring font-medium text-xs'>
                      Target Exit
                    </h5>
                    <p className={cn('text-xs font-medium')}>
                      {bond.thresholds.targetExit}
                    </p>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <h5 className='text-ring font-medium text-xs'>Stop Loss</h5>
                    <p className={cn('text-xs font-medium')}>
                      {bond.thresholds.stopLoss}
                    </p>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <h5 className='text-ring font-medium text-xs'>
                      Upside Target
                    </h5>
                    <p className={cn('text-xs font-medium')}>
                      {bond.thresholds.upsideTarget}
                    </p>
                  </div>
                </div>

                <Progress
                  value={bond.percentage}
                  indicatorColor={'bg-orange-500'}
                />

                <div className='mt-1 text-xs text-gray-400'>
                  Updated {bond.updated}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
        <div className='col-span-full lg:col-span-2 space-y-5'>
          <Card className='border-none ring-0 rounded-md shadow'>
            <CardHeader>
              <CardTitle className='font-semibold text-xl'>
                Portfolio Summary
              </CardTitle>
              <CardDescription>Current positions and exposures</CardDescription>
            </CardHeader>
            <CardContent className='space-y-8'>
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
                <Card className='rounded-md shadow'>
                  <CardHeader className='h-3'>
                    <CardTitle className='uppercase text-sm text-ring'>
                      Portfolio Value
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <h1 className='font-semibold text-3xl'>$23M</h1>
                    <div className='text-ring'>
                      <span className='text-green-500'>$45 (+0.2%)</span> Today
                    </div>
                  </CardContent>
                </Card>

                <Card className='rounded-md shadow'>
                  <CardHeader className='h-3'>
                    <CardTitle className='uppercase text-sm text-ring'>
                      Bond Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <h1 className='font-semibold text-3xl'>87%</h1>
                    <span className='text-ring'>of total portfolio</span>
                  </CardContent>
                </Card>

                <Card className='rounded-md shadow'>
                  <CardHeader className='h-3'>
                    <CardTitle className='uppercase text-sm text-ring'>
                      Portfolio Value
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <h1 className='font-semibold text-3xl'>$23M</h1>
                    <div className='text-ring'>
                      <span className='text-green-500'>$45 (+0.2%)</span> Today
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className='flex flex-col gap-3'>
                <h4 className='text-ring capitalize font-medium'>
                  concentration analysis{' '}
                </h4>

                <div className='flex justify-between items-center w-full gap-4'>
                  <p>US Treasury(10Y+)</p>
                  <span className=''>45%</span>
                </div>
                <div className='flex justify-between items-center w-full gap-4'>
                  <p>Corporate bonds</p>
                  <span className=''>45%</span>
                </div>
                <div className='flex justify-between items-center w-full gap-4'>
                  <p>Municipal bonds</p>
                  <span className=''>45%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <RisksObservations />
          <MarketIntelligence />
        </div>

        <div className='col-span-full lg:col-span-1 space-y-5'>
          <TradingStyle />
          <PriceAlert />
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
