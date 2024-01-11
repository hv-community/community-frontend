import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PostList from "./PostList";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const formatTime = (time: Date) => {
  const formattedTime = new Date(time)
    .toISOString()
    .replace("T", " ")
    .slice(0, -5);
  return `${formattedTime}`;
};

export default function PostDetail() {
  const { communityId, postId } = useParams();
  // postDetail 가져오는 부분
  const [postDetail, setPostDetail] = useState<Post | null>(null);
  const fetchPostDetail = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/community/v1/${communityId}/${postId}`,
      );
      if (response) {
        setPostDetail(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    fetchPostDetail();
    fetchReply();
  }, []);

  // 본문아래 표시되는 댓글 가져오는 부분
  const [replyList, setReplyList] = useState<ReplyState>({
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
        `${BASE_URL}/community/v1/${communityId}/${postId}/reply?page=${page}&page_size=${page_size}`,
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

  return (
    <>
      {postDetail ? (
        <div className="text-white">
          <div id="위쪽" className="text-white">
            <div className="bg-bgGray p-3 text-lg font-light">
              {postDetail.title}
            </div>

            <div className="flex p-2 text-sm font-extralight">
              <div className="">{postDetail.nickname}</div>
              <div className="ml-auto flex flex-col">
                <div>
                  추천 | 비추천 | 댓글 {postDetail.reply_count} | 조회수ddddddd
                </div>

                {postDetail.creation_time !== postDetail.modification_time ? (
                  <div className="">
                    작성일 {formatTime(postDetail.creation_time)}
                  </div>
                ) : (
                  <div className="">
                    <div className="">
                      작성일 {formatTime(postDetail.creation_time)}
                    </div>
                    <div className="">
                      수정일 {formatTime(postDetail.modification_time)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="border-bgGray mb-2 border-b-2"></div>
          <div id="본문" className="p-2 font-light text-white">
            <div>{postDetail.content}</div>
          </div>
          <div id="추천 비추천">
            <div></div>
          </div>
          <div className="border-bgGray mb-2 border-b-2"></div>
          <div id="댓글">
            {/* TODO */}
            {/* 댓글 아이콘 */}
            <div className="p-2 text-xl font-extralight">댓글</div>
            <div className="border-bgGray mb-2 border-b-2"></div>
            <>
              {replyList.items.map((reply, index) => (
                <Reply key={index} reply={reply} />
              ))}
            </>
          </div>
          <div id="글목록" className="mt-4">
            <PostList />
          </div>
        </div>
      ) : null}
    </>
  );
}

interface ReplyProp {
  reply: Reply;
}
const Reply = ({ reply }: ReplyProp) => {
  return (
    <>
      <div className="border-bgGray mx-2 my-3 border-2 text-sm font-extralight">
        <div className="bg-bgGray flex px-2 py-1">
          <div>{reply.nickname}</div>
          <div className="ml-auto flex items-center text-xs">
            {formatTime(reply.creation_time)}
          </div>
        </div>
        <div className="p-2 text-white">{reply.content}</div>
      </div>
    </>
  );
};
