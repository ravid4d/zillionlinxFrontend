import React from "react";

const Cookies = () => {
  return (
    <div
      id="cookie-banner"
      style={{"position": "fixed", "bottom": "0", "width": "100%", "background":" #fef3c7", "padding": "20px", "textAlign": "center", "zIndex": "1000"}}
    >
      <p style={{"margin": "0 0 10px"}}>
        We use cookies to improve your experience. You can accept or reject
        non-essential cookies.
      </p>
      <button onclick="handleCookies(true)" className="btn dark-btn">Accept All</button>
      <button onclick="handleCookies(false)" className="btn dark-btn">Reject All</button>
    </div>
  );
};

export default Cookies;
