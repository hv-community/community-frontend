import axios from "axios";
import { useEffect, useState } from "react";
import { useReplyStore } from "../store/ReplyStore";
import { useNavigate } from "react-router-dom";
import ReplyEditor from "./ReplyEditor";
import PasswordCheck from "./PasswordCheck";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ReplyList() {
  const { replyState } = useReplyStore();
  const [replyList, setReplyList] = useState<ReplyList>({
    items: [],
    page: 0,
    page_size: 0,
    total_page: 0,
    prev: 0,
    next: 0,
  });

  const fetchReply = async () => {
    try {
      // TODO
      // 우선 기본값 사용
      // paging구현필요
      const page = 1;
      const page_size = 10;
      const response = await axios.get(
        `${BASE_URL}/community/v1/${replyState.communityId}/${replyState.postId}/reply?page=${page}&page_size=${page_size}`,
      );
      if (response) {
        setReplyList({
          ...replyList,
          items: response.data.items,
          page: response.data.page,
          page_size: response.data.page_size,
          total_page: response.data.total_page,
          prev: response.data.prev,
          next: response.data.next,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchReply();
  }, []);

  return (
    <>
      {replyList.items.map((reply, index) => (
        <Reply key={index} reply={reply} />
      ))}

      <ReplyEditor status="create" />
    </>
  );
}

interface ReplyProps {
  reply: Reply;
}
const Reply = ({ reply }: ReplyProps) => {
  const navigate = useNavigate();
  const { replyState, setReplyState, resetReplyState } = useReplyStore();
  const handleEditButton = () => {
    if (replyState.status === "update" && replyState.replyId === reply.id) {
      resetReplyState();
    } else {
      setReplyState({
        ...replyState,
        replyId: reply.id,
        nickname: reply.nickname,
        content: reply.content,
        status: "update",
      });
    }
  };

  return (
    <>
      <div className="mx-2 my-3 border-2 border-bgGray text-sm font-extralight">
        <div className="flex bg-bgGray px-2 py-1">
          <div>{reply.nickname}</div>
          <div className="ml-auto flex items-center text-xs">
            <div>{formatTime(reply.creation_time)}</div>
            <div className="mx-2">|</div>
            <button
              onClick={() => {
                setReplyState({
                  ...replyState,
                  replyId: reply.id,
                  content: reply.content,
                  status: "delete",
                });
                navigate(
                  `/community/${replyState.communityId}/${replyState.postId}/check`,
                );
              }}
            >
              삭제
            </button>
            <div className="mx-2">|</div>
            <button
              onClick={() => {
                handleEditButton();
              }}
            >
              수정
            </button>
          </div>
        </div>
        {reply.creation_time === reply.modification_time ? (
          <>
            <div className="p-2 text-white">{reply.content}</div>
          </>
        ) : (
          <>
            <div className="p-2 text-white">
              <span className="mr-1 text-xs">*수정됨</span>
              {reply.content}
            </div>
          </>
        )}
      </div>
      {replyState.status === "update" && reply.id === replyState.replyId ? (
        <>
          <ReplyEditor status="update" />
        </>
      ) : null}
      {replyState.status === "delete" && reply.id === replyState.replyId ? (
        <PasswordCheck />
      ) : null}
    </>
  );
};

const formatTime = (time: Date) => {
  const formattedTime = new Date(time)
    .toISOString()
    .replace("T", " ")
    .slice(0, -5);
  return `${formattedTime}`;
};
