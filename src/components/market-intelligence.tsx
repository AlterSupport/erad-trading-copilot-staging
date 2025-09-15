import { Separator } from '@radix-ui/react-separator'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { bondData, BondData } from '@/lib/bond-data'
import { Badge } from './ui/badge'

const recommendationStyles = {
  BUY: 'bg-green-500',
  SELL: 'bg-red-500',
  HOLD: 'bg-gray-500',
}

export default function MarketIntelligence() {
  return (
    <Card className='border-none ring-0 rounded-md shadow'>
      <CardHeader>
        <CardTitle className='capitalize font-semibold text-xl'>
          Trading Insights
        </CardTitle>
        <CardDescription>Eurobond Market Analysis</CardDescription>
      </CardHeader>
      <CardContent className='space-y-5'>
        <div className='space-y-4'>
          {bondData.map((bond: BondData) => (
            <div
              key={bond.id}
              className='border border-border rounded-md p-4 space-y-3'
            >
              <header className='flex items-center gap-3 flex-wrap'>
                <Badge
                  className={`${
                    recommendationStyles[bond.recommendation]
                  } text-white`}
                >
                  {bond.recommendation}
                </Badge>
                <Badge variant='outline'>{bond.risk}</Badge>
                <Badge variant='secondary'>{bond.confidence}% Confidence</Badge>
              </header>
              <div>
                <h5 className='font-semibold'>{bond.title}</h5>
                <p className='text-gray-500 text-sm'>{bond.description}</p>
              </div>
              <Separator />
              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-500'>CUSIP: {bond.cusip}</span>
                <span className='text-gray-500'>Updated: {bond.updated}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
