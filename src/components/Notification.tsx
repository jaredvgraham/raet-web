"use client";

import React, { useEffect } from "react";

type NotificationProps = {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  duration?: number; // duration in milliseconds (optional, default is 5 seconds)
};

const Notification = ({
  message,
  type,
  onClose,
  duration = 5000, // Default duration is 5 seconds
}: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer); // Cleanup the timer when the component unmounts
  }, [onClose, duration]);

  // Define type-based styles
  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "info":
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div
      className={` fixed top-5 left-1/2 transform -translate-x-1/2 z-50 shadow-lg rounded-md text-white p-4 px-6 ${getBackgroundColor()}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:opacity-80 focus:outline-none"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Notification;
