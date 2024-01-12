import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePostStore } from "../store/PostStore";
const BASE_URL = import.meta.env.VITE_BASE_URL;

interface PostEditor {
  isFocusTextEditor: boolean;
  title: string;
  content: string;
  nickname: string;
  password: string;
  isTitleInvalid: boolean;
  isNicknameInvalid: boolean;
  isPasswordInvalid: boolean;
  isContentInvalid: boolean;
}

export default function PostEditor() {
  const { communityId, postId } = useParams();

  const { postState, resetPostState } = usePostStore();
  const [post, setPost] = useState<PostEditor>({
    isFocusTextEditor: false,
    title: "",
    content: "",
    nickname: "",
    password: "",
    isTitleInvalid: false,
    isNicknameInvalid: false,
    isPasswordInvalid: false,
    isContentInvalid: false,
  });
  const initailPost = {
    isFocusTextEditor: false,
    title: "",
    content: "",
    nickname: "",
    password: "",
    isTitleInvalid: false,
    isNicknameInvalid: false,
    isPasswordInvalid: false,
    isContentInvalid: false,
  };
  const navigate = useNavigate();
  // 글 쓰기 로직
  const postCreate = async () => {
    if (post.title.length < 1) {
      setPost({ ...post, isTitleInvalid: true });
      return;
    }
    if (post.nickname.length < 2) {
      setPost({ ...post, isNicknameInvalid: true });
      return;
    }
    if (post.password.length < 4) {
      setPost({ ...post, isPasswordInvalid: true });
      return;
    }
    if (post.content.length < 1) {
      setPost({ ...post, isContentInvalid: true });
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/community/v1/${communityId}/create`,
        {
          title: post.title,
          content: post.content,
          nickname: post.nickname,
          password: post.password,
        },
      );
      if (response) {
        console.log(response);
        navigate(`/community/${communityId}`);
        setPost({ ...initailPost });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
      }
    }
  };

  // 글 수정 로직
  useEffect(() => {
    if (postState.status === "update" && postState.postId === postId) {
      setPost({
        ...post,
        title: postState.title,
        content: postState.content,
        password: postState.password,
      });
    } else {
      resetPostState();
    }
  }, []);
  const postUpdate = async () => {
    if (post.title.length < 1) {
      setPost({ ...post, isTitleInvalid: true });
      return;
    }
    if (post.password.length < 4) {
      setPost({ ...post, isPasswordInvalid: true });
      return;
    }
    if (post.content.length < 1) {
      setPost({ ...post, isContentInvalid: true });
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/community/v1/${communityId}/${postId}/update`,
        {
          title: post.title,
          content: post.content,
          password: post.password,
        },
      );
      if (response) {
        console.log(response);
        navigate(`/community/${communityId}/${postId}`);
        setPost({ ...initailPost });
        resetPostState();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
      }
    }
  };
  return (
    <>
      {/* 글쓰기 */}
      {postState.status === "create" ? (
        <>
          <div className="h-screen pb-60 text-white">
            <div className="border-b-2 border-bgGray"></div>
            <div className="ml-2 p-2 text-lg font-extralight">글쓰기</div>
            <div className="mb-2 border-b-2 border-bgGray"></div>

            <div className="mx-2 flex border-2 border-bgGray text-center">
              <div className="bg-bgGray p-1 px-2 text-sm font-light">제목</div>
              <input
                type="text"
                className="w-fit grow bg-black px-2"
                onChange={(e) => {
                  setPost({
                    ...post,
                    title: e.target.value,
                    isTitleInvalid: false,
                  });
                }}
              />
            </div>

            <div className="mx-auto mb-2 w-full p-2 text-center">
              <div className="flex border-2 border-bgGray">
                <div className="flex w-1/2">
                  <div className="h-fit w-12 bg-bgGray p-1 px-2 text-sm font-light">
                    이름
                  </div>
                  <input
                    type="text"
                    className="w-full bg-black px-2"
                    onChange={(e) => {
                      setPost({
                        ...post,
                        nickname: e.target.value,
                        isNicknameInvalid: false,
                      });
                    }}
                  />
                </div>
                <div className="flex w-1/2">
                  <div className="w-1/2 bg-bgGray p-1 px-2 text-sm font-light">
                    비밀번호
                  </div>
                  <input
                    type="password"
                    className="w-full bg-black px-2"
                    onChange={(e) => {
                      setPost({
                        ...post,
                        password: e.target.value,
                        isPasswordInvalid: false,
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="relative mb-4 h-full">
              <div
                contentEditable={true}
                className="mx-2 mb-4 h-full rounded bg-white p-4 text-black"
                onClick={() => {
                  setPost({ ...post, isFocusTextEditor: true });
                }}
                onBlur={() => {
                  setPost({ ...post, isFocusTextEditor: false });
                }}
                onInput={(e) => {
                  setPost({
                    ...post,
                    content: e.currentTarget.textContent || "",
                    isContentInvalid: false,
                  });
                }}
              ></div>
              {post.isFocusTextEditor ? null : (
                <>
                  {post.content ? null : (
                    <div className="absolute left-6 top-4 text-gray-600">
                      내용을 입력해주세요
                    </div>
                  )}
                </>
              )}
            </div>
            {post.isTitleInvalid ? (
              <div className="mx-auto mt-2 text-center text-sm text-red-500">
                제목이 비어있습니다
              </div>
            ) : null}
            {post.isNicknameInvalid ? (
              <div className="mx-auto mt-2 text-center text-sm text-red-500">
                닉네임은 2글자 이상 20글자 이하로 해주세요
              </div>
            ) : null}
            {post.isPasswordInvalid ? (
              <div className="mx-auto mt-2 text-center text-sm text-red-500">
                비밀번호는 4자 이상으로 해주세요
              </div>
            ) : null}
            {post.isContentInvalid ? (
              <div className="mx-auto mt-2 text-center text-sm text-red-500">
                내용이 비어있습니다
              </div>
            ) : null}
            <button
              className="justify-item-end mb-2 ml-auto mr-2 flex rounded border-2 border-bgGray p-1 px-4 font-extralight"
              onClick={() => {
                postCreate();
              }}
            >
              작성
            </button>
          </div>
        </>
      ) : null}

      {/* 글수정 */}
      {postState.status === "update" ? (
        <>
          <div className="h-screen pb-60 text-white">
            <div className="border-b-2 border-bgGray"></div>
            <div className="ml-2 p-2 text-lg font-extralight">글 수정</div>
            <div className="mb-2 border-b-2 border-bgGray"></div>

            <div className="mx-2 flex border-2 border-bgGray text-center">
              <div className="bg-bgGray p-1 px-2 text-sm font-light">제목</div>
              <input
                type="text"
                className="w-fit grow bg-black px-2"
                defaultValue={postState.title}
                onChange={(e) => {
                  setPost({
                    ...post,
                    title: e.target.value,
                    isTitleInvalid: false,
                  });
                }}
              />
            </div>

            <div className="mx-auto mb-2 w-full p-2 text-center">
              <div className="flex border-2 border-bgGray">
                <div className="flex w-1/2">
                  <div className="w-1/2 bg-bgGray p-1 px-2 text-sm font-light">
                    비밀번호
                  </div>
                  <input
                    type="password"
                    className="w-full bg-black px-2"
                    defaultValue={postState.password}
                    onChange={(e) => {
                      setPost({
                        ...post,
                        password: e.target.value,
                        isPasswordInvalid: false,
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="relative mx-2 mb-4 h-full">
              <textarea
                className="mb-4 h-full w-full rounded bg-white p-4 text-black"
                onClick={() => {
                  setPost({ ...post, isFocusTextEditor: true });
                }}
                onBlur={() => {
                  setPost({ ...post, isFocusTextEditor: false });
                }}
                onInput={(e) => {
                  setPost({
                    ...post,
                    content: e.currentTarget.value || "",
                    isContentInvalid: false,
                  });
                }}
                defaultValue={postState.content}
                placeholder="내용을 입력해주세요"
              ></textarea>
            </div>

            {post.isTitleInvalid ? (
              <div className="mx-auto mt-2 text-center text-sm text-red-500">
                제목이 비어있습니다
              </div>
            ) : null}
            {post.isPasswordInvalid ? (
              <div className="mx-auto mt-2 text-center text-sm text-red-500">
                비밀번호는 4자 이상으로 해주세요
              </div>
            ) : null}
            {post.isContentInvalid ? (
              <div className="mx-auto mt-2 text-center text-sm text-red-500">
                내용이 비어있습니다
              </div>
            ) : null}
            <button
              className="justify-item-end mb-2 ml-auto mr-2 flex rounded border-2 border-bgGray p-1 px-4 font-extralight"
              onClick={() => {
                postUpdate();
              }}
            >
              수정
            </button>
          </div>
        </>
      ) : null}
    </>
  );
}
