import { create } from 'zustand';

interface BlotterState {
  files: File[];
  addFile: (file: File) => void;
  removeFile: (fileName: string) => void;
}

export const useBlotterStore = create<BlotterState>()((set) => ({
  files: [],
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  removeFile: (fileName) =>
    set((state) => ({
      files: state.files.filter((file) => file.name !== fileName),
    })),
}));
