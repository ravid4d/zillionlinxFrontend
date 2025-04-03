import React from "react";
import { useSelector } from "react-redux";

const UserAgreement = () => {
  const {isLoggedIn} = useSelector(state=>state.auth);
  return (
    <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 xl:px-2 h-full">
      <div className={`${isLoggedIn ? "sm:rounded-tl-[20px] rounded-bl-[20px] rounded-br-[20px]" : "rounded-[20px]"} bg-navy p-4 xl:p-8 h-full`}>
        <div className="flex flex-wrap h-full w-full text-white flex-col">
          <h1 className="text-xl mb-2">User Agreement for ZillionLinX</h1>
          <p className="text-xs mb-1">Effective Date: January 1, 2025</p>
          <ul className="list-decimal space-y-10 ps-4 text-sm">
            <li>
              Acceptance of Terms
              <p className="text-xs">
                By creating an account or using any part of the Service, you
                agree to be bound by this Agreement and our Privacy Policy. If
                you do not agree to these terms, do not use the Service.
              </p>
            </li>
            <li>
              Eligibility
              <p className="text-xs">
                You must be at least 13 years old to use ZillionLinX. If you are
                under the age of majority in your jurisdiction, you must have
                the consent of a parent or legal guardian to use the Service.
              </p>
            </li>
            <li>
              User Accounts
              <ul className="list-disc ps-4  text-xs space-y-1">
                <li>
                  You are responsible for maintaining the confidentiality of
                  your account credentials.
                </li>
                <li>
                  You are responsible for all activities that occur under your
                  account.
                </li>
                <li>
                  ZillionLinX reserves the right to suspend or terminate
                  accounts that violate this Agreement.
                </li>
              </ul>
            </li>
            <li>
              User Content
              <p className="text-xs">
                You may post, share, or submit content including bookmarks,
                tags, comments, and other data (&quot;User Content&quot;).
              </p>
              <p className="text-xs">
                By submitting User Content, you grant ZillionLinX a
                non-exclusive, worldwide, royalty-free license to use,
                reproduce, distribute, display, and adapt your content solely to
                operate and promote the Service.
              </p>
              <p className="text-xs mb-3">
                You are solely responsible for the content you post. You agree
                not to post content that:
              </p>
              <ul className="list-disc ps-4 text-xs space-y-1 mb-3">
                <li>Violates any applicable laws or regulations;</li>
                <li>
                  Infringes on any third party’s intellectual property or rights
                  of publicity/privacy;
                </li>
                <li>
                  Is defamatory, obscene, abusive, hateful, or otherwise
                  objectionable;
                </li>
                <li>Contains spam, viruses, or malicious code.</li>
              </ul>
              <p className="text-xs">
                ZillionLinX reserves the right to remove or restrict content at
                our sole discretion.
              </p>
            </li>
            <li>
              Intellectual Property
              <p className="text-xs">
                All content and materials on the Service (excluding User
                Content) are the property of ZillionLinX or its licensors and
                are protected by copyright, trademark, and other intellectual
                property laws.
              </p>
              <p className="text-xs">
                You may not copy, modify, distribute, or create derivative works
                from our content without our express written permission.
              </p>
            </li>
            <li>
              Acceptable Use
              <p className="text-xs mb-3">
                You agree to use ZillionLinX for lawful purposes only. You may
                not:
              </p>
              <ul className="list-disc ps-4 text-xs space-y-1">
                <li>
                  Access or use the Service for any unauthorized or illegal
                  purpose;
                </li>
                <li>
                  Attempt to gain unauthorized access to other users’ accounts
                  or ZillionLinX systems;
                </li>
                <li>
                  Use automated systems (e.g., bots, scrapers) without our
                  written permission.
                </li>
              </ul>
            </li>
            <li>
              Termination
              <p className="text-xs">
                We reserve the right to suspend or terminate your access to the
                Service at any time, with or without notice, for conduct that we
                believe violates this Agreement or is otherwise harmful to other
                users or the Service.
              </p>
            </li>
            <li>
              Disclaimer of Warranties
              <p className="text-xs">
                The Service is provided “AS IS” and “AS AVAILABLE”. ZillionLinX
                disclaims all warranties, express or implied, including but not
                limited to merchantability, fitness for a particular purpose,
                and non-infringement.
              </p>
              <p className="text-xs">
                We do not guarantee the accuracy, reliability, or availability
                of the Service or any content therein.
              </p>
            </li>
            <li>
              Limitation of Liability
              <p className="text-xs">
                To the fullest extent permitted by law, ZillionLinX shall not be
                liable for any indirect, incidental, special, or consequential
                damages, or loss of data, profits, or goodwill arising from your
                use or inability to use the Service.
              </p>
            </li>
            <li>
              Indemnity
              <p className="text-xs">
                You agree to indemnify and hold harmless ZillionLinX and its
                affiliates, officers, and employees from any claims,
                liabilities, damages, or expenses arising out of your use of the
                Service or violation of this Agreement.
              </p>
            </li>
            <li>
              Changes to this Agreement
              <p className="text-xs">
                ZillionLinX may update this Agreement from time to time. We will
                notify users of material changes. Continued use of the Service
                after changes are made constitutes acceptance of the new terms.
              </p>
            </li>
            <li>
              Governing Law
              <p className="text-xs">
                This Agreement shall be governed by the laws of Florida, United
                States of America, without regard to its conflict of laws
                principles.
              </p>
            </li>
            <li>
              Contact Us
              <p className="text-xs">
                If you have any questions or concerns regarding this Agreement, please contact us at:</p>
                <p className="text-xs">Email:
                <a href="mailto:customer_support@zillionlinx.com">
                  customer_support@zillionlinx.com
                </a>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserAgreement;
