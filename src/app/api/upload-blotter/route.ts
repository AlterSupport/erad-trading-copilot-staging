import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fileContent, fileName, fileType } = body

    const cloudFunctionUrl = process.env.CLOUD_FUNCTION_URL
    if (!cloudFunctionUrl) {
      throw new Error('CLOUD_FUNCTION_URL environment variable not set.')
    }

    const response = await fetch(cloudFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileContent,
        fileType,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to process blotter in cloud function.')
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error processing blotter:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
