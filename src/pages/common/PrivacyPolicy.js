import React from "react";
import { useSelector } from "react-redux";

const PrivacyPolicy = () => {
  const { isLoggedIn } = useSelector(state => state.auth);

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 xl:px-2 h-full">
      <div
        className={`${isLoggedIn
          ? "sm:rounded-tl-[20px] rounded-bl-[20px] rounded-br-[20px]"
          : "rounded-[20px]"} bg-white p-4 xl:p-8 h-full`}
      >
        <div className="flex flex-wrap h-full w-full text-black flex-col">
          <h1 className="text-2xl mb-4 font-bold">Privacy Statement</h1>
          <p className="text-md mb-1"><span className="font-semibold">Effective Date:</span> January 1, 2025</p>
          <p className="text-md mb-5"><span className="font-semibold">Last Updated:</span> March 3, 2025</p>
          <p className="mb-5 text-md">
            ZillionLinX is operated by <span className="font-semibold">PGL Resources, LLC</span>, a Florida limited
            liability company. Your privacy is important to us. This Privacy
            Statement explains how we collect, use, and protect your information
            when you use our website and bookmarking services.
          </p>
          <ul className="list-decimal space-y-6 ps-4 text-md">
            <li className="font-semibold">
              Information We Collect
              <ul className="list-[lower-alpha] ps-4 space-y-6">
                <li className="font-semibold mt-2">
                  Information You Provide Directly:
                  <ul className="list-disc ps-4 text-md mt-2 space-y-1">
                    <li className="font-normal">
                      Username, email address, and password when you register.
                    </li>
                    <li className="font-normal">
                      Profile information such as first and last name.
                    </li>
                    <li className="font-normal">
                      Bookmarks, tags, and any notes or comments you add.
                    </li>
                  </ul>
                </li>
                <li className="font-semibold">
                  Automatically Collected Information:
                  <ul className="list-disc ps-4 mt-2 text-md space-y-1">
                    <li className="font-normal">
                      IP address and device information.
                    </li>
                    <li className="font-normal">
                      Browser type and operating system.
                    </li>
                    <li className="font-normal">
                      Usage data such as pages visited and bookmarks saved.
                    </li>
                  </ul>
                </li>
                <li className="font-semibold">
                  Cookies and Tracking Technologies:
                  <p className="text-md font-normal mt-2">
                    We use cookies and similar technologies to enhance user
                    experience, analyze trends, and personalize content. When
                    you visit our website, a banner will prompt you to accept or
                    reject cookies. Non-essential cookies are not set until you
                    provide consent. You may adjust cookie settings in your
                    browser at any time.
                  </p>
                  <p className="text-md font-normal mt-2">
                    We may use third-party services such as Google Analytics and
                    Amazon Web Services to operate and analyze our platform.
                  </p>
                </li>
              </ul>
            </li>
            <li className="font-semibold text-md">
              How We Use Your Information
              {/* <p className="mt-2 font-normal">We use your data to:</p> */}
              <ul className="list-disc ps-4 mt-2 text-md space-y-1">
                <li className="font-normal">
                  Provide and improve our bookmarking services.
                </li>
                <li className="font-normal">
                  Personalize content and recommendations.
                </li>
                <li className="font-normal">
                  Send you service-related updates and notifications.
                </li>
                <li className="font-normal">
                  Monitor platform usage and ensure security.
                </li>
                <li className="font-normal">Comply with legal obligations.</li>
              </ul>
            </li>
            <li className="font-semibold">
              Sharing of Information
              <p className="mt-2 font-normal">
                We do not sell your personal information. We may share data
                with:
              </p>
              <ul className="list-disc ps-4 text-md mt-2 space-y-1">
                <li className="font-normal">
                  Service providers and partners who help operate the website
                  (e.g., hosting, analytics).
                </li>
                <li className="font-normal">
                  Law enforcement or regulatory authorities when required by
                  law.
                </li>
                <li className="font-normal">
                  Other users, but only information you choose to make public
                  (e.g., public bookmarks).
                </li>
              </ul>
            </li>
            <li className="font-semibold">
              Data Retention
              <p className="text-md mt-2 font-normal">
                We retain your information for as long as your account is active
                or as necessary to provide services and comply with legal
                obligations. You may delete your account at any time, and we
                will remove your personal data accordingly, subject to retention
                requirements.
              </p>
            </li>
            <li className="font-semibold">
              Your Choices and Rights
              {/* <p className="text-md mt-2 font-normal">You may:</p> */}
              <ul className="list-disc ps-4 text-md mt-2 space-y-1">
                <li className="font-normal">
                  Update or delete your profile and bookmarks.
                </li>
                <li className="font-normal">
                  Control cookie preferences in your browser.
                </li>
                <li className="font-normal">
                  Request access to or deletion of your personal information
                  (subject to verification).
                </li>
                <li className="font-normal">
                  Opt out of marketing emails at any time.
                </li>
              </ul>
            </li>
            <li className="font-semibold">
              Security
              <p className="text-md mt-2 font-normal">
                We take reasonable steps to protect your data using encryption,
                secure servers, and access controls. However, no method of
                transmission over the internet is 100% secure.
              </p>
            </li>
            <li className="font-semibold">
              Children’s Privacy
              <p className="text-md font-normal mt-2">
                Our service is not intended for children under 13. We do not
                knowingly collect personal information from minors.
              </p>
            </li>
            <li className="font-semibold">
              International Users
              <p className="text-md font-normal mt-2">
                If you access our service from outside the United States, you
                consent to the transfer and processing of your data in the U.S.
                and other jurisdictions where our servers are located.
              </p>
            </li>
            <li className="font-semibold">
              Changes to This Policy
              <p className="text-md font-normal mt-2">
                We may update this Privacy Statement periodically. We will
                notify users of any material changes via email or through the
                platform.
              </p>
            </li>
            <li className="font-semibold">
              Contact Us
              <p className="text-md font-normal mt-2">
                If you have any questions or concerns about this Privacy
                Statement, please contact us at:
              </p>
              <h3 className="mt-2 font-normal text-md">ZillionLinX</h3>
              <p className="font-normal text-md">Operated by PGL Resources, LLC</p>
              <p className="text-md font-normal">
                Email: 
                <a
                  href="mailto:support@zillionlinx.com"
                  className="hover:text-dark-blue ml-1"
                >
                  support@zillionlinx.com
                </a>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
