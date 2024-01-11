import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalStore } from "../store/GlobalStore";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function PostList() {
  const { globalState, setGlobalState } = useGlobalStore();
  const { communityId } = useParams();
  const [postList, setPostList] = useState<PostState>({
    items: [],
    page: 0,
    page_size: 0,
    total_page: 0,
    prev: 0,
    next: 0,
  });

  const fetchPostList = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/community/v1/${communityId}`,
      );
      if (response) {
        setPostList({
          items: response.data.items,
          page: response.data.page,
          page_size: response.data.page_size,
          total_page: response.data.total_page,
          prev: response.data.prev,
          next: response.data.next,
        });
        setGlobalState({ ...globalState, loading: false });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    fetchPostList();
  }, []);
  const sortedPost = postList.items.sort((a, b) => b.id - a.id);
  const navigate = useNavigate();
  const handleClickPostList = () => {
    navigate(`/community/${communityId}`);
    window.location.href = `/community/${communityId}`;
  };
  return (
    <>
      {globalState.loading ? null : (
        <>
          <div className="mx-2 mb-4 flex text-sm font-light text-white">
            <div
              className="border-bgGray border-2 bg-black p-1"
              onClick={() => {
                handleClickPostList();
              }}
            >
              전체글
            </div>
            <div className="border-bgGray border-y-2 border-r-2 bg-red-600 p-1 ">
              개념글
            </div>
            <div
              className="border-bgGray ml-auto border-2 bg-black p-1"
              onClick={() => {
                navigate(`/community/${communityId}/create`);
              }}
            >
              글쓰기
            </div>
          </div>
          {sortedPost.map((post, index) => (
            <div key={index}>
              <Post key={index} communityId={communityId} post={post} />

              <div className="my-1 border-b-2 border-gray-700"></div>
            </div>
          ))}
          <div className="border-bgGray mx-2 mb-2 mt-2 flex w-fit border-2 text-white">
            <div className="border-bgGray border-r-2 bg-black p-1 text-sm font-light">
              전체글
            </div>
            <div className="bg-red-600 p-1 text-sm font-light">개념글</div>
          </div>
        </>
      )}
    </>
  );
}

// 시간형식 만드는 함수
const formatTimeDifference = (time: Date) => {
  const now = new Date();
  const postTime = new Date(time);
  const differenceInSeconds = Math.floor(
    (now.getTime() - postTime.getTime()) / 1000,
  );

  if (differenceInSeconds < 86400) {
    const hours = Math.floor(differenceInSeconds / 3600);
    const minutes = Math.floor((differenceInSeconds % 3600) / 60);
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  } else {
    const month = postTime.getMonth() + 1;
    const day = postTime.getDate();
    return `${month}-${day}`;
  }
};
interface PostProp {
  communityId: string | undefined;
  post: Post;
}
// 게시판내 게시글 하나씩 표시하는 컴포넌트
const Post = ({ communityId, post }: PostProp) => {
  const navigate = useNavigate();
  const handlePost = () => {
    navigate(`/community/${communityId}/${post.id}`);
    window.location.href = `/community/${communityId}/${post.id}`;
  };

  return (
    <div
      className="flex-row gap-2 px-3 text-base font-extralight text-white"
      onClick={() => {
        handlePost();
      }}
    >
      <div className="">
        <div className="mx-auto mr-2">
          {post.title} <span>[{post.reply_count}]</span>
        </div>
      </div>
      <div className="flex text-sm">
        <div className="mr-auto">{post.nickname}</div>
        <div className="mt-1 flex items-center gap-2">
          <div>{formatTimeDifference(post.creation_time)}</div>

          <div>|</div>
          <div>조회</div>

          <div>|</div>
          <div>추천</div>
        </div>
      </div>
    </div>
  );
};
