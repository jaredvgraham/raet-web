"use client";

import React, { useState, useEffect, useRef } from "react";

// import Header from "@/components/header";
// import Notification from "@/components/Notification";

import { Profile } from "@/types";
import SwipeableCard from "@/components/feed/SwipeableCard";
import { useAuthFetch } from "@/hooks/privFetch";
import { send } from "vite";
import { sendLocation } from "@/utils/sendLocation";

const SwipeableCardDeck: React.FC = () => {
  const authFetch = useAuthFetch();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      console.log("latitude", latitude);
      console.log("longitude", longitude);

      setLocation({ latitude, longitude });

      sendLocation(latitude, longitude, authFetch);
    };

    const handleError = (err: GeolocationPositionError) => {
      setError(err.message);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await authFetch("/feed");
      const data = await res.json();
      setProfiles(data.feed);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: string) => {
    const profile = profiles[currentProfileIndex];
    if (!profile) return;

    try {
      await authFetch("/api/feed/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ swipedId: profile.clerkId, direction }),
      });

      setCurrentProfileIndex((prev) => Math.min(prev + 1, profiles.length - 1));
    } catch (error) {
      console.error("Error handling swipe:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (currentProfileIndex >= profiles.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        {/* <Header /> */}
        <p>No more profiles left.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* <Header />
      {notification.visible && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, visible: false })}
        />
      )} */}
      <div className="relative w-full h-4/5">
        {profiles.map((profile, index) => {
          if (index < currentProfileIndex) return null;

          return (
            <SwipeableCard
              key={profile._id}
              profile={profile}
              onSwipeRight={() => handleSwipe("right")}
              onSwipeLeft={() => handleSwipe("left")}
              isCurrentCard={index === currentProfileIndex}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SwipeableCardDeck;
