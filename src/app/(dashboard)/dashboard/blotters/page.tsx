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
import { Download, FileText, Info, Trash2 } from 'lucide-react'

interface FileItem {
  id: string
  name: string
  uploadDate: string
  trades: number
  size: string
  type: 'csv' | 'xlsx'
}

const fileItems: FileItem[] = [
  {
    id: '1',
    name: 'Q4_2025_Bond_Trades.csv',
    uploadDate: '12/5/2025',
    trades: 247,
    size: '2.4mb',
    type: 'csv',
  },
  {
    id: '2',
    name: 'November_Blotter.xlsx',
    uploadDate: '12/5/2025',
    trades: 247,
    size: '2.4mb',
    type: 'xlsx',
  },
  {
    id: '3',
    name: 'October_Trades.csv',
    uploadDate: '12/5/2025',
    trades: 247,
    size: '2.4mb',
    type: 'csv',
  },
]

export default function BlottersPage() {
  const handleDownload = (fileName: string) => {
    console.log('Downloading:', fileName)
    // Add download logic here
  }

  const handleDelete = (fileName: string) => {
    console.log('Deleting:', fileName)
    // Add delete logic here
  }

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
          <CardContent className='space-y-3'>
            {fileItems.map((file) => (
              <div
                key={file.id}
                className={`flex flex-col lg:flex-row lg:items-center lg:justify-between md:flex-row gap-5 p-4 border shadow rounded-md `}
              >
                {/* File Info Section */}
                <div className='flex lg:items-center md:items-center space-x-4 flex-1'>
                  <div className='size-8 rounded-full border flex items-center justify-center'>
                    <FileText className='w-4 h-4 text-blue-600' />
                  </div>

                  <div className='min-w-0 space-y-2'>
                    <p className='text-sm font-medium text-gray-900 truncate'>
                      {file.name}
                    </p>
                    <div className='flex space-x-2 flex-row flex-wrap justify-start lg:flex-row lg:items-center md:flex-row gap-2 lg:space-x-4'>
                      <span className='text-xs text-gray-500'>
                        Uploaded {file.uploadDate}
                      </span>
                      <div className='h-[20px] w-[1px] border-l border-gray-300 ' />
                      <span className='text-xs text-gray-500'>
                        {file.trades} trades
                      </span>
                      <div className='h-[20px] w-[1px] border-l border-gray-300 hidden lg:inline-block md:inline-block' />
                      <span className='text-xs text-gray-500'>{file.size}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex items-center space-x-2 ml-auto lg:ml-0'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleDownload(file.name)}
                    className='size-8 p-0 rounded-full cursor-pointer'
                  >
                    <Download className='size-4 text-gray-600' />
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleDelete(file.name)}
                    className='size-8 p-0 text-red-700 rounded-full cursor-pointer'
                  >
                    <Trash2 className='size-4' />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>

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
