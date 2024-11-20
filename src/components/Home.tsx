"use client";

import { useShowNav } from "@/hooks/showNav";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { setHideNav } = useShowNav();

  // Hide bottom navigation for this page
  setHideNav(true);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-blue-600 to-teal-500 text-white py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl font-extrabold leading-tight">
            Transform Your Dating Experience
          </h1>
          <p className="mt-6 text-lg font-light">
            Discover meaningful connections effortlessly with{" "}
            <span className="font-semibold">Raet</span>. Add it to your home
            screen for instant access.
          </p>
          <div className="mt-8">
            <button
              onClick={() =>
                document
                  .getElementById("how-to-add")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-white text-blue-600 font-semibold px-10 py-4 rounded-full shadow-md hover:shadow-lg hover:bg-gray-200 transition duration-300"
            >
              Learn How to Add
            </button>
          </div>
        </div>
        <div className="absolute bottom-[-20px] w-full overflow-hidden leading-none transform translate-y-1">
          <svg
            className="relative block w-full h-[80px] text-white"
            viewBox="0 0 1200 120"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.45C387.42,45.88,453.45,29.22,516.73,16.35c95.57-19.73,191.74-21.16,287.19-1.85,67.81,13.79,132.76,37.94,200.57,46.74,69.36,9.01,140.79-2.88,209.6-19.16V120H0V93.65C73.92,68.78,150.64,71.73,223.85,82.24c40.44,6.09,81.7,14.56,121.54,11.7,34.87-2.41,68.89-12.09,101.47-21.92Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </header>

      {/* App Preview Section */}
      <section id="app-preview" className="py-20 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-800">
            Experience Raet in Action
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            See how Raet makes dating smarter, faster, and better.
          </p>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Placeholder Images */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 p-6">
              <Image
                src="/feed.png"
                alt="Feed preview"
                width={300}
                height={200}
                className="rounded-lg mx-auto"
              />
              <h3 className="text-xl font-semibold mt-6">Personalized Feed</h3>
              <p className="text-gray-500 mt-3">
                Get curated matches that align with your unique preferences.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 p-6">
              <Image
                src="/chat.png"
                alt="Chat preview"
                width={300}
                height={200}
                className="rounded-lg mx-auto"
              />
              <h3 className="text-xl font-semibold mt-6">Seamless Chat</h3>
              <p className="text-gray-500 mt-3">
                Start meaningful conversations in real-time.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 p-6">
              <Image
                src="/profile.png"
                alt="Profile preview"
                width={300}
                height={200}
                className="rounded-lg mx-auto"
              />
              <h3 className="text-xl font-semibold mt-6">Rich User Profiles</h3>
              <p className="text-gray-500 mt-3">
                Dive deep into detailed profiles with ratings and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section id="how-to-add" className="py-20 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-800">
            Add Raet to Your Home Screen
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            Learn how to add Raet for seamless access.
          </p>
          <div className="mt-10">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/zU9n0WOyb8g" // Replace with your YouTube video ID
              title="How to Add Raet"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-xl shadow-lg w-full max-w-3xl mx-auto"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-700 text-white py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-extrabold">
            Ready to Transform Your Dating Experience?
          </h2>
          <p className="text-lg font-light mt-4">
            Join thousands of users finding meaningful connections.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() =>
                alert(
                  "Tap the share button on your browser and select 'Add to Home Screen'."
                )
              }
              className="bg-white text-blue-700 font-semibold px-8 py-4 rounded-full shadow-md hover:shadow-lg hover:bg-gray-200 transition duration-300"
            >
              Learn How to Add
            </button>
            <Link
              href="/sign-up"
              className="bg-teal-400 text-white font-semibold px-8 py-4 rounded-full shadow-md hover:shadow-lg hover:bg-teal-300 transition duration-300"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Raet. All rights reserved.</p>
          <div className="mt-4">
            <Link
              href="/privacy-policy"
              className="text-teal-400 hover:underline mx-2"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-teal-400 hover:underline mx-2">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
