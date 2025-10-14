'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import { toPng } from 'html-to-image'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Skeleton } from './ui/skeleton'

interface BondEntry {
  symbol: string
  price: number | null
  yield: number | null
  change: number | null
  notes?: string | null
  asOf?: string | null
  lastUpdated?: string | null
  error?: string | null
  source?: string | null
  sources?: string[]
}

interface MarketHighlights {
  generatedAt: string
  averageYield: number | null
  topMover: BondEntry | null
  positiveMoves: number
  negativeMoves: number
  overviewText: string
}

interface MarketNarrative {
  fixed_income?: string[]
  market_notes?: string[]
  currency?: string[]
  equities?: string[]
}

interface MarketReportData {
  asOf: string | null
  generatedAt: string
  overviewText: string
  highlights: MarketHighlights
  bonds: BondEntry[]
  narrative?: MarketNarrative | null
}

type CountryBucket = 'us' | 'nigeria' | 'angola' | 'other'

interface NarrativeSections {
  fixedIncome: string[]
  marketNotes: string[]
  currency: string[]
  equities: string[]
}

export default function MarketReport() {
  const [report, setReport] = useState<MarketReportData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  const reportRef = useRef<HTMLDivElement>(null)

  const dailyReportUrl = process.env.NEXT_PUBLIC_DAILY_MARKET_REPORT_URL

  const fetchReport = useCallback(async () => {
    if (!dailyReportUrl) {
      setError('Daily report URL is not configured.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${dailyReportUrl}?preview=true`, {
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(`Failed to load market report (${response.status}).`)
      }

      const payload = await response.json()
      setReport(payload.report)
    } catch (err) {
      console.error('Error fetching market report:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'We could not fetch the latest report.'
      )
      setReport(null)
    } finally {
      setLoading(false)
    }
  }, [dailyReportUrl])

  useEffect(() => {
    fetchReport()
  }, [fetchReport])

  const generatedAt = useMemo(() => {
    if (!report?.generatedAt) return ''
    return new Date(report.generatedAt).toLocaleString(undefined, {
      dateStyle: 'long',
      timeStyle: 'short',
    })
  }, [report])

  const asOf = useMemo(() => {
    if (!report?.asOf) return 'Latest available'
    return new Date(report.asOf).toLocaleString(undefined, {
      dateStyle: 'long',
      timeStyle: 'short',
    })
  }, [report])

  const narrative = useMemo<NarrativeSections>(() => {
    if (!report) {
      return {
        fixedIncome: [],
        marketNotes: [],
        currency: [],
        equities: [],
      }
    }

    const aiNarrative = report.narrative
    if (aiNarrative) {
      return {
        fixedIncome: (aiNarrative.fixed_income ?? []).map((line) => String(line)),
        marketNotes: (aiNarrative.market_notes ?? []).map((line) => String(line)),
        currency: (aiNarrative.currency ?? []).map((line) => String(line)),
        equities: (aiNarrative.equities ?? []).map((line) => String(line)),
      }
    }

    return buildNarratives(report)
  }, [report])

  const handleDownload = useCallback(async () => {
    const node = reportRef.current
    if (!node) {
      setError('Nothing to download yet.')
      return
    }

    try {
      setDownloading(true)
      setError(null)

      const rect = node.getBoundingClientRect()
      const targetWidth = Math.ceil(
        Math.max(rect.width, node.scrollWidth, node.offsetWidth)
      )
      const targetHeight = Math.ceil(
        Math.max(rect.height, node.scrollHeight, node.offsetHeight)
      )

      const dataUrl = await toPng(node, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        width: targetWidth,
        height: targetHeight,
        canvasWidth: targetWidth,
        canvasHeight: targetHeight,
        style: {
          width: `${targetWidth}px`,
          height: `${targetHeight}px`,
        },
      })

      const link = document.createElement('a')
      link.href = dataUrl
      const stamp = new Date().toISOString().split('T')[0]
      link.download = `erad-daily-market-report-${stamp}.png`
      link.click()
    } catch (err) {
      console.error('Error exporting report:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to generate the downloadable image.'
      )
    } finally {
      setDownloading(false)
    }
  }, [])

  return (
    <section className='space-y-6'>
      <header className='flex items-center justify-between flex-wrap gap-3'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight text-foreground'>
            Daily Market Overview
          </h1>
          <p className='text-sm text-muted-foreground'>
            Downloadable recap of sovereign USD curves and benchmark yields.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            onClick={fetchReport}
            disabled={loading}
            className='gap-2'
          >
            <RefreshCw
              className={cn(
                'h-4 w-4',
                loading && 'animate-spin text-primary'
              )}
            />
            Refresh
          </Button>
          <Button
            onClick={handleDownload}
            disabled={loading || !report || downloading}
            className='gap-2'
          >
            <Download className='h-4 w-4' />
            {downloading ? 'Preparing...' : 'Download image'}
          </Button>
        </div>
      </header>

      {error && (
        <Card className='border-destructive/40 bg-destructive/10 text-destructive'>
          <CardContent className='space-y-3 py-6'>
            <h3 className='text-lg font-semibold'>Unable to load</h3>
            <p className='text-sm leading-6'>
              {error}. Confirm the daily report endpoint is reachable and try
              again.
            </p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card>
          <CardContent className='space-y-4 py-6'>
            <Skeleton className='h-6 w-1/3' />
            <Skeleton className='h-24 w-full' />
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-40 w-full' />
          </CardContent>
        </Card>
      )}

      {report && !loading && (
        <div className='flex justify-center'>
          <div
            ref={reportRef}
            className='inline-block w-full max-w-3xl overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-[0_25px_60px_rgba(4,34,89,0.16)]'
          >
            <header className='relative overflow-hidden bg-gradient-to-r from-[#005f9e] via-[#007bb8] to-[#1fa6d1] px-6 py-5 text-white'>
              <div className='absolute inset-0 opacity-20 mix-blend-soft-light'>
                <div className='absolute -left-10 top-0 h-40 w-40 rotate-12 rounded-full bg-white/30 blur-2xl' />
                <div className='absolute bottom-0 right-0 h-36 w-36 -rotate-12 rounded-full bg-white/20 blur-2xl' />
              </div>
              <div className='relative flex flex-col gap-1'>
              <div className='flex items-center gap-3'>
                <Image
                  src='/logo.png'
                  alt='ERAD Partners'
                  width={40}
                  height={40}
                  unoptimized
                  className='h-10 w-10 rounded-full border border-white/30 bg-white/10 object-contain p-1'
                />
                <div>
                  <p className='text-xs uppercase tracking-[0.35em] text-white/80'>
                    Erad Partners Limited
                  </p>
                  <h2 className='text-xl font-semibold tracking-wide uppercase'>
                    Fixed Income Daily Brief
                  </h2>
                </div>
              </div>
              <p className='mt-2 text-sm tracking-wide text-white/80'>
                Generated {generatedAt} &bull; Market data as of {asOf}
              </p>
            </div>
            </header>

            <div className='flex flex-col gap-4 px-6 py-6'>
              <SectionBlock
                title='Fixed Income and Money Market'
                accent='from-[#0a2f68] to-[#165a9f]'
                paragraphs={narrative.fixedIncome}
              />

              <SectionBlock
                title='Market Notes'
                accent='from-[#16446b] to-[#1f5e94]'
                paragraphs={narrative.marketNotes}
              />

              <SectionBlock
                title='Currency Market'
                accent='from-[#184969] to-[#20638c]'
                paragraphs={narrative.currency}
              />

              <SectionBlock
                title='Equities Market'
                accent='from-[#1a4f69] to-[#1d6d86]'
                paragraphs={narrative.equities}
              />

              <DetailTable bonds={report.bonds} />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function SectionBlock({
  title,
  accent,
  paragraphs,
}: {
  title: string
  accent: string
  paragraphs: string[]
}) {
  return (
    <article className='overflow-hidden rounded-lg border border-slate-200 shadow-sm'>
      <div
        className={cn(
          'bg-gradient-to-r px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white',
          accent
        )}
      >
        {title}
      </div>
      <div className='space-y-3 bg-slate-50/60 px-4 py-4 text-sm leading-6 text-slate-800'>
        {paragraphs.length
          ? paragraphs.map((line, idx) => (
              <p key={idx} className='text-[0.9rem]'>
                {line}
              </p>
            ))
          : (
              <p className='italic text-slate-500'>
                No commentary available for this section today.
              </p>
            )}
      </div>
    </article>
  )
}

function DetailTable({ bonds }: { bonds: BondEntry[] }) {
  return (
    <div className='rounded-lg border border-slate-200 bg-white p-4'>
      <h3 className='text-sm font-semibold uppercase tracking-wide text-slate-600'>
        Nigeria Eurobond Overview
      </h3>
      <div className='mt-3 overflow-x-auto'>
        <table className='w-full min-w-[560px] border-collapse text-xs'>
          <thead className='bg-slate-100 text-slate-600'>
            <tr>
              <th className='p-3 text-left font-semibold tracking-wide'>
                Bond
              </th>
              <th className='p-3 text-left font-semibold tracking-wide'>
                Yield (%)
              </th>
              <th className='p-3 text-left font-semibold tracking-wide'>
                Daily Change
              </th>
              <th className='p-3 text-left font-semibold tracking-wide'>
                Price
              </th>
              <th className='p-3 text-left font-semibold tracking-wide'>
                Notes / Source
              </th>
            </tr>
          </thead>
          <tbody>
            {bonds.map((bond) => {
              const isError = Boolean(bond.error)
              return (
                <tr
                  key={bond.symbol}
                  className={cn(
                    'border-b border-slate-200 last:border-0',
                    isError && 'bg-rose-50'
                  )}
                >
                  <td className='p-3 font-semibold text-slate-800'>
                    {bond.symbol}
                  </td>
                  <td className='p-3 text-slate-600'>
                    {formatNullableNumber(bond.yield, { suffix: '%' })}
                  </td>
                  <td
                    className={cn(
                      'p-3 font-semibold',
                      typeof bond.change === 'number'
                        ? bond.change >= 0
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                        : 'text-slate-500'
                    )}
                  >
                    {formatNullableNumber(bond.change)}
                  </td>
                  <td className='p-3 text-slate-600'>
                    {formatNullableNumber(bond.price)}
                  </td>
                  <td className='p-3 text-slate-600'>
                    {isError
                      ? `Data unavailable: ${bond.error}`
                      : bond.notes ||
                        bond.sources?.join(', ') ||
                        bond.source ||
                        'N/A'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function categorizeBond(symbol: string | undefined): CountryBucket {
  const name = symbol?.toUpperCase() ?? ''
  if (name.includes('US ')) return 'us'
  if (name.includes('NIGERIA')) return 'nigeria'
  if (name.includes('ANGOLA')) return 'angola'
  return 'other'
}

function formatNullableNumber(
  value: number | null | undefined,
  options?: { suffix?: string }
) {
  if (value === null || value === undefined) return 'N/A'
  const suffix = options?.suffix ?? ''
  return `${value.toFixed(2)}${suffix}`
}


function percentText(value: number | null | undefined) {
  if (value === null || value === undefined) return 'N/A'
  return `${value.toFixed(2)}%`
}

function changeText(change: number | null | undefined) {
  if (change === null || change === undefined) return 'flat on the day'
  const direction = change >= 0 ? 'higher' : 'lower'
  return `${Math.abs(change).toFixed(2)} bps ${direction}`
}

function average(numbers: Array<number | null | undefined>) {
  const filtered = numbers.filter((value): value is number => value !== null && value !== undefined)
  if (!filtered.length) return null
  const total = filtered.reduce((acc, val) => acc + val, 0)
  return total / filtered.length
}

function findTopMover(bonds: BondEntry[], bucket?: CountryBucket) {
  const scoped = bonds.filter((bond) => {
    if (typeof bond.change !== 'number') return false
    if (bucket) {
      return categorizeBond(bond.symbol) === bucket
    }
    return true
  })

  if (!scoped.length) return null
  return scoped.reduce((acc, bond) => {
    if (!acc) return bond
    const accAbs = Math.abs(acc.change ?? 0)
    const bondAbs = Math.abs(bond.change ?? 0)
    return bondAbs > accAbs ? bond : acc
  })
}

function buildNarratives(report: MarketReportData | null): NarrativeSections {
  if (!report) {
    return {
      fixedIncome: [],
      marketNotes: [],
      currency: [],
      equities: [],
    }
  }

  const { bonds, highlights } = report

  const groupMap: Record<CountryBucket, BondEntry[]> = {
    us: [],
    nigeria: [],
    angola: [],
    other: [],
  }

  bonds.forEach((bond) => {
    const bucket = categorizeBond(bond.symbol)
    groupMap[bucket].push(bond)
  })

  const nigeriaAverageYield = average(groupMap.nigeria.map((bond) => bond.yield))
  const angolaAverageYield = average(groupMap.angola.map((bond) => bond.yield))
  const usAverageYield = average(groupMap.us.map((bond) => bond.yield))

  const nigeriaTopMover = findTopMover(bonds, 'nigeria')
  const angolaTopMover = findTopMover(bonds, 'angola')
  const globalTopMover = highlights.topMover

  const fixedIncome = [
    report.overviewText ||
      'Bond market commentary is currently unavailable for today.',
    `Nigeria USD curve averaged ${percentText(
      nigeriaAverageYield
    )}, with ${nigeriaTopMover?.symbol ?? 'no notable security'} moving ${
      changeText(nigeriaTopMover?.change)
    }. Angolan paper priced around ${percentText(
      angolaAverageYield
    )}, while U.S. benchmarks printed ${percentText(usAverageYield)}.`,
    globalTopMover
      ? `${globalTopMover.symbol} marked the widest daily swing at ${changeText(
          globalTopMover.change
        )}, highlighting the prevailing tone across offshore EM sovereigns.`
      : 'Daily moves were muted across the benchmark basket.',
  ]

  const marketNotes = [
    `${highlights.positiveMoves} securities traded higher against ${
      highlights.negativeMoves
    } decliners. The blended average yield for the tracked basket stands at ${percentText(
      highlights.averageYield
    )}, signalling ${highlights.averageYield && highlights.averageYield > 10 ? 'ongoing elevated funding costs' : 'stable funding conditions'} for USD sovereign issuers.`,
    nigeriaTopMover
      ? `Nigeria curve was led by ${
          nigeriaTopMover.symbol
        }, closing ${changeText(
          nigeriaTopMover.change
        )} with latest prints near ${percentText(nigeriaTopMover.yield)}.`
      : 'Nigeria complex saw limited repricing on the session.',
    angolaTopMover
      ? `Angola complex tracked ${
          angolaTopMover.symbol
        }, finishing ${changeText(
          angolaTopMover.change
        )} as liquidity stayed concentrated on belly maturities.`
      : 'Angola curve finished broadly unchanged with modest flows.',
  ]

  const currency = [
    'FX market levels are not directly captured in this snapshot. For a consolidated view, combine this brief with your FX desk pricing feed.',
    'We recommend monitoring parallel market updates alongside the official NAFEM fixes to gauge liquidity spillovers into the USD sovereign curve.',
  ]

  const equities = [
    globalTopMover
      ? `${globalTopMover.symbol} price action underscored broader risk sentiment, with EM credit spreads responding to the ${changeText(
          globalTopMover.change
        )} swing.`
      : 'Equity read-through was limited as bond moves remained contained.',
    'Use this fixed income readout alongside NGX and global equity dashboards for a holistic cross-asset view.',
  ]

  return {
    fixedIncome,
    marketNotes,
    currency,
    equities,
  }
}
