"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useShowNav } from "@/hooks/showNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMessage,
  faHeart,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const BottomNavigation = () => {
  const router = useRouter();
  const { showNav, hideNav } = useShowNav();

  // Define navigation items
  const navItems = [
    { label: "Home", icon: faHome, route: "/feed" },
    { label: "Search", icon: faHeart, route: "/likes" },
    { label: "Matches", icon: faMessage, route: "/chat" },
    { label: "Profile", icon: faUser, route: "/profile" },
  ];

  if (hideNav) return null;

  return (
    <div
      className={`${
        showNav && "fixed bottom-0 left-0 right-0"
      }  bg-white border-t shadow-lg flex justify-around  z-50`}
    >
      {navItems.map((item) => (
        <motion.button
          key={item.route}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push(item.route)}
          className={`flex flex-col items-center   `}
        >
          <FontAwesomeIcon
            icon={item.icon}
            className="text-2xl px-5  py-7 mb-1"
          />
        </motion.button>
      ))}
    </div>
  );
};

export default BottomNavigation;
