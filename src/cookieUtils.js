// utils/cookieUtils.js
export const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString(); //in days
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

export const getCookie = (name) => {
  return document.cookie.split("; ").find((row) => row.startsWith(name + "="))?.split("=")[1];
};
