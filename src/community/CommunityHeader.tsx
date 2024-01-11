import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function CommunityHeader() {
  const { communityId } = useParams();

  const [communityState, setCommunityState] = useState<Community>({
    id: 0,
    title: "",
    description: "",
    thumbnail: "",
  });

  // communityId를 기반으로 현재 community의 정보를 하나만 가져온다.
  const fetchCommunityDetail = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/community/v1/${communityId}/detail`,
      );
      if (response) {
        setCommunityState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          thumbnail: response.data.thumbnail,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchCommunityDetail();
  }, []);
  const navigate = useNavigate();
  const handleClickCommunityHeader = () => {
    navigate(`/community/${communityId}`);
  };
  return (
    <>
      <div
        className="my-1.5 flex h-10 items-center px-4"
        onClick={() => {
          handleClickCommunityHeader();
        }}
      >
        <img
          src={communityState.thumbnail}
          alt="Community Thumbnail"
          className="h-10 rounded-full"
        />
        <div className="ml-3 text-xl font-semibold text-white opacity-80">
          {communityState.title}
        </div>
      </div>
      <div className="border-bgGray my-1 mb-4 border-b-2"></div>
    </>
  );
}
