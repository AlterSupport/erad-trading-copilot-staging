'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  const [marketAnalysisNotifications, setMarketAnalysisNotifications] = useState(true)
  const [sensitiveMarketEvents, setSensitiveMarketEvents] = useState(false)

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
          <div className='flex items-center justify-between p-4 border rounded-md'>
            <div>
              <Label htmlFor='market-analysis' className='font-semibold'>
                Periodic Market Analysis
              </Label>
              <p className='text-sm text-gray-500'>
                Receive regular updates and reports on market trends.
              </p>
            </div>
            <Switch
              id='market-analysis'
              checked={marketAnalysisNotifications}
              onCheckedChange={setMarketAnalysisNotifications}
            />
          </div>
          <div className='flex items-center justify-between p-4 border rounded-md'>
            <div>
              <Label htmlFor='sensitive-events' className='font-semibold'>
                Sensitive Market Events
              </Label>
              <p className='text-sm text-gray-500'>
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
