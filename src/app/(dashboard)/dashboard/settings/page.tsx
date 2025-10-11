'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SettingsPage() {
  const [marketAnalysisNotifications, setMarketAnalysisNotifications] = useState(true)
  const [sensitiveMarketEvents, setSensitiveMarketEvents] = useState(false)
  const [email, setEmail] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleEmailRegister = async () => {
    setIsSaving(true)
    const url = process.env.NEXT_PUBLIC_REGISTER_EMAIL_URL
    if (!url) {
      console.error('Email registration URL is not configured.')
      setIsSaving(false)
      return
    }
    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      alert('Email registered successfully!')
    } catch (error) {
      console.error('Error registering email:', error)
      alert('Failed to register email.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className='space-y-5'>
      <Card className='border-none ring-0 rounded-md shadow'>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Manage your notification preferences for market analysis and sensitive events.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email for Notifications</Label>
            <div className='flex gap-2'>
              <Input
                id='email'
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={handleEmailRegister} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Email'}
              </Button>
            </div>
          </div>
          <div className='flex items-center justify-between rounded-md border border-border p-4'>
            <div>
              <Label htmlFor='market-analysis' className='font-semibold'>
                Periodic Market Analysis
              </Label>
              <p className='text-sm text-muted-foreground'>
                Receive regular updates and reports on market trends.
              </p>
            </div>
            <Switch
              id='market-analysis'
              checked={marketAnalysisNotifications}
              onCheckedChange={setMarketAnalysisNotifications}
            />
          </div>
          <div className='flex items-center justify-between rounded-md border border-border p-4'>
            <div>
              <Label htmlFor='sensitive-events' className='font-semibold'>
                Sensitive Market Events
              </Label>
              <p className='text-sm text-muted-foreground'>
                Get instant alerts for critical market news and events.
              </p>
            </div>
            <Switch
              id='sensitive-events'
              checked={sensitiveMarketEvents}
              onCheckedChange={setSensitiveMarketEvents}
            />
          </div>
          <div className='flex justify-end'>
            <Button>Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
