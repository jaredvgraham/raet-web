"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Profile } from "@/types";
import { useAuthFetch } from "@/hooks/privFetch";

import Header from "@/components/Header";
import Notification from "@/components/Notification";
import UserDetailScreen from "@/components/feed/UserDetails";

const LikesPage = () => {
  const [likes, setLikes] = useState<Profile[]>([]);
  const [moreDetails, setMoreDetails] = useState<boolean>(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showNotification, setShowNotification] = useState({
    visible: false,
    message: "",
    type: "",
  });
  const [loading, setLoading] = useState(true);
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching likes");
      try {
        const response = await authFetch("/user/likes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("response", response.likes);

        setLikes(response.likes || []);
      } catch (error) {
        console.error("Error fetching likes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDetailsClick = (profile: Profile) => {
    setSelectedProfile(profile);
    setMoreDetails(true);
  };

  const sendRight = async () => {
    try {
      const data = await authFetch("/feed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          swipedId: selectedProfile?.clerkId,
          direction: "right",
        }),
      });

      if (data.message.message && data.message.message.includes("Match")) {
        setShowNotification({
          visible: true,
          message: `${data.message} 🎉`,
          type: "success",
        });
      }
      setSelectedProfile(null);
      setLikes((prev) =>
        prev.filter((like) => like._id !== selectedProfile?._id)
      );
    } catch (error) {
      console.error("Error swiping right:", error);
    }
  };

  const sendLeft = async () => {
    try {
      await authFetch("/feed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          swipedId: selectedProfile?.clerkId,
          direction: "left",
        }),
      });
      setSelectedProfile(null);
      setLikes((prev) =>
        prev.filter((like) => like._id !== selectedProfile?._id)
      );
    } catch (error) {
      console.error("Error swiping left:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center h-full w-full flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {showNotification.visible && (
        <Notification
          message={showNotification.message}
          type={showNotification.type as "success" | "error"}
          onClose={() =>
            setShowNotification({
              visible: false,
              message: "",
              type: "",
            })
          }
        />
      )}

      {moreDetails && selectedProfile ? (
        <UserDetailScreen
          profile={selectedProfile}
          onClose={() => setMoreDetails(false)}
          onSwipeLeft={() => {
            setMoreDetails(false);
            sendLeft();
          }}
          onSwipeRight={() => {
            setMoreDetails(false);
            sendRight();
          }}
        />
      ) : (
        <div className="flex flex-col h-screen bg-white">
          <Header style="w-full flex items-center justify-center" />
          <h1 className="text-lg text-center text-gray-500 mb-4">
            These Users Like You {likes.length}
          </h1>
          <div className="grid grid-cols-2 gap-2  ">
            {likes.length > 0 ? (
              likes.map((like) => (
                <>
                  <div
                    key={like._id}
                    className="relative w-full mb-4 cursor-pointer "
                    onClick={() => handleDetailsClick(like)}
                  >
                    <Image
                      src={like.images[0]}
                      alt={like.name}
                      width={150}
                      height={150}
                      className="rounded-lg object-cover w-full h-48"
                    />

                    <p className="absolute bottom-0 left-0 bg-black text-white px-2 py-1 rounded z-50">
                      {like.name.split(" ")[0]}
                    </p>
                  </div>
                </>
              ))
            ) : (
              <p className="text-center text-gray-500">No likes yet</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LikesPage;
