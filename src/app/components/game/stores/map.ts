import type { Row } from '@/types/game-objects'
import { create } from 'zustand'
import { generateRows } from '../utilities/generateRows'

interface StoreState {
  rows: Row[]
  addRows: () => void
  reset: () => void
}

const useStore = create<StoreState>((set) => ({
  rows: generateRows(20),
  addRows: () => {
    const newRows = generateRows(20)
    set((state) => ({ rows: [...state.rows, ...newRows] }))
  },
  reset: () => set({ rows: generateRows(20) }),
}))

export default useStore
