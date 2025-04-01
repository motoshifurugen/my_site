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
    // まずゲームを一時停止
    set({ status: "over" });

    // すべてのリセット処理を実行
    useMapStore.getState().reset();
    resetPlayerStore();

    // リセット完了後にゲームを開始
    requestAnimationFrame(() => {
      set({ status: "running", score: 0 });
    });
  },
}))

export default useStore;
