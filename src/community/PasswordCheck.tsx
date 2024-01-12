import axios from "axios";
import { useState } from "react";
import { usePostStore } from "../store/PostStore";
import { useReplyStore } from "../store/ReplyStore";
import { useGlobalStore } from "../store/GlobalStore";
import SuccessModal from "../component/SuccessModal";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function PasswordCheck() {
  const { postState, setPostState } = usePostStore();
  const { replyState } = useReplyStore();
  const { globalState, setGlobalState } = useGlobalStore();
  const [password, setPassword] = useState<string>("");
  const [isPasswordInvalid, setIsPasswordInvalid] = useState<boolean>(false);
  // 게시글 업데이트 전 비밀번호 체크
  const navigate = useNavigate();
  const handleCheck = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/community/v1/${postState.communityId}/${postState.postId}/check?password=${password}`,
      );
      if (response) {
        console.log(response);
        // 비밀번호 통과시 postEditor로 이동
        setPostState({ ...postState, password: password });
        navigate(
          `/community/${postState.communityId}/${postState.postId}/editor`,
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        setIsPasswordInvalid(true);
      }
    }
  };
  // 게시글, 댓글 삭제 전 비밀번호 체크
  const handleDelete = async () => {
    // 댓글 삭제요청일때
    if (replyState.replyId) {
      try {
        const response = await axios.delete(
          `${BASE_URL}/community/v1/${postState.communityId}/${postState.postId}/${replyState.replyId}/delete?password=${password}`,
        );
        if (response) {
          console.log(response);
          setGlobalState({
            ...globalState,
            modalMessage: "댓글이 삭제되었습니다",
            redirectName: "게시글로",
            redirectUrl: `/community/${replyState.communityId}/${replyState.postId}`,
          });
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error);
          setIsPasswordInvalid(true);
        }
      }
    } else {
      // 게시글 삭제요청일때
      try {
        const response = await axios.delete(
          `${BASE_URL}/community/v1/${postState.communityId}/${postState.postId}/delete?password=${password}`,
        );
        if (response) {
          console.log(response);
          setGlobalState({
            ...globalState,
            modalMessage: "게시글이 삭제되었습니다",
            redirectName: "게시판으로",
            redirectUrl: `/community/${postState.communityId}`,
          });
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error);
          setIsPasswordInvalid(true);
        }
      }
    }
  };

  return (
    <>
      {/* 게시글 업데이트 전 비밀번호 체크 */}
      {postState.status === "update" ? (
        <>
          <div className="m-2 rounded bg-bgGray p-4 font-light text-white">
            <div className="mb-2 text-xl font-semibold">게시물 수정</div>

            <>
              <div className="mb-6 text-gray-400">{postState.title}</div>
              <div className="mb-4">비밀번호를 입력해주세요</div>
            </>

            <div className="mb-4 flex items-center">
              <div className="mx-4 mr-8">비밀번호</div>
              <input
                type="password"
                className="w-2/3 border-2 border-bgGray bg-black p-1"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setIsPasswordInvalid(false);
                }}
              />
            </div>

            {isPasswordInvalid ? (
              <div className="mx-auto mt-2 text-center text-sm text-red-500">
                비밀번호가 일치하지 않습니다.
              </div>
            ) : null}

            <>
              <button
                className="ml-auto mr-6 flex w-fit bg-blue-600 p-2 px-3 text-white"
                onClick={() => {
                  handleCheck();
                }}
              >
                확인
              </button>
            </>
          </div>
        </>
      ) : null}

      {/* 게시글, 댓글 삭제 전 비밀번호 체크 */}
      {postState.status === "delete" || replyState.status === "delete" ? (
        <div className="m-2 rounded bg-bgGray p-4 font-light text-white">
          {/* title값이 있을때 == post삭제요청일때 */}
          {postState.title ? (
            <>
              <div className="mb-2 text-xl font-semibold">게시물 삭제</div>
              <div className="mb-6 text-gray-400">{postState.title}</div>
              <div className="mb-4">삭제된 글은 복구할 수 없습니다.</div>
            </>
          ) : (
            <>
              <div className="mb-2 text-xl font-semibold">댓글 삭제</div>
              <div className="mb-4">비밀번호를 입력해주세요</div>
            </>
          )}

          <div className="mb-4 flex items-center">
            <div className="mx-4 mr-8">비밀번호</div>
            <input
              type="password"
              className="w-2/3 border-2 border-bgGray bg-black p-1"
              onChange={(e) => {
                setPassword(e.target.value);
                setIsPasswordInvalid(false);
              }}
            />
          </div>

          {isPasswordInvalid ? (
            <div className="mx-auto mt-2 text-center text-sm text-red-500">
              비밀번호가 일치하지 않습니다.
            </div>
          ) : null}

          <>
            <button
              className="ml-auto mr-6 flex w-fit bg-red-600 p-2 px-3 text-white"
              onClick={() => {
                handleDelete();
              }}
            >
              삭제
            </button>
          </>
        </div>
      ) : null}

      {/* 삭제시 모달창 */}
      {globalState.modalMessage && <SuccessModal />}
    </>
  );
}
