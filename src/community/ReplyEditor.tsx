import axios from "axios";
import { useEffect, useState } from "react";
import { useReplyStore } from "../store/ReplyStore";
const BASE_URL = import.meta.env.VITE_BASE_URL;

interface ReplyEditorProps {
  status: string;
}
interface ReplyEditor {
  content: string;
  nickname: string;
  password: string;
  isFocusTextArea: boolean;
  isNicknameInvalid: boolean;
  isPasswordInvalid: boolean;
  isContentInvalid: boolean;
}

export default function ReplyEditor({ status }: ReplyEditorProps) {
  const { replyState } = useReplyStore();
  const [reply, setReply] = useState<ReplyEditor>({
    content: "",
    nickname: "",
    password: "",
    isFocusTextArea: false,
    isNicknameInvalid: false,
    isPasswordInvalid: false,
    isContentInvalid: false,
  });
  // 댓글 작성 로직
  const replyCreate = async () => {
    if (reply.nickname.length < 2) {
      setReply({ ...reply, isNicknameInvalid: true });
      return;
    }
    if (reply.password.length < 4) {
      setReply({ ...reply, isPasswordInvalid: true });
      return;
    }
    if (reply.content.length < 1) {
      setReply({ ...reply, isContentInvalid: true });
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/community/v1/${replyState.communityId}/${replyState.postId}/create`,
        {
          content: reply.content,
          nickname: reply.nickname,
          password: reply.password,
        },
      );
      if (response) {
        console.log(response);
        window.location.reload();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
      }
    }
  };

  // 댓글 수정 로직
  const replyUpdate = async () => {
    if (reply.nickname.length < 2) {
      setReply({ ...reply, isNicknameInvalid: true });
      return;
    }
    if (reply.content.length < 1) {
      setReply({ ...reply, isContentInvalid: true });
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/community/v1/${replyState.communityId}/${replyState.postId}/${replyState.replyId}/update`,
        {
          content: reply.content,
          nickname: reply.nickname,
          password: reply.password,
        },
      );
      if (response) {
        console.log(response);
        window.location.reload();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        if (error.response?.data.id === "COMMUNITY:PASSWORD_INVALID") {
          setReply({ ...reply, isPasswordInvalid: true });
        }
      }
    }
  };

  useEffect(() => {
    if (status === "update") {
      setReply({
        ...reply,
        nickname: replyState.nickname,
        content: replyState.content,
      });
    }
  }, []);
  return (
    <>
      {status === "create" ? (
        <>
          <div className="mx-2 rounded border-2 border-bgGray">
            <div className="flex border-b-2 border-bgGray">
              <input
                type="text"
                placeholder="닉네임"
                className="bg-transparent p-2 text-sm font-light text-white"
                onChange={(e) => {
                  setReply({
                    ...reply,
                    nickname: e.target.value,
                    isNicknameInvalid: false,
                  });
                }}
              />
              <input
                type="password"
                placeholder="비밀번호"
                className="bg-transparent p-2 text-sm font-light text-white"
                onChange={(e) => {
                  setReply({
                    ...reply,
                    password: e.target.value,
                    isPasswordInvalid: false,
                  });
                }}
              />
            </div>
            <textarea
              className="w-full resize-none overflow-hidden	bg-transparent p-2 text-white"
              onFocus={() => {
                setReply({ ...reply, isFocusTextArea: true });
              }}
              onChange={(e) => {
                setReply({
                  ...reply,
                  content: e.target.value,
                  isContentInvalid: false,
                });
              }}
              style={{ outline: "none" }}
            ></textarea>
            {reply.isFocusTextArea ? (
              <button
                className="justify-item-end mb-2 ml-auto mr-2 flex rounded border-2 border-bgGray p-1 px-6 font-extralight"
                onClick={() => {
                  replyCreate();
                }}
              >
                작성
              </button>
            ) : null}
          </div>
        </>
      ) : null}

      {status === "update" ? (
        <>
          <div className="mx-2 rounded border-2 border-bgGray">
            <div className="flex border-b-2 border-bgGray">
              <input
                type="text"
                defaultValue={replyState.nickname}
                placeholder="닉네임"
                className="bg-transparent p-2 text-sm font-light text-white"
                onChange={(e) => {
                  setReply({
                    ...reply,
                    nickname: e.target.value,
                    isNicknameInvalid: false,
                  });
                }}
              />
              <input
                type="password"
                placeholder="비밀번호"
                className="bg-transparent p-2 text-sm font-light text-white"
                onChange={(e) => {
                  setReply({
                    ...reply,
                    password: e.target.value,
                    isPasswordInvalid: false,
                  });
                }}
              />
            </div>
            <textarea
              defaultValue={replyState.content}
              className="w-full resize-none overflow-hidden	bg-transparent p-2 text-white"
              onFocus={() => {
                setReply({ ...reply, isFocusTextArea: true });
              }}
              onChange={(e) => {
                setReply({
                  ...reply,
                  content: e.target.value,
                  isContentInvalid: false,
                });
              }}
              style={{ outline: "none" }}
            ></textarea>
            {reply.isFocusTextArea ? (
              <button
                className="justify-item-end mb-2 ml-auto mr-2 flex rounded border-2 border-bgGray p-1 px-6 font-extralight"
                onClick={() => {
                  replyUpdate();
                }}
              >
                수정
              </button>
            ) : null}
          </div>
        </>
      ) : null}
      {reply.isNicknameInvalid ? (
        <div className="mx-auto mt-2 text-center text-sm text-red-500">
          닉네임은 2글자 이상 20글자 이하로 해주세요
        </div>
      ) : null}
      {reply.isPasswordInvalid ? (
        <div className="mx-auto mt-2 text-center text-sm text-red-500">
          비밀번호는 4자 이상으로 해주세요
        </div>
      ) : null}
      {reply.isPasswordInvalid ? (
        <div className="mx-auto mt-2 text-center text-sm text-red-500">
          비밀번호가 일치하지 않습니다.
        </div>
      ) : null}
      {reply.isContentInvalid ? (
        <div className="mx-auto mt-2 text-center text-sm text-red-500">
          내용이 비어있습니다
        </div>
      ) : null}
    </>
  );
}
