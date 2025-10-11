'use client'

import BlotterData from '@/components/blotter-data'
import MarketIntelligence from '@/components/market-intelligence'
import PriceAlert from '@/components/price-alert'
import { Button } from '@/components/ui/button'
import { useBlotterStore } from '@/store/useBlotterStore'
import { Upload } from 'lucide-react'
import { Zap } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { analysisResults, selectedFile } = useBlotterStore()
  const analysisResult = selectedFile ? analysisResults[selectedFile.name] : null

  return (
    <main className='max-h-full space-y-5'>
      <section className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
        <div className='col-span-full lg:col-span-2 space-y-5'>
          <MarketIntelligence />
        </div>
        <div className='col-span-full lg:col-span-1 space-y-5'>
          <PriceAlert />
        </div>
      </section>

      {analysisResult ? (
        <BlotterData />
      ) : (
        <div className='flex flex-col items-center justify-center h-64 border border-dashed rounded-md border-border'>
          <Upload className='h-12 w-12 text-muted-foreground' />
          <p className='mt-4 text-lg font-semibold'>
            No blotter data to display
          </p>
          <p className='mt-2 text-sm text-muted-foreground'>
            Upload a blotter to get started
          </p>
          <Button asChild className='mt-4'>
            <Link href='/dashboard/upload-blotter'>Upload Blotter</Link>
          </Button>
        </div>
      )}

      <Button
        asChild
        size='icon'
        className='fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-emerald-400 via-sky-500 to-indigo-500 text-white shadow-[0_20px_45px_rgba(56,189,248,0.35)] transition hover:brightness-110 focus-visible:ring-4 focus-visible:ring-emerald-400/40'
      >
        <Link href='/dashboard/chat'>
          <Zap />
          <span className='sr-only'>Open Trade Advisor</span>
        </Link>
      </Button>
    </main>
  )
}
