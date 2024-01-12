import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import PasswordCheck from "./PasswordCheck";
import { usePostStore } from "../store/PostStore";
import PostList from "./PostList";
import { useReplyStore } from "../store/ReplyStore";
import ReplyList from "./ReplyList";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Post() {
  const { communityId, postId } = useParams();
  const { postState, setPostState } = usePostStore();
  const { replyState, setReplyState } = useReplyStore();

  const [post, setPost] = useState<Post | null>(null);
  const fetchpost = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/community/v1/${communityId}/${postId}`,
      );
      if (response) {
        setPost(response.data);
        setPostState({
          ...postState,
          communityId: communityId,
          postId: postId,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    fetchpost();
    setReplyState({ ...replyState, communityId: communityId, postId: postId });
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<PostComponent post={post} />} />
        <Route path="/check" element={<PasswordCheck />} />
      </Routes>
    </>
  );
}

interface PostProps {
  post: Post | null;
}
const PostComponent = ({ post }: PostProps) => {
  const { postState, setPostState } = usePostStore();
  const navigate = useNavigate();

  return (
    <>
      {post ? (
        <>
          <div className="text-white">
            <div className="text-white">
              <div className="flex">
                {/* 글제목 상단위치 삭제 수정버튼 */}
                <div className="mb-2 ml-auto mr-4 flex text-sm font-light">
                  {/* 삭제 */}
                  <button
                    onClick={() => {
                      setPostState({
                        ...postState,
                        title: post.title,
                        status: "delete",
                      });
                      navigate(
                        `/community/${postState.communityId}/${postState.postId}/check`,
                      );
                    }}
                  >
                    삭제
                  </button>
                  <div className="mx-2">|</div>
                  {/* 수정 */}
                  <button
                    onClick={() => {
                      setPostState({
                        ...postState,
                        title: post.title,
                        content: post.content,
                        status: "update",
                      });
                      navigate(
                        `/community/${postState.communityId}/${postState.postId}/check`,
                      );
                    }}
                  >
                    수정
                  </button>
                </div>
              </div>
              {/* 글 내용 */}
              <div className="bg-bgGray p-3 text-lg font-light">
                {post.title}
              </div>

              <div className="flex p-2 text-sm font-extralight">
                <div className="">{post.nickname}</div>
                <div className="ml-auto flex flex-col">
                  <div>
                    추천 | 비추천 | 댓글 {post.reply_count} | 조회수ddddddd
                  </div>

                  {post.creation_time !== post.modification_time ? (
                    <div className="">
                      작성일 {formatTime(post.creation_time)}
                    </div>
                  ) : (
                    <div className="">
                      <div className="">
                        작성일 {formatTime(post.creation_time)}
                      </div>
                      <div className="">
                        수정일 {formatTime(post.modification_time)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-2 border-b-2 border-bgGray"></div>

            <div id="본문" className="p-2 font-light text-white">
              <div>{post.content}</div>
            </div>

            <div id="추천 비추천">
              <div></div>
            </div>

            <div className="mb-2 border-b-2 border-bgGray"></div>
            <div>
              {/* TODO */}
              {/* 댓글 아이콘 */}
              <div className="p-2 text-xl font-extralight">댓글</div>
              <div className="mb-2 border-b-2 border-bgGray"></div>
              <ReplyList />
            </div>
            <div id="글목록" className="mt-4">
              <PostList />
            </div>
          </div>
        </>
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
