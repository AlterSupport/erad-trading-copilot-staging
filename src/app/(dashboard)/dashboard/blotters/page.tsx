'use client'

import FileUploadComp from '@/components/file-upload'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { FileText, Info } from 'lucide-react'

export default function BlottersPage() {
  return (
    <Card className='flex flex-col gap-5 w-full p-5'>
      <CardHeader className='flex items-center gap-3 px-0'>
        <div className='size-9 rounded-full border text-black flex justify-center items-center'>
          <FileText size={15} />
        </div>

        <div className='flex flex-col'>
          <CardTitle>Blotter Management</CardTitle>
          <CardDescription>
            Upload, manage, and analyze your trading blotters
          </CardDescription>
        </div>
      </CardHeader>

      <Separator />

      <div className='max-w-4xl mx-auto flex flex-col gap-5 w-full'>
        <FileUploadComp className='max-w-4xl' />

        <Card className=''>
          <CardHeader>
            <CardTitle>Upload History</CardTitle>
          </CardHeader>

          {/* File List */}
          <CardContent className='space-y-3'></CardContent>

          <CardFooter>
            <Alert className='bg-secondary-badge-foreground border-2 border-blue-500 w-full space-y-2'>
              <Info size={15} color='#0028F0' />
              <AlertTitle className='text-sm font-medium text-blue-900'>
                Data Privacy & Security
              </AlertTitle>
              <AlertDescription className='text-sm text-secondary-badge'>
                Your trading data is encrypted and stored securely. You maintain
                full control and can delete your data at any time. We never
                share your trading information with third parties.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      </div>
    </Card>
  )
}
