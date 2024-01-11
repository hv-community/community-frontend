import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalStore } from "../store/GlobalStore";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Home() {
  const { globalState, setGlobalState, clearErrorMessage } = useGlobalStore();

  const [communityState, setCommunityState] = useState<CommunityState>({
    items: [],
    page: 0,
    page_size: 0,
    total_page: 0,
    prev: 0,
    next: 0,
  });

  const fetchCommunityList = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/community/v1/list?page=1&page_size=3`,
      );
      if (response.status == 200) {
        setCommunityState({ ...communityState, items: response.data.items });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setGlobalState({ ...globalState, errorMessage: error.message });
        setTimeout(() => {
          clearErrorMessage();
        }, 3000);
      }
    }
  };
  useEffect(() => {
    fetchCommunityList();
  }, []);

  return (
    <>
      <>
        <div className="p-4 text-white">
          <>
            {communityState.items.map((community, index) => (
              // 최상위 div에 key값 부여
              <div key={index}>
                <HomeCommunity community={community} />
                {index === communityState.items.length - 1 ? null : (
                  <div className="border-bgGray my-4 border-b-2"></div>
                )}
              </div>
            ))}
          </>
        </div>
      </>
    </>
  );
}

interface CommunityProp {
  community: Community;
}
// 게시판 하나씩 잘라낸 컴포넌트
const HomeCommunity = ({ community }: CommunityProp) => {
  const { globalState, setGlobalState, clearErrorMessage } = useGlobalStore();

  const [postState, setPostState] = useState<PostState>({
    items: [],
    page: 0,
    page_size: 0,
    total_page: 0,
    prev: 0,
    next: 0,
  });
  // HomePost로 넘겨줄 데이터를 fetch하는곳
  const fetchPostList = async (communityId: number) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/community/v1/${communityId}`,
      );
      if (response) {
        setPostState({ ...postState, items: response.data.items });
        setGlobalState({ ...globalState, loading: false });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setGlobalState({ ...globalState, errorMessage: error.message });
        setTimeout(() => {
          clearErrorMessage();
        }, 3000);
      }
    }
  };
  useEffect(() => {
    fetchPostList(community.id);
  }, []);

  const sortedPost = postState.items.sort((a, b) => b.id - a.id);
  const navigate = useNavigate();
  return (
    <div>
      <>
        <div
          className="mb-3 w-fit border-b-4 border-emerald-700 text-xl font-extralight"
          onClick={() => {
            navigate(`/community/${community.id}`);
          }}
        >
          {community.title}
        </div>
        {sortedPost.map((post, index) => (
          <HomePost key={index} communityId={community.id} post={post} />
        ))}
      </>
    </div>
  );
};

// 시간형식 만드는 함수
const formatTimeDifference = (time: Date) => {
  const now = new Date();
  const postTime = new Date(time);
  const differenceInSeconds = Math.floor(
    (now.getTime() - postTime.getTime()) / 1000,
  );
  if (differenceInSeconds < 60) {
    return `${differenceInSeconds}초 전`;
  } else if (differenceInSeconds < 3600) {
    const minutes = Math.floor(differenceInSeconds / 60);
    return `${minutes}분 전`;
  } else if (differenceInSeconds < 86400) {
    const hours = Math.floor(differenceInSeconds / 3600);
    return `${hours}시간 전`;
  } else {
    const days = Math.floor(differenceInSeconds / 86400);
    return `${days}일 전`;
  }
};
interface PostProp {
  communityId: number;
  post: Post;
}
// 게시판내 게시글 하나씩 표시하는 컴포넌트
const HomePost = ({ communityId, post }: PostProp) => {
  const navigate = useNavigate();
  const handlePost = () => {
    navigate(`/community/${communityId}/${post.id}`);
  };

  return (
    <div
      className="mb-1 grid grid-cols-2 gap-2 text-base font-extralight"
      onClick={() => {
        handlePost();
      }}
    >
      <div className="col-start-1 col-end-12">
        <div className="mx-auto mr-2">
          {post.title} <span>[{post.reply_count}]</span>
        </div>
      </div>
      <div className="col-start-12 mt-1 h-fit items-center rounded bg-gray-700 px-1 text-center text-sm opacity-70">
        {formatTimeDifference(post.creation_time)}
      </div>
    </div>
  );
};
