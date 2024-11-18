"use client";
import { SignedIn, SignedOut, useSession } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import SwipeableCardDeck from "./feed/page";
import Home from "@/components/Home";
import { useAuthFetch } from "@/hooks/privFetch";
import Onboarding from "./onboarding/page";

const Page = () => {
  const authFetch = useAuthFetch();
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authFetch("/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.hasProfile) {
          setHasProfile(true);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SignedIn>{hasProfile ? <SwipeableCardDeck /> : <Onboarding />}</SignedIn>
      <SignedOut>
        <Home />
      </SignedOut>
    </>
  );
};

export default Page;
