import { create } from "zustand";
interface MemberStore {
  memberState: MemberState;
  setMemberState: (state: Partial<MemberState>) => void;
}
interface MemberState {
  name: string;
  email: string;
  nickname: string;
  password: string;
  confirmPassword: string;
  token: string;
}

export const useMemberStore = create<MemberStore>((set) => ({
  memberState: {
    name: "",
    email: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    token: "",
  },
  setMemberState: (state) =>
    set((prev) => ({ memberState: { ...prev.memberState, ...state } })),
}));
