import { AlertTriangleIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

export default function RisksObservations() {
  return (
    <Tabs defaultValue='risks'>
      <Card className='border-none ring-0 rounded-md shadow'>
        <CardHeader>
          <CardTitle className='capitalize font-semibold text-xl'>
            Key Risk & observations
          </CardTitle>
          <CardDescription>Current positions and exposures</CardDescription>
          <TabsList className='p-1 h-11'>
            <TabsTrigger value='risks'>Key Risks</TabsTrigger>
            <TabsTrigger value='observations'>AI Observations</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className='space-y-8'>
          <TabsContent value='risks' className='space-y-5'>
            <Alert
              variant={'default'}
              className='border-destructive bg-destructive/5 border-3'
            >
              <AlertTriangleIcon color='#E03636' />
              <AlertTitle className='text-black'>Duration Risk</AlertTitle>
              <AlertDescription className='text-gray-500'>
                Portfolio weighted average duration of 12.4 years. Highly
                senstive to interest rate changes (+50bps = -6.2% impact)
              </AlertDescription>
            </Alert>

            <Alert
              variant={'default'}
              className='border-[#FF8800] bg-[#FF8800]/10 border-3'
            >
              <AlertTriangleIcon color='#FF8800' />
              <AlertTitle className='text-black'>
                Credit Spread Widening{' '}
              </AlertTitle>
              <AlertDescription className='text-gray-500'>
                Corporate bonds showing signs of spread expandsion. Monitor
                credit quality closely.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value='observations' className='space-y-5'>
            <Card className='border border-border rounded-md space-y-4'>
              <CardContent className='space-y-2'>
                <h3 className='font-medium text-xl'>Consider Duration Hedge</h3>
                <span className='h-9 w-[150px] px-4 flex justify-center items-center font-semibold uppercase text-xs rounded-md bg-[#AD7D47] text-white'>
                  Medium Priority
                </span>
                <p className='text-ring'>
                  Reduce treasury concentration, increase investment grade
                  corporate exposure
                </p>
                <div className='flex flex-col lg:flex-row lg:items-center lg:gap-2'>
                  <h5 className='text-ring'>Expected impact:</h5>
                  <span className='text-black'>
                    Improved risk-adjusted returns
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className='border border-border rounded-md space-y-4'>
              <CardContent className='space-y-2'>
                <h3 className='font-medium text-xl'>Consider Duration Hedge</h3>
                <span className='h-9 w-[150px] px-4 flex justify-center items-center font-semibold uppercase text-xs rounded-md bg-[#AD7D47] text-white'>
                  Medium Priority
                </span>
                <p className='text-ring'>
                  Reduce treasury concentration, increase investment grade
                  corporate exposure
                </p>
                <div className='flex flex-col lg:flex-row lg:items-center lg:gap-2'>
                  <h5 className='text-ring'>Expected impact:</h5>
                  <span className='text-black'>
                    Improved risk-adjusted returns
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  )
}
