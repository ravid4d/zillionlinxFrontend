import { getCookie } from "../cookieUtils";

export const useCookie = (cookieName) => {
    return getCookie(cookieName);
}