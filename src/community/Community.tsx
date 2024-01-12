import { Route, Routes } from "react-router-dom";
import CommunityHeader from "./CommunityHeader";
import PostList from "./PostList";
import PostEditor from "./PostEditor";
import Post from "./Post";

export default function Community() {
  return (
    <>
      <Routes>
        <Route path="/:communityId/*" element={<CommunityHeader />} />
      </Routes>
      <Routes>
        <Route path="/:communityId/*" element={<PostList />} />
        <Route path="/:communityId/editor" element={<PostEditor />} />
        <Route path="/:communityId/:postId/*" element={<Post />} />
        <Route path="/:communityId/:postId/editor" element={<PostEditor />} />
      </Routes>
    </>
  );
}
