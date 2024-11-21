"use client";

import { useShowNav } from "@/hooks/showNav";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { setHideNav } = useShowNav();

  // Hide bottom navigation for this page
  setHideNav(true);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <nav className="bg-white shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link href="/" className="text-2xl font-extrabold text-gray-800">
            <Image src="/r-logo.png" alt="logo" width={40} height={40} />
          </Link>
          <div className="flex space-x-6">
            <Link
              href="/sign-up"
              className="text-gray-600 hover:text-teal-500 font-medium transition"
            >
              Sign Up
            </Link>
            <Link
              href="/sign-in"
              className="text-gray-600 hover:text-teal-500 font-medium transition"
            >
              Log In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-white to-teal-200 text-gray-700 py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-gray-800">
            Transform Your Dating Experience
          </h1>
          <p className="mt-6 text-lg md:text-xl font-light text-gray-600">
            Discover meaningful connections effortlessly with{" "}
            <span className="font-semibold text-teal-600">Raet</span>. Add it to
            your home screen for instant access.
          </p>
          <div className="mt-8">
            <button
              onClick={() =>
                document
                  .getElementById("how-to-add")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-teal-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-teal-400 transition"
            >
              Learn How to Add
            </button>
          </div>
        </div>
      </header>

      {/* App Preview Section */}
      <section id="app-preview" className="py-16 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800">
            Experience Raet in Action
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            See how Raet makes dating smarter, faster, and better.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                src: "/feed.png",
                title: "Personalized Feed",
                description:
                  "Get curated matches that align with your unique preferences.",
              },
              {
                src: "/chat.png",
                title: "Seamless Chat",
                description: "Start meaningful conversations in real-time.",
              },
              {
                src: "/profile.png",
                title: "Rich User Profiles",
                description:
                  "Dive deep into detailed profiles with ratings and preferences.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-black  rounded-xl shadow-lg hover:shadow-xl transition p-6"
              >
                <Image
                  src={item.src}
                  alt={`${item.title} preview`}
                  width={300}
                  height={200}
                  className="rounded-lg mx-auto"
                />
                <h3 className="text-xl font-semibold mt-6 text-gray-300">
                  {item.title}
                </h3>
                <p className="text-gray-300 mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section id="how-to-add" className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Add Raet to Your Home Screen
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Learn how to add Raet for seamless access without the app store.
          </p>
          <div className="mt-8">
            <iframe
              src="https://www.youtube.com/embed/zU9n0WOyb8g"
              title="How to Add Raet"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full max-w-4xl mx-auto aspect-video rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {/* Call to Action */}
      <section className="bg-black text-gray-200 py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-extrabold">
            Ready to Transform Your Dating Experience?
          </h2>
          <p className="text-lg font-light mt-4">
            Join thousands of users finding meaningful connections.
          </p>
          <div className="mt-8 p-5 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/sign-up"
              className="bg-teal-400 text-white font-semibold px-8 py-4 rounded-full shadow-md hover:shadow-lg hover:bg-teal-300 transition duration-300"
            >
              Sign Up Now
            </Link>
            <Link
              href="/sign-in"
              className="border border-teal-400 text-teal-400 font-semibold px-8 py-4 rounded-full hover:bg-teal-400 hover:text-white transition duration-300"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-white to-teal-200 text-gray-400 py-8">
        <div className="container mx-auto text-center text-gray-700">
          <p>&copy; {new Date().getFullYear()} Raet. All rights reserved.</p>
          <div className="mt-4 space-x-6">
            <Link href="/privacy-policy" className="text-black hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-black hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
