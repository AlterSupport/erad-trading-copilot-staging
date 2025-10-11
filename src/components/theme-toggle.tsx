'use client'

import { Moon, Sun } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { useTheme } from './theme-provider'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()

  const isDark = theme === 'dark'

  return (
    <Button
      type='button'
      variant='ghost'
      size='icon'
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={cn(
        'relative border border-border/50 bg-background/40 hover:bg-accent/60 focus-visible:ring-ring/60',
        className
      )}
    >
      <Sun
        className={cn(
          'absolute size-5 transition-all duration-300',
          isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        )}
      />
      <Moon
        className={cn(
          'absolute size-5 transition-all duration-300',
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
        )}
      />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
