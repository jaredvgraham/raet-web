"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useShowNav } from "@/hooks/showNav";

const BottomNavigation = () => {
  const router = useRouter();
  const { showNav } = useShowNav();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Define navigation items
  const navItems = [
    { label: "Home", icon: "/icons/home.svg", route: "/feed" },
    { label: "Search", icon: "/icons/search.svg", route: "/likes" },
    { label: "Matches", icon: "/icons/matches.svg", route: "/chat" },
    { label: "Profile", icon: "/icons/profile.svg", route: "/profile" },
  ];

  useEffect(() => {
    const handleResize = () => {
      // Compare the viewport height to a threshold to detect if the keyboard is open
      const fullHeight = window.innerHeight;
      const viewportHeight = document.documentElement.clientHeight;

      setKeyboardVisible(viewportHeight < fullHeight * 0.8); // Adjust threshold as needed
    };

    // Add and clean up the resize listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!showNav || keyboardVisible) {
    return null; // Hide navigation bar
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-around py-5 z-50">
      {navItems.map((item) => (
        <motion.button
          key={item.route}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push(item.route)}
          className="flex flex-col items-center"
        >
          <img
            src={item.icon}
            alt={item.label}
            className="w-6 h-6 mb-1"
            draggable={false}
          />
          <span className="text-xs">{item.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default BottomNavigation;
