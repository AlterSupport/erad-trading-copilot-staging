'use client'
import { useBlotterStore } from '@/store/useBlotterStore'
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
  const { analysisResults, selectedFile } = useBlotterStore()
  const analysisResult = selectedFile
    ? analysisResults[selectedFile.name]
    : null

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
            {analysisResult?.key_risks?.length ? (
              analysisResult.key_risks.map((risk, index) => (
                <Alert
                  key={index}
                  variant={'default'}
                  className='border-destructive bg-destructive/5 border-3'
                >
                  <AlertTriangleIcon color='#E03636' />
                  <AlertTitle className='text-foreground'>
                    {risk.title}
                  </AlertTitle>
                  <AlertDescription className='text-muted-foreground'>
                    {risk.description}
                  </AlertDescription>
                </Alert>
              ))
            ) : (
              <p>No key risks to display.</p>
            )}
          </TabsContent>

          <TabsContent value='observations' className='space-y-5'>
            {analysisResult?.ai_observations?.length ? (
              analysisResult.ai_observations.map((observation, index) => (
                <Card
                  key={index}
                  className='border border-border rounded-md space-y-4'
                >
                  <CardContent className='space-y-2'>
                    <h3 className='font-medium text-xl'>{observation.title}</h3>
                    <span className='h-9 w-[150px] px-4 flex justify-center items-center font-semibold uppercase text-xs rounded-md bg-[#AD7D47] text-white'>
                      {observation.priority}
                    </span>
                    <p className='text-ring'>{observation.description}</p>
                    <div className='flex flex-col lg:flex-row lg:items-center lg:gap-2'>
                      <h5 className='text-ring'>Expected impact:</h5>
                      <span className='text-foreground'>
                        {observation.expected_impact}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No AI observations to display.</p>
            )}
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  )
}
