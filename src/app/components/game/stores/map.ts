import { create } from "zustand";
import { generateRows } from "../utilities/generateRows";
import type { Row } from "@/types/game-objects";

interface StoreState {
  rows: Row[];
  addRows: () => void;
}

const useStore = create<StoreState>((set) => ({
  rows: generateRows(20),
  addRows: () => {
    const newRows = generateRows(20);
    set((state) => ({ rows: [...state.rows, ...newRows] }));
  },
}));

export default useStore;
