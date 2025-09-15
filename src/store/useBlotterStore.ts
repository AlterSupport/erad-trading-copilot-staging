import { create } from 'zustand';

interface BlotterState {
  files: File[]
  selectedFile: File | null
  addFile: (file: File) => void
  removeFile: (fileName: string) => void
  selectFile: (fileName: string) => void
}

const dummyFiles = [
  new File([''], 'blotter_Q3_2025.csv', { type: 'text/csv' }),
  new File([''], 'blotter_Q2_2025.csv', { type: 'text/csv' }),
]

export const useBlotterStore = create<BlotterState>()((set) => ({
  files: dummyFiles,
  selectedFile: dummyFiles[0] || null,
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  removeFile: (fileName) =>
    set((state) => ({
      files: state.files.filter((file) => file.name !== fileName),
    })),
  selectFile: (fileName) =>
    set((state) => ({
      selectedFile: state.files.find((file) => file.name === fileName) || null,
    })),
}))
