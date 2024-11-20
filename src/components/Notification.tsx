"use client";

import { on } from "events";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type NotificationProps = {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  duration?: number; // duration in milliseconds (optional, default is 5 seconds)
  link?: string;
};

const Notification = ({
  message,
  type,
  onClose,
  duration = 5000, // Default duration is 5 seconds
  link,
}: NotificationProps) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer); // Cleanup the timer when the component unmounts
  }, [onClose, duration]);

  // Define type-based styles
  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-600";
      case "error":
        return "bg-red-500";
      case "info":
      default:
        return "bg-blue-500";
    }
  };

  const handleNotificationClick = () => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 transform  shadow-xl  text-white p-4 px-6 flex items-center gap-4 ${getBackgroundColor()}`}
      style={{
        zIndex: 9999,
        animation: "fadeIn 0.3s ease-in-out",
      }}
      onClick={handleNotificationClick}
    >
      {/* Notification Icon */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-opacity-30">
        <span role="img" aria-label="Notification">
          🔔 {/* Replace with any emoji or icon */}
        </span>
      </div>

      {/* Notification Message */}
      <div className="flex-1">
        <span className="text-base font-medium">{message}</span>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="text-lg text-white hover:opacity-80 focus:outline-none"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
};

export default Notification;
