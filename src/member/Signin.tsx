import axios, { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useMemberStore } from "../store/MemberStore";
import { FormEvent, useState } from "react";
import { useGlobalStore } from "../store/GlobalStore";
const BASE_URL = import.meta.env.VITE_BASE_URL;
interface SigninState {
  isEmailValid: boolean;
  isPasswordValid: boolean;
  isSigninFail: boolean;
}
export default function Signin() {
  const navigate = useNavigate();
  const { memberState, setMemberState } = useMemberStore();

  const [signinState, setSigninState] = useState<SigninState>({
    isEmailValid: false,
    isPasswordValid: false,
    isSigninFail: false,
  });

  // 이메일 유효성검사
  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
  const isEmailValid = () => {
    return emailRegEx.test(memberState.email);
  };
  // 비밀번호 유효성검사
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
  const isPasswordValid = () => {
    return passwordRegex.test(memberState.password);
  };

  const { globalState, setGlobalState, clearErrorMessage } = useGlobalStore();
  const handleSignin = async (e: FormEvent) => {
    e.preventDefault();
    // 이메일 유효성검사
    if (!isEmailValid()) {
      setSigninState({ ...signinState, isEmailValid: true });
      return;
    }
    if (!isPasswordValid()) {
      setSigninState({ ...signinState, isPasswordValid: true });
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/v1/member/signin`, {
        email: memberState.email,
        password: memberState.password,
      });
      if (response) {
        console.log(response);
        navigate("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setGlobalState({ ...globalState, errorMessage: error.message });
        setTimeout(() => {
          clearErrorMessage();
        }, 3000);
        console.log(error);
      }
    }
  };
  return (
    <div>
      <div className="mx-auto pt-60 text-center md:p-16 dark:text-slate-200">
        <div className="w-full rounded-lg shadow-md">
          <div className="p-4">Community</div>
          <div className="mx-auto flex w-5/6 flex-col">
            <div className="my-6 font-semibold">로그인</div>

            <form className="flex w-full flex-col" onSubmit={handleSignin}>
              <div className="mb-1 text-start">이메일</div>
              <input
                placeholder="이메일 입력"
                className="mx-auto mb-2 w-full border-2 border-gray-500 bg-black p-2 focus:bg-indigo-100 focus:text-black focus:opacity-90"
                onChange={(e) => {
                  setMemberState({
                    ...memberState,
                    email: e.target.value,
                  });
                  setSigninState({
                    ...signinState,
                    isEmailValid: false,
                    isSigninFail: false,
                  });
                }}
              />
              <div className="mb-1 text-start">비밀번호</div>
              <input
                type="password"
                placeholder="비밀번호 입력"
                className="mx-auto mb-2 w-full border-2 border-gray-500 bg-black p-2 focus:bg-indigo-100 focus:text-black focus:opacity-90"
                onChange={(e) => {
                  setMemberState({
                    ...memberState,
                    password: e.target.value,
                  });
                  setSigninState({
                    ...signinState,
                    isPasswordValid: false,
                    isSigninFail: false,
                  });
                }}
              />
              <button
                type="submit"
                className="w- mx-auto mb-2 mt-4 w-full bg-indigo-600 p-2 font-semibold text-white"
              >
                로그인
              </button>
              {signinState.isEmailValid ? (
                <div className="mx-auto text-start text-base text-red-500">
                  이메일을 확인해 주세요
                </div>
              ) : null}
              {signinState.isPasswordValid ? (
                <div className="mx-auto text-start text-base text-red-500">
                  비밀번호를 확인해 주세요
                </div>
              ) : null}
              {signinState.isSigninFail ? (
                <div className="mx-auto text-start text-base text-red-500">
                  이메일 또는 비밀번호를 확인해 주세요
                </div>
              ) : null}
              {globalState.errorMessage ? (
                <div className="mx-auto text-start text-base text-red-500">
                  {globalState.errorMessage}
                </div>
              ) : null}
            </form>
            <div className="mx-auto flex ">
              <a href="/member/helppw" className="my-4 text-blue-400">
                로그인할 수 없습니까?
              </a>
              <div className="mx-2 my-4">|</div>
              <a href="/member/signup" className="my-4 text-blue-400">
                계정 만들기
              </a>
            </div>
            <div className="my-4">또는 다음을 사용하여 계속하기</div>
            <div>oauth list</div>
          </div>
        </div>
      </div>
    </div>
  );
}
