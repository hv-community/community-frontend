import { Route, Routes } from "react-router-dom";
import Signup from "./Signup";
import Signin from "./Signin";

export default function Member() {
  return (
    <>
      <Routes>
        <Route path="signup" element={<Signup />} />
        <Route path="signin" element={<Signin />} />
      </Routes>
    </>
  );
}
