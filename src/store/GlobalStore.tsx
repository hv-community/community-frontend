import { create } from "zustand";

interface GlobalStore {
  globalState: GlobalState;
  setGlobalState: (state: Partial<GlobalState>) => void;
  resetGlobalState: () => void;
  clearErrorMessage: () => void;
}

interface GlobalState {
  modalMessage: string;
  redirectName: string;
  redirectUrl: string;
  errorMessage: string;
  loading: boolean;
}

const initialGlobalState: GlobalState = {
  modalMessage: "",
  redirectName: "",
  redirectUrl: "",
  errorMessage: "",
  loading: true,
};

export const useGlobalStore = create<GlobalStore>((set) => ({
  globalState: {
    modalMessage: "",
    redirectName: "",
    redirectUrl: "",
    errorMessage: "",
    loading: true,
  },
  setGlobalState: (state) =>
    set((prev) => ({ globalState: { ...prev.globalState, ...state } })),
  resetGlobalState: () => set({ globalState: initialGlobalState }),
  clearErrorMessage: () =>
    set((prev) => ({ globalState: { ...prev.globalState, errorMessage: "" } })),
}));
