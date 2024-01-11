import { create } from "zustand";

interface CommunityStore {
  communityState: CommunityState;
  setCommunityState: (state: Partial<CommunityState>) => void;
}
interface CommunityState {
  prev: number;
  next: number;
  totalPage: number;
  page: number;
  pageSize: number;
}

export const useCommunityStore = create<CommunityStore>((set) => ({
  communityState: {
    prev: 0,
    next: 0,
    totalPage: 0,
    page: 0,
    pageSize: 0,
  },
  setCommunityState: (state) =>
    set((prev) => ({ communityState: { ...prev.communityState, ...state } })),
}));

//
interface PostStore {
  postState: PostState;
  setPostState: (state: Partial<PostState>) => void;
}
interface PostState {
  prev: number;
  next: number;
  totalPage: number;
  page: number;
  pageSize: number;
}

export const usePostStore = create<PostStore>((set) => ({
  postState: {
    prev: 0,
    next: 0,
    totalPage: 0,
    page: 0,
    pageSize: 0,
  },
  setPostState: (state) =>
    set((prev) => ({ postState: { ...prev.postState, ...state } })),
}));

//
interface ReplyStore {
  replyState: ReplyState;
  setReplyState: (state: Partial<ReplyState>) => void;
}
interface ReplyState {
  prev: number;
  next: number;
  totalPage: number;
  page: number;
  pageSize: number;
}
export const useReplyStore = create<ReplyStore>((set) => ({
  replyState: {
    prev: 0,
    next: 0,
    totalPage: 0,
    page: 0,
    pageSize: 0,
  },
  setReplyState: (state) =>
    set((prev) => ({ replyState: { ...prev.replyState, ...state } })),
}));
