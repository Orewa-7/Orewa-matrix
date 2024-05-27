import { create } from "zustand";

export default create((set) => ({
  isGameOver: false,
  setGameOver: (isGameOver) => set({ isGameOver }),

  isRestart: false,
  setRestart: (isRestart) => set({ isRestart }),

  soundOn: true,
  setSoundOn: (soundOn) => set({ soundOn }),
}));
