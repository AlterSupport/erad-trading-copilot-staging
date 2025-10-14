'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PRICE_ALERT_BONDS } from '@/config/price-alert-bonds'

type SelectedBondMap = Record<string, boolean>

const createDefaultSelection = (bonds: readonly string[]): SelectedBondMap =>
  bonds.reduce((acc, bond) => {
    acc[bond] = true
    return acc
  }, {} as SelectedBondMap)

export default function SettingsPage() {
  const [email, setEmail] = useState('')
  const [availableBonds, setAvailableBonds] = useState<string[]>([...PRICE_ALERT_BONDS])
  const [selectedBonds, setSelectedBonds] = useState<SelectedBondMap>(() =>
    createDefaultSelection(PRICE_ALERT_BONDS),
  )
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const settingsUrl = process.env.NEXT_PUBLIC_REGISTER_EMAIL_URL

  const handleLoadPreferences = async () => {
    if (!email) {
      alert('Enter an email to load preferences.')
      return
    }
    if (!settingsUrl) {
      console.error('Email preferences URL is not configured.')
      alert('Preferences service is not configured.')
      return
    }

    setIsLoadingPreferences(true)
    try {
      const response = await fetch(`${settingsUrl}?email=${encodeURIComponent(email)}`)
      if (!response.ok) {
        throw new Error('Failed to load preferences.')
      }
      const data = await response.json()

      const bondsFromService: string[] =
        Array.isArray(data.availableBonds) && data.availableBonds.length > 0
          ? data.availableBonds
          : [...PRICE_ALERT_BONDS]

      const selectedFromService: string[] = Array.isArray(data.selectedBonds)
        ? data.selectedBonds.filter((bond: string) => bondsFromService.includes(bond))
        : [...bondsFromService]

      setAvailableBonds(bondsFromService)
      setSelectedBonds(
        bondsFromService.reduce((acc, bond) => {
          acc[bond] = selectedFromService.includes(bond)
          return acc
        }, {} as SelectedBondMap),
      )
    } catch (error) {
      console.error('Error loading preferences:', error)
      alert('Failed to load preferences. Please try again.')
    } finally {
      setIsLoadingPreferences(false)
    }
  }

  const handleSavePreferences = async () => {
    if (!email) {
      alert('Enter an email to save preferences.')
      return
    }
    if (!settingsUrl) {
      console.error('Email preferences URL is not configured.')
      alert('Preferences service is not configured.')
      return
    }

    setIsSaving(true)
    try {
      const bondsToSave = availableBonds.filter((bond) => selectedBonds[bond])
      const response = await fetch(settingsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, bonds: bondsToSave }),
      })
      if (!response.ok) {
        throw new Error('Failed to save preferences.')
      }
      alert('Preferences saved successfully!')
    } catch (error) {
      console.error('Error saving preferences:', error)
      alert('Failed to save preferences. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleBond = (bond: string, enabled: boolean) => {
    setSelectedBonds((prev) => ({
      ...prev,
      [bond]: enabled,
    }))
  }

  const handleSelectAll = () => {
    setSelectedBonds(createDefaultSelection(availableBonds))
  }

  const handleClearAll = () => {
    setSelectedBonds(
      availableBonds.reduce((acc, bond) => {
        acc[bond] = false
        return acc
      }, {} as SelectedBondMap),
    )
  }

  const disableInteractions = isLoadingPreferences || isSaving

  return (
    <main className="space-y-5">
      <Card className="border-none ring-0 rounded-md shadow">
        <CardHeader>
          <CardTitle>Price Alert Preferences</CardTitle>
          <CardDescription>
            Choose which bonds trigger email notifications. Load your saved preferences, adjust the
            toggles, then save when you&apos;re done.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="sm:flex-1"
              />
              <div className="flex gap-2">
                <Button onClick={handleLoadPreferences} disabled={isLoadingPreferences || !email}>
                  {isLoadingPreferences ? 'Loading...' : 'Load'}
                </Button>
                <Button onClick={handleSavePreferences} disabled={disableInteractions || !email}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-semibold">Bond Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Toggle alerts on or off for each supported bond.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll} disabled={disableInteractions}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearAll} disabled={disableInteractions}>
                Clear All
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {availableBonds.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No bonds available for price alerts right now.
              </p>
            )}
            {availableBonds.map((bond) => {
              const switchId = `bond-${bond.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
              return (
                <div
                  key={bond}
                  className="flex items-center justify-between rounded-md border border-border p-4"
                >
                  <div>
                    <Label htmlFor={switchId} className="font-semibold">
                      {bond}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Email alerts for daily yield changes on {bond}.
                    </p>
                  </div>
                  <Switch
                    id={switchId}
                    checked={!!selectedBonds[bond]}
                    onCheckedChange={(checked) => toggleBond(bond, checked)}
                    disabled={disableInteractions}
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
