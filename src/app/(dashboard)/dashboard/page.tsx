'use client'

import BlotterData from '@/components/blotter-data'
import ChatInterface from '@/components/chat-interface'
import MarketIntelligence from '@/components/market-intelligence'
import PriceAlert from '@/components/price-alert'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
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
        <div className='flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-md'>
          <Upload className='w-12 h-12 text-gray-400' />
          <p className='mt-4 text-lg font-semibold'>
            No blotter data to display
          </p>
          <p className='mt-2 text-sm text-gray-500'>
            Upload a blotter to get started
          </p>
          <Button asChild className='mt-4'>
            <Link href='/dashboard/upload-blotter'>Upload Blotter</Link>
          </Button>
        </div>
      )}

      <Dialog>
        <DialogTrigger className='fixed bottom-5 right-5 w-14 h-14 rounded-full cursor-pointer shadow-lg text-white flex justify-center items-center bg-primary'>
          <Zap />
        </DialogTrigger>

        <DialogContent className='grid grid-cols-1 lg:grid-cols-3 gap-5 w-full sm:min-w-[90vw] md:min-w-[70vw] h-[80vh] sm:h-[85vh] md:h-[80vh] rounded-md'>
          <ChatInterface />
        </DialogContent>
      </Dialog>
    </main>
  )
}
