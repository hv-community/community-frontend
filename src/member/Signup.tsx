import axios, { AxiosError } from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useMemberStore } from "../store/MemberStore";
import { getCookie, setCookie } from "../Cookie";
import { useGlobalStore } from "../store/GlobalStore";
import SuccessModal from "../component/SuccessModal";

const BASE_URL = import.meta.env.VITE_BASE_URL;
interface SignupState {
  isEmailValid: boolean;
  isNicknameValid: boolean;
  isPasswordValid: boolean;
}

export default function Signup() {
  const [signupState, setSignupState] = useState<SignupState>({
    isEmailValid: false,
    isNicknameValid: false,
    isPasswordValid: false,
  });

  const { memberState, setMemberState } = useMemberStore();

  // 이메일 유효성검사
  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
  const isEmailValid = () => {
    return emailRegEx.test(memberState.email);
  };
  // 닉네임 유효성검사
  const nicknameRegex = /^[a-zA-Z0-9]{4,20}$/;
  const isNicknameValid = () => {
    return nicknameRegex.test(memberState.nickname);
  };
  // 비밀번호 유효성검사
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
  const isPasswordValid = () => {
    return passwordRegex.test(memberState.password);
  };
  // 재확인 비밀번호 검사
  const isConfirmPasswordValid = () => {
    const result = memberState.password == memberState.confirmPassword;
    return result;
  };

  const [hasToken, setHasToken] = useState<boolean>();
  // 페이지 로딩될때 토큰있는지 한번 검사
  useEffect(() => {
    if (getCookie("token")) {
      setMemberState({ ...memberState, email: getCookie("email") });
      setHasToken(true);
    }
  }, []);
  useEffect(() => {
    if (memberState.token) {
      setHasToken(true);
    }
  }, [memberState.token]);

  const { globalState, setGlobalState, clearErrorMessage } = useGlobalStore();
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    // 이메일 유효성검사
    if (!isEmailValid()) {
      setSignupState({ ...signupState, isEmailValid: true });
      return;
    }
    // 닉네임 유효성검사
    if (!isNicknameValid()) {
      setSignupState({ ...signupState, isNicknameValid: true });
      return;
    }
    // 비밀번호 유효성검사
    if (!isPasswordValid()) {
      setSignupState({ ...signupState, isPasswordValid: true });
      return;
    }
    if (!isConfirmPasswordValid()) {
      setSignupState({ ...signupState, isPasswordValid: true });
      return;
    }
    try {
      // 가입된 이메일 없는경우 200반환
      const response = await axios.post(`${BASE_URL}/v1/member/signup`, {
        email: memberState.email,
        nickname: memberState.nickname,
        password: memberState.password,
      });

      if (response.data.status == "200") {
        // 응답보고 재설정
        // 응답대기동안 로딩이미지 돌리기
        // return token;
        setMemberState({
          ...memberState,
          token: response.data,
          password: "",
          confirmPassword: "",
        });
        // 응답들어오면 토큰 state와 쿠키에 저장
        // email token제외 모두 초기화
        const today = new Date();

        const expireDate = today.setDate(today.getDate() + 1);
        setCookie("email", memberState.email, {
          sameSite: "strict",
          path: "/",
          expires: new Date(expireDate),
        });
        setCookie("token", memberState.token, {
          sameSite: "strict",
          path: "/",
          expires: new Date(expireDate),
        });
        // 인증창보이도록 state변경 >> useEffect에서 구현
      }
    } catch (error) {
      console.log("error : ", error);
      // axios error type check
      if (axios.isAxiosError(error)) {
        setGlobalState({ ...globalState, errorMessage: error.message });
        setTimeout(() => {
          clearErrorMessage();
        }, 3000);
        console.log(error);
      }
    }

    // 가입요청시 가입되어있는지 확인
    // 가입되어있는경우 오류띄우기
    // 미가입시 이메일발송요청과 동시에 보드페이지로 리다이렉트
  };
  return (
    <>
      <div className="mx-auto pt-60 text-center md:p-16 dark:text-slate-200">
        <div className="w-full rounded-lg shadow-md">
          <div className="p-4">Community</div>
          <div className="mx-auto flex w-5/6 flex-col">
            {!hasToken ? (
              <Activate />
            ) : (
              <Main
                signupState={signupState}
                setSignupState={setSignupState}
                handleSignup={handleSignup}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
interface SignupProps {
  signupState: SignupState;
  setSignupState: (state: SignupState) => void;
  handleSignup: (e: FormEvent) => void;
}
const Main = ({ signupState, setSignupState, handleSignup }: SignupProps) => {
  const { memberState, setMemberState } = useMemberStore();

  const { globalState } = useGlobalStore();
  return (
    <div>
      <div className="mx-auto flex w-5/6 flex-col">
        <div className="my-6 font-semibold">회원가입</div>

        <form className="flex w-full flex-col" onSubmit={handleSignup}>
          <div className="mb-1 text-start">이메일</div>
          <input
            placeholder="이메일 입력"
            className="mx-auto mb-2 w-full border-2 border-gray-500 bg-black p-2 focus:bg-indigo-100 focus:text-black focus:opacity-90"
            onChange={(e) => {
              setMemberState({
                ...memberState,
                email: e.target.value,
              });
              setSignupState({
                ...signupState,
                isEmailValid: false,
              });
            }}
          />
          <div className="mb-1 text-start">닉네임</div>
          <input
            placeholder="닉네임 입력"
            className="mx-auto mb-2 w-full border-2 border-gray-500 bg-black p-2 focus:bg-indigo-100 focus:text-black focus:opacity-90"
            onChange={(e) => {
              setMemberState({
                ...memberState,
                nickname: e.target.value,
              });
              setSignupState({ ...signupState, isNicknameValid: false });
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
              setSignupState({
                ...signupState,
                isPasswordValid: false,
              });
            }}
          />
          <div className="mb-1 text-start">비밀번호 확인</div>
          <input
            type="password"
            placeholder="비밀번호 입력"
            className="mx-auto mb-2 w-full border-2 border-gray-500 bg-black p-2 focus:bg-indigo-100 focus:text-black focus:opacity-90"
            onChange={(e) => {
              setMemberState({
                ...memberState,
                confirmPassword: e.target.value,
              });
              setSignupState({
                ...signupState,
                isPasswordValid: false,
              });
            }}
          />
          <button
            type="submit"
            className="w- mx-auto mb-2 mt-4 w-full bg-indigo-600 p-2 font-semibold text-white"
          >
            가입
          </button>
          {signupState.isEmailValid ? (
            <div className="mx-auto text-start text-base text-red-500">
              이메일을 확인해 주세요
            </div>
          ) : null}
          {signupState.isNicknameValid ? (
            <div className="mx-auto text-start text-base text-red-500">
              이름은 2~20글자 이내로 설정해 주세요
            </div>
          ) : null}
          {signupState.isPasswordValid ? (
            <div className="mx-auto text-start text-base text-red-500">
              비밀번호를 확인해 주세요
            </div>
          ) : null}
          {globalState.errorMessage ? (
            <div className="mx-auto text-start text-base text-red-500">
              {globalState.errorMessage}
            </div>
          ) : null}
          <div className="mx-auto mt-2 w-3/4 text-center text-sm text-gray-500">
            비밀번호: 8~20자의 영문 대/소문자 <br />
            숫자, 특수문자를 사용해 주세요
          </div>
        </form>
        <a href="/member/signin" className="my-4 text-sky-400">
          이미 계정이 있습니까? 로그인
        </a>
      </div>
    </div>
  );
};

const Activate = () => {
  const { memberState, setMemberState } = useMemberStore();
  const { globalState, setGlobalState } = useGlobalStore();
  const [isCodeValid, setIsCodeValid] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const handleActivate = async (e: FormEvent) => {
    e.preventDefault();
    const token = getCookie("token");
    try {
      const response = await axios.post(`${BASE_URL}/v1/member/activate`, {
        token: token,
        verification_code: verificationCode,
      });
      console.log(response);
      if (response) {
        setGlobalState({
          ...globalState,
          modalMessage: "가입이 완료되었습니다",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setIsCodeValid(true);
      } else {
        console.log(error);
      }
    }
  };
  const test = () => {
    // setGlobalState({
    //   ...globalState,
    //   modalMessage: "가입이 완료되었습니다",
    //   redirectName: "로그인",
    //   redirectUrl: "/member/signin",
    // });
    setGlobalState({
      ...globalState,
      modalMessage: "메일이 정상적으로 발송되었습니다.",
    });
  };

  // 메일 다시보내기
  const emailSend = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/v1/email/send`, {
        token: memberState.token,
      });
      if (response) {
        setGlobalState({
          ...globalState,
          modalMessage: "메일이 정상적으로 발송되었습니다.",
        });
        console.log(response);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setGlobalState({ ...globalState, errorMessage: error.message });
      }
    }
  };
  return (
    <div>
      <div className="mx-auto flex w-5/6 flex-col">
        <div className="my-6 font-semibold">코드를 입력해 주세요</div>
        <form className="flex w-full flex-col" onSubmit={handleActivate}>
          <div className="mb-1 text-start">이메일</div>
          <input
            className="mx-auto mb-2 w-full border-2 border-gray-500 bg-black p-2 focus:bg-indigo-100 focus:opacity-90"
            defaultValue={memberState.email}
            disabled
          />
          <div className="mb-1 text-start">코드</div>
          <input
            type="number"
            placeholder="코드 입력"
            className="mx-auto mb-2 w-full border-2 border-gray-500 bg-black p-2 focus:bg-indigo-100 focus:text-black focus:opacity-90"
            onChange={(e) => {
              setVerificationCode(e.target.value);
            }}
          />
          <button
            type="submit"
            className="w- mx-auto mb-2 mt-4 w-full bg-indigo-600 p-2 font-semibold text-white"
          >
            가입
          </button>
          <div
            className=""
            onClick={() => {
              emailSend();
            }}
          >
            메일이 도착하지않았나요?
          </div>

          {isCodeValid ? (
            <div className="mx-auto text-start text-base text-red-500">
              코드를 다시 한번 확인해 주세요
            </div>
          ) : null}
          {globalState.errorMessage ? (
            <div className="mx-auto text-start text-base text-red-500">
              {globalState.errorMessage}
            </div>
          ) : null}
          {globalState.modalMessage && <SuccessModal />}
        </form>
        <button
          className="w- mx-auto mb-2 mt-4 w-full bg-indigo-600 p-2 font-semibold text-white"
          onClick={test}
        >
          test
        </button>
      </div>
    </div>
  );
};
