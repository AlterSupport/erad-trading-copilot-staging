import { db } from '@/lib/firebase'
import { AnalysisResult } from '@/store/useBlotterStore'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const COLLECTION_PATH = (userId: string) => ['users', userId, 'blotterAnalyses', 'latest'] as const

export interface StoredBlotterAnalysis {
  fileName: string
  analysis: AnalysisResult
  fileSize?: number
  uploadedAt?: string
}

export async function fetchLatestBlotterAnalysis(
  userId: string,
): Promise<StoredBlotterAnalysis | null> {
  if (!userId) return null

  try {
    const docRef = doc(db, ...COLLECTION_PATH(userId))
    const snapshot = await getDoc(docRef)

    if (!snapshot.exists()) {
      return null
    }

    const data = snapshot.data() as StoredBlotterAnalysis
    if (!data?.analysis || !data?.fileName) {
      return null
    }

    return {
      fileName: data.fileName,
      analysis: data.analysis,
      fileSize: data.fileSize ?? 0,
      uploadedAt: data.uploadedAt,
    }
  } catch (error) {
    console.error('Failed to fetch blotter analysis from Firestore:', error)
    return null
  }
}

export async function saveLatestBlotterAnalysis(
  userId: string,
  payload: StoredBlotterAnalysis,
): Promise<void> {
  if (!userId) return

  try {
    const docRef = doc(db, ...COLLECTION_PATH(userId))
    await setDoc(docRef, {
      ...payload,
      uploadedAt: payload.uploadedAt ?? new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to save blotter analysis to Firestore:', error)
    throw error
  }
}
