// hooks/useBrowser.js
import { useEffect, useState } from "react";
import { getBrowserName } from "../getBrowserName";

const useBrowser = () => {
  const [browser, setBrowser] = useState("Unknown");

  useEffect(() => {
    const detectedBrowser = getBrowserName();
    setBrowser(detectedBrowser);
  }, []);

  return browser;
};

export default useBrowser;
