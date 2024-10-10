import React from "react";

const Support = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Support Center</h1>
        <h2 className="text-2xl font-semibold mb-4">
          Frequently Asked Questions
        </h2>
        <ul className="list-disc ml-5 space-y-4">
          <li>
            <strong>How do I reset my password?</strong> - Visit the settings
            page and click &quot;Forgot Password&quot;.
          </li>
          <li>
            <strong>How do I delete my account?</strong> - You can delete your
            account from the app settings.
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mt-10 mb-4">Contact Us</h2>
        <p>
          If you have any other questions, please email us at{" "}
          <a href="mailto:support@raet.io" className="text-teal-500">
            support@raet.io
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Support;
