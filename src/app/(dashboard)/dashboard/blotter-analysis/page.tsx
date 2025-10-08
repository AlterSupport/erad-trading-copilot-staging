'use client'

'use client'

import { Button } from '@/components/ui/button'
import { useBlotterStore } from '@/store/useBlotterStore'
import PortfolioSummary from '@/components/portfolio-summary'
import RisksObservations from '@/components/risks-observations'
import TradingStyle from '@/components/trading-style'
import {
  ArrowLeft,
  CheckCircle,
  FileUp,
  Loader,
  XCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function BlotterAnalysisPage() {
  const {
    analysisResults,
    selectedFile,
    error,
    isUploading,
    progress,
    setProgress,
  } = useBlotterStore()
  const router = useRouter()
  const analysisResult = selectedFile
    ? analysisResults[selectedFile.name]
    : null
  const [currentStage, setCurrentStage] = useState(0)

  const analysisStages = [
    {
      icon: <FileUp className='w-10 h-10 text-primary' />,
      label: 'Uploading...',
    },
    {
      icon: <Loader className='w-10 h-10 text-primary animate-spin' />,
      label: 'Parsing your data...',
    },
    {
      icon: <Loader className='w-10 h-10 text-primary animate-spin' />,
      label: 'Analyzing your trading patterns...',
    },
    {
      icon: <CheckCircle className='w-10 h-10 text-green-500' />,
      label: 'Analysis complete!',
    },
    {
      icon: <XCircle className='w-10 h-10 text-red-500' />,
      label: 'Error',
    },
  ]

  useEffect(() => {
    let progressInterval: NodeJS.Timeout | null = null

    if (analysisResult) {
      setCurrentStage(3)
      setProgress(100)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000) // Redirect after 1 second
    } else if (error) {
      setCurrentStage(4)
      setProgress(0)
    } else if (isUploading || selectedFile) {
      setCurrentStage(1) // Start with "Parsing..."
      const startTime = Date.now()
      const totalDuration = 60000 // 60 seconds

      progressInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime
        const progress = Math.min(95, (elapsedTime / totalDuration) * 100)
        setProgress(progress)

        if (progress > 50) {
          setCurrentStage(2) // Move to "Analyzing..."
        }

        if (progress >= 95) {
          if (progressInterval) clearInterval(progressInterval)
        }
      }, 500)
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval)
    }
  }, [analysisResult, error, isUploading, selectedFile, setProgress])

  if (analysisResult) {
    return (
      <main className='max-h-full space-y-5'>
        <Button
          variant={'ghost'}
          className='absolute top-4 left-4'
          onClick={() => router.back()}
        >
          <ArrowLeft />
        </Button>
        <PortfolioSummary />
        <section className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
          <div className='col-span-full lg:col-span-2 space-y-5'>
            <RisksObservations />
          </div>
          <div className='col-span-full lg:col-span-1 space-y-5'>
            <TradingStyle />
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className='relative flex flex-col space-y-10 min-h-full '>
      <Button
        variant={'ghost'}
        className='absolute top-4 left-4'
        onClick={() => router.back()}
      >
        <ArrowLeft />
      </Button>

      <header className='max-w-xl flex flex-col justify-center items-center gap-8 text-center mt-[8rem] mx-auto'>
        <div className='flex flex-col items-center gap-4'>
          {analysisStages[currentStage].icon}
          <span className='text-2xl font-semibold'>
            {analysisStages[currentStage].label}
          </span>
        </div>
        {!analysisResult && currentStage < 3 && (
          <p className='text-ring'>
            Wait while the AI agent parses the blotter to build a deep, private
            understanding of your user's trading profile.
          </p>
        )}
        <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
          <div
            className='bg-blue-600 h-2.5 rounded-full'
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <Button
          variant={'secondary'}
          size={'lg'}
          className='bg-white ring ring-border shadow-md'
          onClick={() => router.push('/dashboard/upload-blotter')}
        >
          Cancel
        </Button>
      </header>
    </main>
  )
}
