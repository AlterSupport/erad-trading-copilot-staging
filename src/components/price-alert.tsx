import { treasuryData } from '@/lib/treasury-data'
import { cn } from '@/lib/utils'
import { TrendingDown, TrendingUp } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

export default function PriceAlert() {
  return (
    <Card className='border border-border rounded-md space-y-4'>
      <CardHeader className='h-8'>
        <CardTitle className='font-semibold text-lg'>
          Price change alerts
        </CardTitle>
        <CardDescription>
          Real-time market movement & thresholds
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-5 '>
        {treasuryData.map((item) => (
          <div
            key={item.id}
            className={cn(
              'flex items-center justify-between py-2 px-4 rounded ',
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
                    Current: {item.current}%
                  </p>
                  <div className='h-[20px] w-[1px] border-l border-gray-300' />
                  <span className=''>{item.updated}</span>
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-1 text-sm'>
              <p className='font-medium'>{item.current}%</p>
              <span
                className={cn('text-xs', {
                  'text-green-700': item.change > 0,
                  'text-red-700': item.change < 0,
                })}
              >{`(${item.change > 0 ? '+' : ''}${item.change}%)`}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
