import { Route, Routes } from "react-router-dom";
import Header from "./component/Header";
import Member from "./member/Member";
import Community from "./community/Community";
import Home from "./home/Home";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<Header />} />
      </Routes>
      <Routes>
        <Route index element={<Home />} />
        <Route path="community/*" element={<Community />} />
        <Route path="member/*" element={<Member />} />
      </Routes>
    </>
  );
}
