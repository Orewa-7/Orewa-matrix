import { create } from "zustand";

export default create((set) => ({
  points: 0,
  addPoints: (points) => set((state) => ({ points: state.points + points })),
  removePoints: (points) =>
    set((state) => ({ points: Math.max(0, state.points - points) })),

  score: 0,
  setScore: (score) => set({ score }),
}));
