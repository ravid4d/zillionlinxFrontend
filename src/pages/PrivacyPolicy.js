import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 xl:px-2 h-full">
      <div className="bg-navy sm:rounded-tl-[20px] rounded-bl-[20px] rounded-br-[20px] p-4 xl:p-8 h-full">
        <div className="flex flex-wrap h-full w-full text-white flex-col">
      <h1 className="text-xl mb-2">Privacy Statement</h1>
      <p className="text-xs mb-1">Effective Date: January 1, 2025</p>
      <p className="text-xs mb-3">Last Updated: March 3, 2025</p>
      <p className="mb-3 text-sm">
        At ZillionLinX, your privacy is important to us. This Privacy Statement
        outlines how we collect, use, and protect your personal information when
        you use our social bookmarking services.
      </p>
      <ul className="list-decimal space-y-10 ps-4 text-sm">
        <li>
          Information We Collect
          <ul className="list-[lower-alpha] ps-4 space-y-6">
            <li>
              Information You Provide Directly:
              <ul className="list-disc ps-4 text-xs space-y-1">
                <li>
                  Username, email address, and password when you register.
                </li>
                <li>Profile information such as first and last name.</li>
                <li>Bookmarks, tags, and any notes or comments you add.</li>
              </ul>
            </li>
            <li>
              Automatically Collected Information:
              <ul className="list-disc ps-4  text-xs space-y-1">
                <li>IP address and device information.</li>
                <li>Browser type and operating system.</li>
                <li>Usage data such as pages visited and bookmarks saved.</li>
              </ul>
            </li>
            <li>
              Cookies and Tracking Technologies:
              <p className=" text-xs">
                We use cookies and similar technologies to enhance user
                experience, analyze trends, and personalize content.
              </p>
            </li>
          </ul>
        </li>
        <li>
          How We Use Your Information
          <p>We use your data to:</p>
          <ul className="list-disc ps-4  text-xs space-y-1">
            <li>Provide and improve our bookmarking services.</li>
            <li>Personalize content and recommendations.</li>
            <li>Send you service-related updates and notifications.</li>
            <li>Monitor platform usage and ensure security.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </li>
        <li>
          Sharing of Information
          <p>
            We do not sell your personal information. We may share data with:
          </p>
          <ul className="list-disc ps-4  text-xs space-y-1">
            <li>
              Service providers and partners who help operate the website (e.g.,
              hosting, analytics).
            </li>
            <li>
              Law enforcement or regulatory authorities when required by law.
            </li>
            <li>
              Other users, but only information you choose to make public (e.g.,
              public bookmarks).
            </li>
          </ul>
        </li>
        <li>
          Data Retention
          <p className="text-xs">
            We retain your information for as long as your account is active or
            as necessary to provide services and comply with legal obligations.
            You may delete your account at any time, and we will remove your
            personal data accordingly, subject to retention requirements.
          </p>
        </li>
        <li>
          Your Choices and Rights
          <p className="text-xs">You may:</p>
          <ul className="list-disc ps-4 text-xs space-y-1">
            <li>Update or delete your profile and bookmarks.</li>
            <li>Control cookie preferences in your browser.</li>
            <li>Request access to or deletion of your personal information (subject to verification).
            </li>
            <li>Opt out of marketing emails at any time.</li>
          </ul>
        </li>
        <li>
          Security
          <p className="text-xs">
            We take reasonable steps to protect your data using encryption,
            secure servers, and access controls. However, no method of
            transmission over the internet is 100% secure.
          </p>
        </li>
        <li>
          Children’s Privacy
          <p className="text-xs">
            Our service is not intended for children under 13. We do not
            knowingly collect personal information from minors.
          </p>
        </li>
        <li>
          International Users
          <p className="text-xs">
            If you access our service from outside the United States, you
            consent to the transfer and processing of your data in the U.S. and
            other jurisdictions where our servers are located.
          </p>
        </li>
        <li>
          Changes to This Policy
          <p className="text-xs">
            We may update this Privacy Statement periodically. We will notify
            you of any material changes via email or through the platform.
          </p>
        </li>
        <li>
          Contact Us
          <p className="text-xs">
            If you have any questions or concerns about this Privacy Statement,
            please contact us at:
          </p>
        </li>
      </ul>
      <h3 className="mt-8">ZillionLinX</h3>
      <p className="text-xs">Email us at <a href="mailto:customer_support@zillionlinx.com">customer_support@zillionlinx.com</a></p>
    </div>
    </div>
    </div>
  );
};

export default PrivacyPolicy;
