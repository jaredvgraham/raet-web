"use client";
import { useShowNav } from "@/hooks/showNav";
import React from "react";

type TosProps = {
  setTosModal: (value: boolean) => void;
};

const TermsOfService = ({ setTosModal }: TosProps) => {
  const { setHideNav } = useShowNav();
  setHideNav(true);
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {setTosModal && (
        <button
          onClick={() => {
            setTosModal(false);
          }}
          className="fixed top-4 right-4 bg-white p-2 rounded-full shadow-lg text-red-400"
        >
          X
        </button>
      )}

      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Raet Terms of Service</h1>
        <p className="font-semibold mb-2">Effective Date: 10/08/2024</p>

        <section className="mt-6 space-y-6">
          <p>
            Welcome to Raet, a dating app designed to help you find meaningful
            connections. By using our app, you agree to these Terms of Service
            (&quot;Terms&quot;). If you do not agree to these Terms, you may not
            access or use the app. Please read them carefully.
          </p>

          <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p>
            By creating a Raet account or using the Raet app, you agree to be
            bound by these Terms of Service, our Privacy Policy, and any
            additional terms that may apply. You confirm that you are at least
            18 years old and legally able to enter into these terms.
          </p>

          <h2 className="text-2xl font-semibold">2. Eligibility</h2>
          <p>
            You must be at least 18 years old to use Raet. By using the app, you
            represent and warrant that you are at least 18 years old and that
            you have the right, authority, and capacity to enter into and abide
            by these Terms.
          </p>

          <h2 className="text-2xl font-semibold">3. User Responsibilities</h2>
          <p>
            When using Raet, you agree to provide accurate, truthful, and
            up-to-date information in your profile. Only create one account per
            user. Keep your login credentials secure and confidential. You must
            not use the app for unlawful purposes, including harassment, abuse,
            or fraud. You must not post offensive, harmful, or inappropriate
            content, and you must be respectful in all interactions with other
            users. You are solely responsible for the content and actions that
            occur under your account. Raet is not responsible for any user
            interactions or the content users post.
          </p>

          <h2 className="text-2xl font-semibold">4. Account Termination</h2>
          <p>
            Raet reserves the right to suspend or terminate your account if you
            violate these Terms of Service, engage in behavior that is harmful,
            offensive, or illegal, or if your account is reported for misuse by
            other users. Raet may also terminate or suspend your account at its
            discretion, without notice, if we deem it necessary for the safety
            and well-being of other users.
          </p>

          <h2 className="text-2xl font-semibold">5. User Data Collection</h2>
          <p>
            Raet collects, stores, and processes the following types of data:
            <ul className="list-disc ml-5 mt-2">
              <li>
                Profile Information: Name, email, photos, bio, gender, sexual
                preferences, and age.
              </li>
              <li>
                Location Data: We collect your geolocation to show nearby
                matches.
              </li>
              <li>
                Usage Data: App interactions, messages, matches, and swipes are
                logged to improve user experience.
              </li>
              <li>
                Device Information: Device identifiers, IP address, and
                operating system.
              </li>
              <li>
                Photos and Media: Photos you upload and share through the app.
              </li>
              <li>
                Communications: Messages and interactions with other users.
              </li>
            </ul>
          </p>

          <h2 className="text-2xl font-semibold">6. Community Guidelines</h2>
          <p>
            To maintain a safe and respectful environment, users are expected to
            follow these guidelines:
            <ul className="list-disc ml-5 mt-2">
              <li>No harassment, discrimination, or hate speech.</li>
              <li>
                No spam, phishing, or attempts to solicit personal or financial
                information from other users.
              </li>
              <li>
                No impersonation or misrepresentation of your identity or
                affiliation.
              </li>
              <li>No sexually explicit content or illegal activities.</li>
            </ul>
            Raet reserves the right to review and remove content that violates
            these guidelines, and may terminate your account in case of
            violations.
          </p>

          <h2 className="text-2xl font-semibold">7. In-App Purchases</h2>
          <p>
            Raet offers premium features through in-app purchases, which may
            include but are not limited to:
            <ul className="list-disc ml-5 mt-2">
              <li>Boosting your profile visibility.</li>
              <li>Seeing who liked your profile.</li>
              <li>Sending super likes.</li>
            </ul>
            All purchases are non-refundable, and any recurring subscriptions
            must be managed through your app store settings. By purchasing a
            subscription, you agree to the applicable pricing and payment terms.
          </p>

          <h2 className="text-2xl font-semibold">8. Licenses and Rights</h2>
          <p>
            By using Raet, you grant us a non-exclusive, royalty-free,
            perpetual, and worldwide license to use, modify, reproduce, and
            display your content (such as profile information, photos, and
            interactions) in connection with the services provided by Raet. We
            do not claim ownership of your content, but we may use it to promote
            the app or enhance the user experience.
          </p>

          <h2 className="text-2xl font-semibold">9. Limitation of Liability</h2>
          <p>
            Raet provides a platform for users to connect, but we cannot
            guarantee the behavior or actions of any user. You acknowledge that
            Raet is not liable for:
            <ul className="list-disc ml-5 mt-2">
              <li>
                Any interactions, conversations, or outcomes that occur within
                or outside the app.
              </li>
              <li>
                Any damages, losses, or injuries resulting from the use of the
                app.
              </li>
              <li>The accuracy or reliability of user-generated content.</li>
            </ul>
            You agree to use Raet at your own risk and understand that we are
            not responsible for any harmful interactions or events that may
            occur through the app.
          </p>

          <h2 className="text-2xl font-semibold">10. Dispute Resolution</h2>
          <p>
            In the event of a dispute arising from the use of Raet, both parties
            agree to resolve the issue through binding arbitration in [Insert
            your jurisdiction]. You agree to waive any rights to pursue claims
            in court or through a class action lawsuit.
          </p>

          <h2 className="text-2xl font-semibold">
            11. Changes to the Terms of Service
          </h2>
          <p>
            Raet reserves the right to modify or update these Terms of Service
            at any time. Any changes will be posted in the app, and your
            continued use of the app signifies your acceptance of the updated
            terms. It is your responsibility to review the Terms regularly.
          </p>

          <h2 className="text-2xl font-semibold">12. Contact Us</h2>
          <p>
            If you have any questions or concerns about these Terms of Service,
            you can contact us at:
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

export default TermsOfService;
