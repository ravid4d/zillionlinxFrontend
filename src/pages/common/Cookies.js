import React, { useEffect, useState } from "react";
import { getCookie, setCookie } from "../../cookieUtils";

const Cookies = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const consent = getCookie("cookieConsent");
    if (!consent) {
      setVisible(true); // show if cookie not set or expired
    }
  }, []);
  const acceptCookies = () => {
    setCookie("cookieConsent", "accepted", 30); // store for 30 days
    setVisible(false);
  };

  const rejectCookies = () => {
    setCookie("cookieConsent", "rejected", 30); // store for 30 days
    setVisible(false);
    window.location.href="/"
  };

  if (!visible) return null;
  return (
    <div
      id="cookie-banner"
      className="fixed bottom-0 left-0 right-0 bg-white p-10 text-center z-50 w-full"
    >
      <p className="mb-4 text-lg">
        We use cookies to improve your experience. You can accept or reject non-essential cookies.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
      <button  onClick={acceptCookies} className="btn dark-btn">Accept All</button>
      <button onClick={rejectCookies} className="btn navy-btn">Reject All</button>
      </div>
    </div>
  );
};

export default Cookies;
