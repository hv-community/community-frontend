import { Cookies } from "react-cookie";

const cookies = new Cookies();
const today = new Date();
const expireDate = today.setDate(today.getDate() + 7);

export const setCookie = (name: string, value: string, option?: object) => {
  return cookies.set(name, value, option);
};

export const getCookie = (name: string) => {
  return cookies.get(name);
};

export const deleteCookie = (name: string) => {
  return cookies.remove(name, { sameSite: "strict", path: "/" });
};
