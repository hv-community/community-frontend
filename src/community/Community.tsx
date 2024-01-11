import { Route, Routes } from "react-router-dom";
import CommunityHeader from "./CommunityHeader";
import PostList from "./PostList";
import PostDetail from "./PostDetail";
import PostCreate from "./PostCreate";

export default function Community() {
  return (
    <>
      <Routes>
        <Route path="/:communityId/*" element={<CommunityHeader />} />
      </Routes>
      <Routes>
        <Route path="/:communityId" element={<PostList />} />
        <Route path="/:communityId/:postId" element={<PostDetail />} />
        <Route path="/:communityId/create" element={<PostCreate />} />
      </Routes>
    </>
  );
}
