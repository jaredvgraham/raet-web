"use client";

import { useNotification } from "@/hooks/webPush";
import React, { useEffect } from "react";

const NotificationToggle = () => {
  const {
    isSubscribed,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    device,
  } = useNotification();

  useEffect(() => {
    if (!isSubscribed) {
      console.log("Attempting to subscribe to notifications...");
      subscribeToNotifications();
    }
  }, [isSubscribed, subscribeToNotifications]);

  return (
    <div>
      <p>Current Device: {device}</p>
      <p>Notifications: {isSubscribed ? "Subscribed" : "Not Subscribed"}</p>
      {isSubscribed && (
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={unsubscribeFromNotifications}
        >
          Unsubscribe
        </button>
      )}
      {!isSubscribed && (
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={subscribeToNotifications}
        >
          Subscribe
        </button>
      )}
    </div>
  );
};

export default NotificationToggle;
