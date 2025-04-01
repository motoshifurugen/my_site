import { create } from 'zustand'

interface StoreState {
  score: number
  updateScore: (rowIndex: number) => void
}

const useStore = create<StoreState>((set) => ({
  score: 0,
  updateScore: (rowIndex: number) => {
    set((state) => ({ score: Math.max(rowIndex, state.score) }));
  },
}))

export default useStore;
