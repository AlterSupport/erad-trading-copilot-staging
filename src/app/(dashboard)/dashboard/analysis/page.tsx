'use client'

import CircularLoader from '@/components/loading-spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useBlotterStore } from '@/store/useBlotterStore'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const data = [
  {
    title: 'Portfolio Analysis',
    description:
      'Deep analysis of your trading patterns, risk exposure, and asset concentration.',
  },
  {
    title: 'Real-Time Insights',
    description:
      'AI-powered alerts connecting global events to your specific holdings.',
  },
  {
    title: 'Conversation AI',
    description:
      'Ask complex questions about your portfolio in natural language.',
  },
]

export default function AnalysisPage() {
  const { analysisResults, selectedFile, error, isUploading } =
    useBlotterStore()
  const router = useRouter()
  const analysisResult = selectedFile
    ? analysisResults[selectedFile.name]
    : null
  const [statusMessage, setStatusMessage] = useState('Parsing your data...')

  useEffect(() => {
    if (isUploading) {
      setStatusMessage('Uploading...')
    } else if (selectedFile && !analysisResult) {
      setStatusMessage('Parsing your data...')
    } else if (analysisResult) {
      setStatusMessage('Analysis complete! Redirecting...')
      // Redirect to the main dashboard after a short delay
      const timer = setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
      return () => clearTimeout(timer)
    }

    if (error) {
      setStatusMessage(`Error: ${error}`)
    }
  }, [analysisResult, error, router, isUploading, selectedFile])

  return (
    <main className='relative flex flex-col space-y-10 min-h-full '>
      <Button
        variant={'ghost'}
        className='absolute top-4 left-4'
        onClick={() => router.back()}
      >
        <ArrowLeft />
      </Button>

      <header className='max-w-xl flex flex-col justify-center items-center gap-4 text-center mt-[8rem] mx-auto'>
        {!error && <CircularLoader size={80} strokeWidth={10} />}
        <h3 className='font-semibold text-lg'>{statusMessage}</h3>
        {!analysisResult && (
          <p className='text-ring'>
            Wait while the AI agent parses the blotter to build a deep, private
            understanding of your user&#39;s trading profile.
          </p>
        )}
        <Button
          variant={'secondary'}
          size={'lg'}
          className='bg-white ring ring-border shadow-md'
          onClick={() => router.push('/dashboard/upload-blotter')}
        >
          Cancel
        </Button>
      </header>

      <section className='grid grid-cols-1 gap-5 lg:grid-cols-3 mx-auto w-full max-w-6xl'>
        {data.map((feature) => (
          <Card
            key={feature.title}
            className='border border-border hover:border-primary transition-colors'
          >
            <CardHeader className='flex flex-col justify-center items-center gap-4'>
              <Image
                src={`/triangle.png`}
                alt={feature.title}
                width={40}
                height={40}
                className='object-cover'
              />
              <CardTitle className=''>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground text-center'>
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  )
}
