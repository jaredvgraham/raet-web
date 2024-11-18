"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useShowNav } from "@/hooks/showNav";

const BottomNavigation = () => {
  const router = useRouter();
  const { showNav } = useShowNav();

  // Define navigation items
  const navItems = [
    { label: "Home", icon: "/icons/home.svg", route: "/feed" },
    { label: "Search", icon: "/icons/search.svg", route: "/likes" },
    { label: "Matches", icon: "/icons/matches.svg", route: "/chat" },
    { label: "Profile", icon: "/icons/profile.svg", route: "/profile" },
  ];

  return (
    <div
      className={`${
        showNav && "fixed bottom-0 left-0 right-0"
      }  bg-white border-t shadow-lg flex justify-around py-3 z-50`}
    >
      {navItems.map((item) => (
        <motion.button
          key={item.route}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push(item.route)}
          className={`flex flex-col items-center `}
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
