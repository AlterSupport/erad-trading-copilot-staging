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

export default function TradingStyle() {
  return (
    <Tabs defaultValue='patterns' className='w-full'>
      <Card className='border-none ring-0 rounded-md shadow'>
        <CardHeader className='h-26'>
          <CardTitle className='capitalize font-semibold text-xl'>
            trading styles
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
            <div className='border border-border rounded-md p-4 space-y-4'>
              <div className='flex flex-col gap-1'>
                <header className='flex items-center gap-3'>
                  <div className='flex items-center gap-2'>
                    <TrendingUp size={15} className='text-yellow-700' />
                    <h3 className='font-semibold'>Early Exist Bias</h3>
                  </div>
                  <Badge className='bg-yellow-50 text-yellow-700 border border-yellow-500 rounded py-1 px-4'>
                    Weekness
                  </Badge>
                </header>
                <p className='text-sm text-ring'>
                  You tend to exit winning position at 15% earlier than optimal
                  timing{' '}
                </p>
              </div>
              <div className='flex items-center gap-3'>
                <span className='text-sm'>Frequency:</span>
                <div className='flex items-center gap-3'>
                  <Progress
                    indicatorColor='bg-blue-700'
                    value={66}
                    className='w-14'
                  />
                  <span className='text-sm text-ring'>65%</span>
                </div>
              </div>

              <Separator />

              <div className='flex gap-2 text-green-700 font-semibold'>
                <Zap className='' />
                <span className=''>
                  Consider setting profit targets 20% higher to capture
                  additional upside
                </span>
              </div>
            </div>

            <div className='border border-border rounded-md p-4 space-y-4'>
              <div className='flex flex-col gap-1'>
                <header className='flex items-center gap-3'>
                  <div className='flex items-center gap-2'>
                    <TrendingUp size={15} className='text-yellow-700' />
                    <h3 className='font-semibold'>Duration Timing</h3>
                  </div>
                  <Badge className='bg-green-50 text-green-700 border border-green-500 rounded py-1 px-4'>
                    Weekness
                  </Badge>
                </header>
                <p className='text-sm text-ring'>
                  Strong track record of reducing duration exposure before rate
                  hikes
                </p>
              </div>
              <div className='flex items-center gap-3'>
                <span className='text-sm'>Frequency:</span>
                <div className='flex items-center gap-3'>
                  <Progress
                    indicatorColor='bg-blue-700'
                    value={70}
                    className='w-14'
                  />
                  <span className='text-sm text-ring'>70%</span>
                </div>
              </div>

              <Separator />

              <div className='flex gap-2 text-green-700 font-semibold'>
                <Zap className='' />
                <span className=''>
                  Consider setting profit targets 20% higher to capture
                  additional upside
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='opportunities' className='space-y-5'>
            <Card className='border border-border rounded-md space-y-4'>
              <CardContent className='space-y-5'>
                <header className='flex justify-between items-center'>
                  <div className='flex flex-col gap-2'>
                    <h4 className='font-medium'>Apple Inc 2.4%</h4>
                    <div className='flex items-center gap-2 text-ring text-sm'>
                      <Button
                        variant={'outline'}
                        size={'sm'}
                        className='uppercase'
                      >
                        sell
                      </Button>
                      <span className=''>Nov 15, 2025</span>
                    </div>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <h5
                      className={cn('font-semibold', {
                        'text-green-700': +32000 > 0,
                        'text-red-700': 32000 < 0,
                      })}
                    >
                      +32,000
                    </h5>
                    <span
                      className={cn('text-sm', {
                        'text-green-700': +3.7 > 0,
                        'text-red-700': 1 < 0,
                      })}
                    >
                      (+3.4%)
                    </span>
                  </div>
                </header>

                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between items-center w-full text-sm'>
                    <div className='flex items-center gap-2'>
                      <h4 className='text-ring'>Executed: </h4>
                      <span className='text-black'>$95.20</span>
                    </div>

                    <div className='flex items-center gap-2'>
                      <h4 className='text-ring'>Optimal: </h4>
                      <span className='text-black'>$100.00</span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 text-sm'>
                    <h4 className='text-ring'>Optimal timing: </h4>
                    <span className='text-black'>5 days later</span>
                  </div>
                  <p className=''>
                    Sold during temporary dip before dovish pivot
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className='border border-border rounded-md p-2 space-y-4'>
              <CardContent className='p-0 space-y-5'>
                <header className='flex justify-between items-center'>
                  <div className='flex flex-col gap-2'>
                    <h4 className='font-medium'>Apple Inc 2.4%</h4>
                    <div className='flex items-center gap-2 text-ring text-sm'>
                      <Button
                        variant={'outline'}
                        size={'sm'}
                        className='uppercase'
                      >
                        sell
                      </Button>
                      <span className=''>Nov 15, 2025</span>
                    </div>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <h5
                      className={cn('font-semibold', {
                        'text-green-700': +32000 > 0,
                        'text-red-700': -32000 < 0,
                      })}
                    >
                      +32,000
                    </h5>
                    <span
                      className={cn('text-sm', {
                        'text-green-700': +3.7 > 0,
                        'text-red-700': -3.7 < 0,
                      })}
                    >
                      (+3.4%)
                    </span>
                  </div>
                </header>

                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between items-center w-full text-sm'>
                    <div className='flex items-center gap-2'>
                      <h4 className='text-ring'>Executed: </h4>
                      <span className='text-black'>$95.20</span>
                    </div>

                    <div className='flex items-center gap-2'>
                      <h4 className='text-ring'>Optimal: </h4>
                      <span className='text-black'>$100.00</span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 text-sm'>
                    <h4 className='text-ring'>Optimal timing: </h4>
                    <span className='text-black'>5 days later</span>
                  </div>
                  <p className=''>
                    Sold during temporary dip before dovish pivot
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  )
}
