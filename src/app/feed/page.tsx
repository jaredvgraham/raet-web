"use client";

import React, { useState, useEffect, useRef } from "react";

// import Header from "@/components/header";
// import Notification from "@/components/Notification";

import { Profile } from "@/types";
import SwipeableCard from "@/components/feed/SwipeableCard";
import { useAuthFetch } from "@/hooks/privFetch";

import { sendLocation } from "@/utils/sendLocation";
import Header from "@/components/Header";
import Notification from "@/components/Notification";

const SwipeableCardDeck = () => {
  const authFetch = useAuthFetch();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [rate, setRate] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    console.log("profiles", profiles);
  }, [profiles]);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    const handleSuccess = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      console.log("latitude", latitude);
      console.log("longitude", longitude);

      setLocation({ latitude, longitude });

      await sendLocation(latitude, longitude, authFetch);
      fetchProfiles();
    };

    const handleError = (err: GeolocationPositionError) => {
      setError(err.message);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await authFetch("/feed");
      console.log("res", res);

      if (res.feed.length === 0) {
        return;
      }

      setProfiles(res.feed);
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
      const res = await authFetch("/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ swipedId: profile.clerkId, direction, rate }),
      });

      //   setCurrentProfileIndex((prev) => Math.min(prev + 1, profiles.length - 1));

      if (res.message && res.message.includes("Match")) {
        // Display a toast notification for a match
        setNotification({
          visible: true,
          message: `${res.message} 🎉`,
          type: "success",
        });
      }

      setRate(null);
      setProfiles((prev) => prev.slice(1));

      if (profiles.length <= 2) {
        fetchProfiles();
      }
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

  if (currentProfileIndex >= profiles.length || profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        {/* <Header /> */}
        <p>No more profiles left.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-full main-ctn  ">
      <Header />
      {notification.visible && (
        <Notification
          message={notification.message}
          type={notification.type as "success" | "error" | "info"}
          onClose={() => setNotification({ ...notification, visible: false })}
        />
      )}
      {/* <Header />
      {notification.visible && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, visible: false })}
        />
      )} */}
      <div className="relative w-full h-4/5 ">
        {profiles.map((profile, index) => {
          if (index < currentProfileIndex) return null;

          return (
            <SwipeableCard
              key={profile._id}
              profile={profile}
              onSwipeRight={() => handleSwipe("right")}
              onSwipeLeft={() => handleSwipe("left")}
              isCurrentCard={index === currentProfileIndex}
              setRate={setRate}
              rate={rate}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SwipeableCardDeck;
