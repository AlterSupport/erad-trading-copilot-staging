import { Separator } from '@radix-ui/react-separator'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

export default function MarketIntelligence() {
  return (
    <Tabs defaultValue='news'>
      <Card className='border-none ring-0 rounded-md shadow'>
        <CardHeader>
          <CardTitle className='capitalize font-semibold text-xl'>
            Market Intelligence
          </CardTitle>
          <CardDescription>Current positions and exposures</CardDescription>
          <TabsList className='h-11 p-1'>
            <TabsTrigger value='news'>News</TabsTrigger>
            <TabsTrigger value='events'>Events</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className='space-y-8'>
          <TabsContent value='news' className='space-y-5'>
            <div className='border border-border rounded-md p-4 space-y-4'>
              <header className='flex items-center gap-5 flex-wrap'>
                <div className='h-8 text-sm rounded flex justify-center items-center px-4 font-medium border border-destructive text-destructive uppercase'>
                  negative
                </div>
                <div className='h-8 text-sm rounded flex justify-center items-center px-4 font-medium bg-destructive text-white uppercase'>
                  high
                </div>
                <div className='h-8 text-sm rounded flex justify-center items-center px-4 font-medium border border-ring text-ring uppercase'>
                  98% match
                </div>
              </header>
              <div className=''>
                <h5 className='space-y-1'>
                  Fed signal potential rate hike amid presidential inflation
                </h5>
                <p className='text-gray-500'>
                  Powell comment suggest more aggressive monetary policy ahead,
                  with market expectations shifting towards a 50bps hike in the
                  next meeting.
                </p>
              </div>

              <Separator />

              <Link href={'#'} className='underline '>
                Bloomberg
              </Link>
            </div>

            <div className='border border-border rounded-md p-4 space-y-4'>
              <header className='flex items-center gap-5 flex-wrap'>
                <div className='h-8 text-sm rounded flex justify-center items-center px-4 font-medium border border-green-500 text-green-500 uppercase'>
                  negative
                </div>
                <div className='h-8 text-sm rounded flex justify-center items-center px-4 font-medium bg-green-500 text-white uppercase'>
                  high
                </div>
                <div className='h-8 text-sm rounded flex justify-center items-center px-4 font-medium border border-ring text-ring uppercase'>
                  98% match
                </div>
              </header>
              <div className=''>
                <h5 className='space-y-1'>
                  Fed signal potential rate hike amid presidential inflation
                </h5>
                <p className='text-gray-500'>
                  Powell comment suggest more aggressive monetary policy ahead,
                  with market expectations shifting towards a 50bps hike in the
                  next meeting.
                </p>
              </div>

              <Separator />

              <Link href={'#'} className='underline '>
                Bloomberg
              </Link>
            </div>
          </TabsContent>

          <TabsContent value='events' className='space-y-5'>
            <Card className='border border-border rounded-md'>
              <CardContent className='space-y-3'>
                <span className='h-8 w-14 rounded flex justify-center items-center px-4 font-medium bg-destructive text-white text-sm uppercase'>
                  high
                </span>

                <div className='space-y-3'>
                  <h5 className='space-y-1'>
                    Fed signal potential rate hike amid presidential inflation
                  </h5>
                  <div className='flex items-center gap-2 text-sm text-ring'>
                    <span className='text-muted-foreground'>Today</span>
                    <div className='h-[20px] w-[1px] border-l border-gray-300' />
                    <span className=''>2:00 PM EST</span>
                  </div>
                  <p className='text-gray-500'>
                    Powell comment suggest more aggressive monetary policy
                    ahead, with market expectations shifting towards a 50bps
                    hike in the next meeting.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className='border border-border rounded-md'>
              <CardContent className='space-y-3'>
                <span className='h-8 w-14 rounded flex justify-center items-center px-4 font-medium bg-destructive text-white text-sm uppercase'>
                  high
                </span>

                <div className='space-y-3'>
                  <h5 className='space-y-1'>
                    Fed signal potential rate hike amid presidential inflation
                  </h5>
                  <div className='flex items-center gap-2 text-sm text-ring'>
                    <span className='text-muted-foreground'>Today</span>
                    <div className='h-[20px] w-[1px] border-l border-gray-300' />
                    <span className=''>2:00 PM EST</span>
                  </div>
                  <p className='text-gray-500'>
                    Powell comment suggest more aggressive monetary policy
                    ahead, with market expectations shifting towards a 50bps
                    hike in the next meeting.
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
