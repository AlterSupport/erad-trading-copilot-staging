'use client'

import { useBlotterStore } from '@/store/useBlotterStore'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import { FileSpreadsheetIcon, Trash2, UploadCloud } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Button } from './ui/button'
import { saveLatestBlotterAnalysis } from '@/lib/blotter-storage'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

interface FileUploadCompProps {
  className?: string
}

export default function FileUploadComp({ className }: FileUploadCompProps) {
  const {
    addFile,
    removeFile,
    setAnalysisResult,
    setError,
    isUploading,
    setIsUploading,
    markFileSynced,
  } = useBlotterStore()
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()
  const { user } = useAuthStore()

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        // Validate file type
        const validTypes = ['.csv', '.xlsx', '.json']
        const fileType = droppedFile.name
          .toLowerCase()
          .slice(droppedFile.name.lastIndexOf('.'))
        if (!validTypes.includes(fileType)) {
          alert(
            'Invalid file type. Please upload CSV, XLSX, or JSON files only.'
          )
          return
        }

        // Validate file size (50MB = 50 * 1024 * 1024 bytes)
        if (droppedFile.size > 50 * 1024 * 1024) {
          alert('File size exceeds 50MB limit.')
          return
        }

        setFile(droppedFile)
        addFile(droppedFile)
      }
    },
    [addFile]
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const validTypes = ['.csv', '.xlsx', '.json']
      const fileType = selectedFile.name
        .toLowerCase()
        .slice(selectedFile.name.lastIndexOf('.'))
      if (!validTypes.includes(fileType)) {
        alert('Invalid file type. Please upload CSV, XLSX, or JSON files only.')
        return
      }

      // Validate file size (50MB = 50 * 1024 * 1024 bytes)
      if (selectedFile.size > 50 * 1024 * 1024) {
        alert('File size exceeds 50MB limit.')
        return
      }

      setFile(selectedFile)
      addFile(selectedFile)
    }
  }

  const handleRemoveFile = () => {
    if (file) {
      removeFile(file.name)
      setFile(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    router.push('/dashboard/blotter-analysis')

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      const base64File = reader.result?.toString().split(',')[1]
      if (!base64File) {
        alert('Failed to read file.')
        setIsUploading(false)
        return
      }

      const fileType = file.name.split('.').pop()?.toLowerCase()

      try {
        const response = await fetch('/api/upload-blotter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileContent: base64File,
            fileName: file.name,
            fileType: fileType,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to upload blotter.')
        }

        const result = await response.json()
        setAnalysisResult(file.name, result)
        console.log('Blotter upload result:', result)

        if (user) {
          const uploadedAt = new Date().toISOString()
          try {
            await saveLatestBlotterAnalysis(user.uid, {
              fileName: file.name,
              analysis: result,
              fileSize: file.size,
              uploadedAt,
            })
            markFileSynced(file.name, uploadedAt)
          } catch (syncError) {
            console.error('Error syncing blotter analysis to Firestore:', syncError)
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message || 'An unknown error occurred.')
        }
        console.error('Error uploading blotter:', error)
      } finally {
        setIsUploading(false)
      }
    }
  }

  return (
    <Card className={cn('w-full h-auto max-w-2xl m-auto p-5', className)}>
      <CardHeader className='flex flex-col justify-center items-center gap-4'>
        <CardTitle className='text-lg'>Encrypted File Upload</CardTitle>
        <CardDescription className='flex flex-col md:flex-row items-center gap-3 md:gap-5 text-sm text-center md:text-left'>
          <span>Supported formats: CSV, XSLX, JSON </span>
          <div className='hidden md:block w-1 h-1 rounded-full bg-ring'></div>
          <span>Maximum file size: 50MB</span>
        </CardDescription>
      </CardHeader>

      <CardContent
        className={cn(
          'relative border-2 border-dashed p-8 flex flex-col gap-3 justify-center items-center rounded-md transition-all',
          isDragging ? 'bg-accent' : 'hover:bg-accent/50',
          file ? 'border-border' : 'border-border'
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          type='file'
          id='file-upload'
          className='hidden'
          onChange={handleFileSelect}
          accept='.csv,.xlsx,.json'
        />

        <UploadCloud
          className={cn(
            'w-10 h-10 transition-colors',
            isDragging || file ? 'text-primary' : 'text-muted-foreground'
          )}
        />
        <h1 className='text-lg font-semibold'>Drop your file here</h1>
        <p className='text-sm text-muted-foreground'>
          or click to browse files
        </p>
        <Button
          variant='outline'
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          Choose File
        </Button>
      </CardContent>
      {file && (
        <CardFooter className='w-full flex flex-col justify-start items-start gap-3 p-0'>
          <h3 className='text-sm font-medium'>File Uploaded</h3>
          {file && (
            <>
              <div className='border rounded-md p-5 w-full flex flex-col justify-between items-center gap-5'>
                <div className='flex justify-between items-center w-full'>
                  <div className='flex items-center gap-3'>
                    <FileSpreadsheetIcon />
                    <div className='flex flex-col gap-1'>
                      <span className='text-sm font-medium'>{file.name}</span>
                      <div className='flex items-center gap-3'>
                        <span className='text-xs text-muted-foreground'>
                          {formatFileSize(file.size)}
                        </span>
                        <div className='w-1 h-1 rounded-full bg-ring'></div>
                        <span className='text-xs'>Completed</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant={'ghost'}
                    size={'icon'}
                    className='text-ring hover:text-red-500 transition-colors bg-transparent shadow-none'
                    onClick={handleRemoveFile}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </>
          )}

          <Button
            size={'lg'}
            disabled={!file || isUploading}
            className='ml-auto flex'
            onClick={handleUpload}
          >
            {isUploading ? 'Uploading...' : 'Continue'}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
