import { create } from 'zustand'
import useMapStore from '@/app/components/game/stores/map'
import { reset as resetPlayerStore } from '@/app/components/game/stores/player'

interface StoreState {
  status: "running" | "over";
  score: number
  updateScore: (rowIndex: number) => void
  endGame: () => void
  reset: () => void
}

const useStore = create<StoreState>((set) => ({
  status: "running",
  score: 0,
  updateScore: (rowIndex: number) => {
    set((state) => ({ score: Math.max(rowIndex, state.score) }));
  },
  endGame: () => {
    set({ status: "over" });
  },
  reset: () => {
    useMapStore.getState().reset();
    resetPlayerStore();
    set({ status: "running", score: 0 });
  },
}))

export default useStore;
