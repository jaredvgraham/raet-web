// pages/index.js

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-teal-400 to-teal-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">Find Your Perfect Match Faster</h1>
          <p className="mt-4 text-lg">
            A smarter way to date—connect with the right people, quicker than
            ever before.
          </p>
          <div className="mt-8">
            <a
              href="#features"
              className="bg-white text-teal-600 font-semibold px-6 py-3 rounded-full mr-4"
            >
              Mobile coming soon..
            </a>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Why Choose Our App?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            We make finding your match easier, faster, and more enjoyable.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="text-teal-600 text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Efficient Matching</h3>
              <p className="text-gray-600">
                Focus on profiles that matter and connect with those that match
                your dating preferences quickly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="text-teal-600 text-5xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Community Ratings</h3>
              <p className="text-gray-600">
                Our user-driven rating system ensures you meet people highly
                rated by others, improving connection quality.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="text-teal-600 text-5xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">
                Seamless Experience
              </h3>
              <p className="text-gray-600">
                With a modern design and user-friendly interface, your dating
                journey will be effortless and enjoyable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {/* <section className="bg-teal-600 text-white py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold">Ready to Find Someone Special?</h2>
          <p className="mt-4 text-lg">
            Join our app today and start connecting with people who fit your
            preferences.
          </p>
          <div className="mt-8">
            <a
              href="/signup"
              className="bg-white text-teal-600 font-semibold px-6 py-3 rounded-full"
            >
              Get Started
            </a>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
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
