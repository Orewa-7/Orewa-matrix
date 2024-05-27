import { create } from "zustand";

export default create((set) => ({
  isLoaderComplete: false,
  setIsLoaderComplete: () =>
    set((state) => ({ isLoaderComplete: !state.isLoaderComplete })),

  isLoaderVisible: true,
  setIsLoaderVisible: () =>
    set((state) => ({ isLoaderVisible: !state.isLoaderVisible })),
}));
