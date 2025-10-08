import { create } from 'zustand'

interface TradingInsight {
  symbol: string
  recommendation: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  summary: string
  yield_rate?: number
  final_sell_price?: number
  supporting_data: {
    price_data: any
    news: any[]
    sentiment: any
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

interface AnalysisResult {
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

interface BlotterState {
  files: File[]
  selectedFile: File | null
  isUploading: boolean
  analysisResults: Record<string, AnalysisResult>
  error: string | null
  progress: number
  addFile: (file: File) => void
  removeFile: (fileName: string) => void
  selectFile: (fileName: string) => void
  setAnalysisResult: (fileName: string, result: AnalysisResult) => void
  setError: (error: string | null) => void
  setIsUploading: (isUploading: boolean) => void
  setProgress: (progress: number) => void
}

export const useBlotterStore = create<BlotterState>()((set) => ({
  files: [],
  selectedFile: null,
  isUploading: false,
  analysisResults: {},
  error: null,
  progress: 0,
  addFile: (file) =>
    set((state) => ({
      files: [...state.files, file],
      selectedFile: file,
    })),
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
      selectedFile: state.files.find((file) => file.name === fileName) || null,
    })),
  setAnalysisResult: (fileName, result) =>
    set((state) => ({
      analysisResults: {
        ...state.analysisResults,
        [fileName]: result,
      },
      error: null,
    })),
  setError: (error) => set({ error: error }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setProgress: (progress) => set({ progress }),
}))
