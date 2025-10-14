import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PriceData {
  date: string
  price: number
}

interface NewsArticle {
  title: string
  url: string
  source: string
  published_at: string
}

interface Sentiment {
  score: number
  label: 'positive' | 'negative' | 'neutral'
}

interface TradingInsight {
  symbol: string
  recommendation: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  summary: string
  yield_rate?: number
  final_sell_price?: number
  supporting_data: {
    price_data: PriceData[]
    news: NewsArticle[]
    sentiment: Sentiment
  }
}

interface TradingStyle {
  patterns: {
    title: string
    type: 'strength' | 'weakness'
    description: string
    frequency: number
    suggestion: string
  }[]
  opportunities: {
    symbol: string
    action: 'buy' | 'sell'
    expiry_date: string
    profit_potential: number
    profit_percentage: number
    executed_price?: number
    optimal_price: number
    optimal_timing: string
    reason: string
  }[]
}

export interface AnalysisResult {
  portfolio_summary: {
    total_trades: number
    buy_trades: number
    sell_trades: number
    total_volume: number
    positions: Record<string, number>
    pnl: number
    profit_margin: number
    trade_performance: {
      date: string
      pnl: number
    }[]
  }
  trading_insights: TradingInsight[]
  key_risks: {
    title: string
    description: string
  }[]
  ai_observations: {
    title: string
    priority: string
    description: string
    expected_impact: string
  }[]
  trading_style: TradingStyle
}

export interface BlotterFile {
  name: string
  size: number
  source: 'local' | 'cloud'
  uploadedAt?: string
}

interface BlotterState {
  files: BlotterFile[]
  selectedFile: BlotterFile | null
  isUploading: boolean
  analysisResults: Record<string, AnalysisResult>
  error: string | null
  progress: number
  hasHydratedFromCloud: boolean
  addFile: (file: File | BlotterFile) => void
  removeFile: (fileName: string) => void
  selectFile: (fileName: string) => void
  setAnalysisResult: (fileName: string, result: AnalysisResult) => void
  setError: (error: string | null) => void
  setIsUploading: (isUploading: boolean) => void
  setProgress: (progress: number) => void
  hydrateFromCloud: (payload: {
    fileName: string
    result: AnalysisResult
    fileSize?: number
    uploadedAt?: string
  }) => void
  markFileSynced: (fileName: string, uploadedAt?: string) => void
  markCloudHydrated: () => void
  reset: () => void
}

const createInitialState = () => ({
  files: [] as BlotterFile[],
  selectedFile: null,
  isUploading: false,
  analysisResults: {} as Record<string, AnalysisResult>,
  error: null as string | null,
  progress: 0,
  hasHydratedFromCloud: false,
})

export const useBlotterStore = create<BlotterState>()(
  persist(
    (set) => ({
      ...createInitialState(),
      addFile: (file) => {
        const fileMeta: BlotterFile =
          'source' in file
            ? file
            : {
                name: file.name,
                size: file.size,
                source: 'local',
              }
        set((state) => {
          const existing = state.files.filter((item) => item.name !== fileMeta.name)
          return {
            files: [...existing, fileMeta],
            selectedFile: fileMeta,
          }
        })
      },
      removeFile: (fileName) =>
        set((state) => {
          const newFiles = state.files.filter((file) => file.name !== fileName)
          const newAnalysisResults = { ...state.analysisResults }
          delete newAnalysisResults[fileName]
          return {
            files: newFiles,
            analysisResults: newAnalysisResults,
            selectedFile:
              state.selectedFile?.name === fileName ? null : state.selectedFile,
          }
        }),
      selectFile: (fileName) =>
        set((state) => ({
          selectedFile:
            state.files.find((file) => file.name === fileName) || null,
        })),
      setAnalysisResult: (fileName, result) =>
        set((state) => ({
          analysisResults: {
            ...state.analysisResults,
            [fileName]: result,
          },
          error: null,
        })),
      setError: (error: string | null) => set({ error: error }),
      setIsUploading: (isUploading) => set({ isUploading }),
      setProgress: (progress) => set({ progress }),
      hydrateFromCloud: ({ fileName, result, fileSize, uploadedAt }) =>
        set((state) => {
          const fileMeta: BlotterFile = {
            name: fileName,
            size: fileSize ?? 0,
            source: 'cloud',
            uploadedAt,
          }
          const files = [
            ...state.files.filter((file) => file.name !== fileName),
            fileMeta,
          ]
          return {
            files,
            selectedFile: fileMeta,
            analysisResults: {
              ...state.analysisResults,
              [fileName]: result,
            },
            error: null,
            hasHydratedFromCloud: true,
          }
        }),
      markFileSynced: (fileName, uploadedAt) =>
        set((state) => {
          const files = state.files.map((file) =>
            file.name === fileName
              ? { ...file, source: 'cloud', uploadedAt }
              : file,
          )
          const selectedFile =
            state.selectedFile?.name === fileName
              ? files.find((file) => file.name === fileName) || state.selectedFile
              : state.selectedFile
          return {
            files,
            selectedFile,
          }
        }),
      markCloudHydrated: () => set({ hasHydratedFromCloud: true }),
      reset: () => set(() => createInitialState()),
    }),
    {
      name: 'blotter-storage',
    },
  ),
)
