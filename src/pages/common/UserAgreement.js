import React from "react";
import { useSelector } from "react-redux";

const UserAgreement = () => {
  const { isLoggedIn } = useSelector(state => state.auth);
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 xl:px-2 h-full">
      <div
        className={`${isLoggedIn
          ? "sm:rounded-tl-[20px] rounded-bl-[20px] rounded-br-[20px]"
          : "rounded-[20px]"} bg-white p-4 xl:p-8 h-full`}
      >
        <div className="flex flex-wrap h-full w-full text-black flex-col">
          <h1 className="text-2xl mb-4 font-bold">
            User Agreement for ZillionLinX
          </h1>
          <p className="text-md mb-5"><span className="font-semibold">Effective Date:</span> June 1, 2025</p>
          <p className="text-md mb-5">
            This User Agreement (Agreement) is entered into by and between you
            (User) and PGL Resources, LLC, a Florida limited liability company
            (PGL Resources, Company, we, our, or us), which owns and operates
            ZillionLinX (ZillionLinX, Site, or Service).
          </p>
          <ul className="list-decimal space-y-6 ps-4 text-md">
            <li className="font-semibold">
              Acceptance of Terms
              <p className="text-md font-normal mt-2">
                By accessing, using, or creating an account on ZillionLinX, you
                agree to be bound by this Agreement and our Privacy Policy. If
                you do not agree to these terms, do not use the Service.
              </p>
            </li>
            <li className="font-semibold">
              Eligibility
              <p className="text-md font-normal mt-2">
                You must be at least 13 years old to use the Site. If you are
                under the age of majority in your jurisdiction, you must have
                the consent of a parent or legal guardian.
              </p>
            </li>
            <li className="font-semibold">
              User Accounts
              <ul className="list-disc ps-4 mt-2 text-md space-y-1 font-normal">
                <li>
                  You are responsible for maintaining the confidentiality of
                  your account credentials.
                </li>
                <li>
                  You are responsible for all activities that occur under your
                  account.
                </li>
                <li>
                  We reserve the right to suspend or terminate accounts that
                  violate this Agreement.
                </li>
              </ul>
            </li>
            <li className="font-semibold">
              User Content
              <p className="text-md font-normal mt-2">
                You may submit content including hyperlinks, bookmarks, and
                other data (User Content).
              </p>
              <p className="text-md font-normal">
                You are solely responsible for the content you submit. You agree
                not to submit content that:
              </p>
              <ul className="list-disc ps-4 text-md space-y-1 mb-3 font-normal">
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
              <p className="text-md font-normal mt-2">
                We reserve the right to remove or restrict content at our sole
                discretion.
              </p>
            </li>
            <li className="font-semibold">
              Intellectual Property
              <p className="text-md font-normal mt-2">
                All content and materials on the Service (excluding InstantLinX,
                search results, and User Content) are the property of PGL
                Resources or its licensors and are protected by copyright,
                trademark, and other intellectual property laws. You may not
                copy, modify, distribute, or create derivative works from our
                content without our express written permission.
              </p>
            </li>
            <li className="font-semibold">
              Acceptable Use
              <p className="text-md mb-3 font-normal mt-2">
                You agree to use the Service for lawful purposes only. You may
                not:
              </p>
              <ul className="list-disc ps-4 text-md space-y-1 font-normal">
                <li>
                  Access or use the Service for any unauthorized or illegal
                  purpose;
                </li>
                <li>
                  Attempt to gain unauthorized access to other users’ accounts
                  or our systems;
                </li>
                <li>
                  Use automated systems (e.g., bots, scrapers) without written
                  permission.
                </li>
              </ul>
            </li>
            <li className="font-semibold">
              Termination
              <p className="text-md font-normal mt-2">
                We may suspend or terminate your access to the Service at any
                time, with or without notice, for conduct that we believe
                violates this Agreement or is otherwise harmful to other users
                or to the Service.
              </p>
            </li>
            <li className="font-semibold">
              Disclaimer of Warranties
              <p className="text-md font-normal mt-2">
                THE SERVICE IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS.
                TO THE FULLEST EXTENT PERMITTED BY LAW, PGL RESOURCES EXPRESSLY
                DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT
                LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                PARTICULAR PURPOSE, TITLE, AND NON- INFRINGEMENT. WE MAKE NO
                WARRANTY THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE,
                OR ERROR-FREE, NOR DO WE GUARANTEE THE ACCURACY OR RELIABILITY
                OF ANY CONTENT. YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK.
              </p>
            </li>
            <li className="font-semibold">
              Health Information Disclaimer
              <p className="text-md font-normal mt-2">
                Certain content on this Site may pertain to health-related
                topics. All such content is provided for informational purposes
                only and is not intended as a substitute for professional
                medical advice, diagnosis, or treatment. Always seek the advice
                of your physician or other qualified healthcare provider with
                any questions you may have. Never disregard professional medical
                advice or delay seeking it based on content found on ZillionLinX
                or its links. If you believe you are experiencing a medical
                emergency, call 911 immediately. Reliance on any information
                provided by ZillionLinX is solely at your own risk.
              </p>
            </li>
            <li className="font-semibold">
              Legal Information Disclaimer
              <p className="text-md font-normal mt-2">
                Some content on this Site may relate to legal topics. This
                content is provided for general informational purposes only and
                does not constitute legal advice. No attorney-client
                relationship is created. You should not act or refrain from
                acting based on any information found on ZillionLinX without
                first consulting a qualified attorney. We make no warranties
                regarding the accuracy or completeness of any legal content. Any
                reliance is at your own risk.
              </p>
            </li>
            <li className="font-semibold">
              Limitation of Liability
              <p className="text-md font-normal mt-2">
                TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, PGL RESOURCES
                AND ITS AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES,
                INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL,
                ARISING FROM (i) YOUR USE OF OR INABILITY TO USE THE SERVICE;
                (ii) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY; OR (iii)
                UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS. IN
                NO EVENT SHALL OUR TOTAL LIABILITY EXCEED $100.
              </p>
            </li>
            <li className="font-semibold">
              Indemnity
              <p className="text-md font-normal mt-2">
                You agree to indemnify, defend, and hold harmless PGL Resources,
                its affiliates, officers, employees, and agents from any claims,
                liabilities, damages, losses, and expenses (including legal
                fees) arising out of your use of the Service or violation of
                this Agreement.
              </p>
            </li>
            <li className="font-semibold">
              Changes to this Agreement
              <p className="text-md font-normal mt-2">
                We may update this Agreement from time to time. Material changes
                will be communicated, and continued use of the Service after
                such updates constitutes acceptance of the revised terms.
              </p>
            </li>
            <li className="font-semibold">
              Governing Law and Dispute Resolution
              <p className="text-md font-normal mt-2">
                This Agreement shall be governed by the laws of the State of
                Florida, without regard to conflict of laws principles. Any
                dispute shall be resolved exclusively in the state or federal
                courts located in Miami-Dade County, Florida. At our sole
                discretion, we may require binding arbitration in accordance
                with the rules of the American Arbitration Association.
              </p>
            </li>
            <li className="font-semibold">
              General Disclaimer
              <p className="text-md font-normal mt-2">
                ZILLIONLINX, INCLUDING ALL CONTENT AND SERVICES PROVIDED THROUGH
                OR IN CONNECTION WITH IT, IS OFFERED ON AN AS IS AND AS
                AVAILABLE BASIS WITHOUT WARRANTIES OF ANY KIND. TO THE FULLEST
                EXTENT PERMITTED BY LAW, PGL RESOURCES EXPRESSLY DISCLAIMS ALL
                WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
                WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE,
                CONTENT, OR SERVERS ARE ERROR-FREE OR FREE FROM VIRUSES OR OTHER
                HARMFUL COMPONENTS. USE OF ZILLIONLINX IS ENTIRELY AT YOUR OWN
                RISK.
              </p>
            </li>
            <li className="font-semibold">
              Contact Us
              <p className="text-md font-normal mt-2">
                If you have any questions or concerns regarding this Agreement,
                please contact us at:
              </p>
              <span className="font-normal">Email:</span>
              <a
                href="mailto:support@zillionlinx.com"
                className="font-normal hover:text-dark-blue ml-1"
              >
                support@zillionlinx.com
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserAgreement;
