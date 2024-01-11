import { create } from "zustand";
interface TokenStore {
  tokenState: TokenState;
  setTokenState: (state: Partial<TokenState>) => void;
}
interface TokenState {
  accessToken: string;
  refreshToken: string;
}

export const useTokenStore = create<TokenStore>((set) => ({
  tokenState: {
    accessToken: "",
    refreshToken: "",
  },
  setTokenState: (state) =>
    set((prev) => ({ tokenState: { ...prev.tokenState, ...state } })),
}));
