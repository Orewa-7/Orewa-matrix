import { create } from "zustand";

export default create((set) => ({
  weapons: ["sniper", "rifle", "pistol"],
  indexWeapon: 0,
  weapon: "sniper", // Initialize with the first weapon
  setWeapon: (index) =>
    set((state) => ({
      indexWeapon: index,
      weapon: state.weapons[index], // Update the weapon based on index
    })),
  addIndexWeapon: () =>
    set((state) => {
      if (state.isWeaponChanging) return { weapon: state.weapon };
      const newIndex = (state.indexWeapon + 1) % state.weapons.length;
      return {
        indexWeapon: newIndex,
        weapon: state.weapons[newIndex],
      };
    }),
  decreaseIndexWeapon: () =>
    set((state) => {
      if (state.isWeaponChanging) return { weapon: state.weapon };
      const newIndex =
        (state.indexWeapon - 1 + state.weapons.length) % state.weapons.length;
      return {
        indexWeapon: newIndex,
        weapon: state.weapons[newIndex],
      };
    }),
  isWeaponChanging: false,
  setWeaponChanging: (value) => set({ isWeaponChanging: value }),
}));
