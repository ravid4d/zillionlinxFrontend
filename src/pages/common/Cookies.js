import  { useEffect, useState } from "react";
import { getCookie, setCookie } from "../../cookieUtils";

const Cookies = ({onConsentChange }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const consent = getCookie("cookieConsent");
     if (consent === "accepted") {
      onConsentChange(true); // tell parent cookie is accepted
      setVisible(false);
    } else {
      onConsentChange(false); // not accepted yet
      setVisible(true);
    }
  }, []);
  const acceptCookies = () => {
    setCookie("cookieConsent", "accepted", 30); // store for 30 days
     onConsentChange(true); 
    setVisible(false);
  };

  const rejectCookies = () => {
    setCookie("cookieConsent", "rejected", 30); // store for 30 days
     onConsentChange(false);
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <>
      <div className="cookies-overlay fixed bg-white/75 top-0 start-0 end-0 bottom-0 z-50"></div>
      <div
        id="cookie-banner"
        className="fixed bottom-0 left-0 right-0 bg-white p-10 text-center z-50 w-full shadow-cookie-banner"
      >
        <p className="mb-4 text-lg">
          We use cookies to improve your experience.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button onClick={acceptCookies} className="btn dark-btn">
            Accept
          </button>
          <button onClick={rejectCookies} className="btn navy-btn">
            Reject
          </button>
        </div>
      </div>
    </>
  );
};

export default Cookies;
