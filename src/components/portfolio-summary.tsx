'use client'
import { useBlotterStore } from '@/store/useBlotterStore'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

export default function PortfolioSummary() {
  const { analysisResults, files, selectedFile, selectFile } = useBlotterStore()
  const router = useRouter()
  const summary = selectedFile
    ? analysisResults[selectedFile.name]?.portfolio_summary
    : null

  const handleBlotterChange = (fileName: string) => {
    selectFile(fileName)
  }

  return (
    <Card className='border-none ring-0 rounded-md shadow'>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <div>
            <CardTitle>Portfolio Summary</CardTitle>
            <CardDescription>
              A summary of your current portfolio.
            </CardDescription>
          </div>
          <div className='flex items-center gap-4'>
            <Select onValueChange={handleBlotterChange} value={selectedFile?.name}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Select Blotter' />
              </SelectTrigger>
              <SelectContent>
                {files.map((file) => (
                  <SelectItem key={file.name} value={file.name}>
                    {file.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => router.push('/dashboard/blotters')}>
              Upload Blotter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {summary ? (
          <div className='space-y-4'>
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Total Trades</p>
                <p className='text-lg font-semibold'>{summary.total_trades}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Buy Trades</p>
                <p className='text-lg font-semibold'>{summary.buy_trades}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Sell Trades</p>
                <p className='text-lg font-semibold'>{summary.sell_trades}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Total Volume</p>
                <p className='text-lg font-semibold'>
                  {summary.total_volume.toLocaleString()}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>P&L</p>
                <p className='text-lg font-semibold'>
                  ${summary.pnl.toLocaleString()}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Profit Margin</p>
                <p className='text-lg font-semibold'>
                  {summary.profit_margin.toFixed(2)}%
                </p>
              </div>
            </div>
            <div>
              <h3 className='text-md font-semibold mb-2'>
                Trade Performance
              </h3>
              <ResponsiveContainer width='100%' height={300}>
                <LineChart data={summary.trade_performance}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='pnl'
                    stroke='#8884d8'
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <p>
            No portfolio summary to display. Upload a blotter to get started.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
