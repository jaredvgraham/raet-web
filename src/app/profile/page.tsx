"use client";

import React, { useEffect, useState } from "react";
import { useAuthFetch } from "@/hooks/privFetch";
import Header from "@/components/Header";

import SwipeableCard from "@/components/feed/SwipeableCard";

import { Profile } from "@/types";
import ProfileData from "@/components/Profile/ProfileData";

const ProfilePage = () => {
  const authFetch = useAuthFetch();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preview, setPreview] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const SCREEN_WIDTH = window.innerWidth;
  const SCREEN_HEIGHT = window.innerHeight;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authFetch("/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("response", response);

        setProfile(response.profile);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchData();
  }, []);

  const handleImageTap = (tapX: number) => {
    const isRightTap = tapX > SCREEN_WIDTH / 2;

    if (profile) {
      if (isRightTap) {
        // Go to the next image if it's not the last one
        if (currentImageIndex < profile.images.length - 1) {
          setCurrentImageIndex((prev) => prev + 1);
        }
      } else {
        // Go to the previous image if it's not the first one
        if (currentImageIndex > 0) {
          setCurrentImageIndex((prev) => prev - 1);
        }
      }
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-lg text-gray-500">Loading Profile...</p>
      </div>
    );
  }

  return (
    <>
      {preview ? (
        <div className="flex flex-col items-center h-full  overflow-x-hidden    ">
          <Header />
          <div className="relative w-full h-4/5">
            <SwipeableCard
              key={profile._id}
              index={0}
              profile={profile}
              onSwipeRight={() => null}
              onSwipeLeft={() => null}
              isCurrentCard={true}
              setRate={() => null}
              rate={null}
              onPressDetails={() => null}
              setProfiles={() => null}
              setCurrentProfileIndex={() => null}
              setPreview={setPreview}
              preview={preview}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full overflow-auto bg-gray-100">
          <ProfileData profile={profile} setPreview={setPreview} />
        </div>
      )}
    </>
  );
};

export default ProfilePage;
