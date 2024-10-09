import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Raet Privacy Policy</h1>
        <p className="font-semibold mb-2">Effective Date: 10/08/2024</p>

        <section className="mt-6 space-y-6">
          <p>
            Raet ("we", "us", "our") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you use our dating app, Raet (the
            "App"). Please read this policy carefully to understand our
            practices regarding your personal data and how we will treat it. By
            using Raet, you agree to the collection and use of information as
            described in this Privacy Policy.
          </p>

          <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
          <p>
            We collect the following types of information when you use the Raet
            app:
          </p>

          <h3 className="text-xl font-semibold">1.1 Personal Information</h3>
          <p>
            - **Profile Information**: When you sign up for Raet, we collect
            information such as your name, email address, date of birth, gender,
            and photos. <br />
            - **Location Data**: We collect your geolocation data to show nearby
            matches. <br />- **Preferences**: Information regarding your
            preferences, such as who you are interested in matching with
            (gender, age range, etc.).
          </p>

          <h3 className="text-xl font-semibold">1.2 Usage Data</h3>
          <p>
            - **App Interactions**: Information on how you use the app,
            including interactions with other users, matches, swipes, and
            messages. <br />- **Device Information**: Details about the device
            you use to access the app, such as your IP address, device type,
            operating system, and browser type.
          </p>

          <h3 className="text-xl font-semibold">1.3 Photos and Media</h3>
          <p>
            - We collect and store the photos you upload and share through the
            app.
          </p>

          <h2 className="text-2xl font-semibold">
            2. How We Use Your Information
          </h2>
          <p>
            Raet uses the information we collect to provide, operate, and
            improve the app. This includes:
          </p>
          <ul className="list-disc ml-5 mt-2">
            <li>Displaying your profile to other users.</li>
            <li>
              Matching you with other users based on your location and
              preferences.
            </li>
            <li>Improving the app’s performance and user experience.</li>
            <li>
              Communicating with you regarding updates, promotions, and support.
            </li>
            <li>
              Protecting against fraud, abuse, and other harmful activities.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold">
            3. How We Share Your Information
          </h2>
          <p>
            We may share your information with third parties in the following
            cases:
          </p>
          <ul className="list-disc ml-5 mt-2">
            <li>
              **Service Providers**: We may share your information with
              third-party service providers who help us operate the app (e.g.,
              hosting services, payment processors).
            </li>
            <li>
              **Legal Requirements**: We may share your information if required
              by law or if we believe that sharing is necessary to comply with
              legal obligations.
            </li>
            <li>
              **Business Transfers**: In the event of a merger, acquisition, or
              sale of assets, we may transfer your information to the new owner.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold">4. Data Security</h2>
          <p>
            We take reasonable measures to protect your personal information.
            However, no system is completely secure, and we cannot guarantee the
            security of your data. You are responsible for keeping your password
            and account information secure.
          </p>

          <h2 className="text-2xl font-semibold">5. Your Rights and Choices</h2>
          <p>
            You have the following rights regarding your personal information:
          </p>
          <ul className="list-disc ml-5 mt-2">
            <li>
              **Access and Correction**: You can access and update your personal
              information by logging into your account settings.
            </li>
            <li>
              **Data Deletion**: You can request the deletion of your account
              and data by contacting us at support@raet.io.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold">6. Children's Privacy</h2>
          <p>
            Raet is not intended for use by individuals under the age of 18. We
            do not knowingly collect personal information from children under
            18. If you are under 18, please do not use the app or provide any
            personal information to us.
          </p>

          <h2 className="text-2xl font-semibold">
            7. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page, and we will notify you of any material
            changes via the app or email. Your continued use of the app after
            such changes signifies your acceptance of the updated Privacy
            Policy.
          </p>

          <h2 className="text-2xl font-semibold">8. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy,
            please contact us at:
            <br />
            Email: support@raet.io
            <br />
            Address: 75 Raymond RD, 02360
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
