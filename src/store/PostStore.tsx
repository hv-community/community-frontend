import { create } from "zustand";

interface PostStore {
  postState: PostState;
  setPostState: (state: Partial<PostState>) => void;
  resetPostState: () => void;
}

interface PostState {
  communityId: string | undefined;
  postId: string | undefined;
  status: string;
  title: string;
  nickname: string;
  password: string;
  content: string;
}

export const usePostStore = create<PostStore>((set) => ({
  postState: {
    communityId: "",
    postId: "",
    status: "create",
    title: "",
    nickname: "",
    password: "",
    content: "",
  },
  setPostState: (state) =>
    set((prev) => ({ postState: { ...prev.postState, ...state } })),
  resetPostState: () =>
    set({
      postState: {
        communityId: "",
        postId: "",
        status: "create",
        title: "",
        nickname: "",
        password: "",
        content: "",
      },
    }),
}));
