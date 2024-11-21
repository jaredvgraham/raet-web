"use client";

import React, { useEffect, useState } from "react";
import { useAuthFetch } from "@/hooks/privFetch";
import { Profile } from "@/types";

// import DeleteAccount from "./DeleteAccount";
// import BlockedUsers from "./BlockedUsers";
import {
  FaEnvelope,
  FaCalendar,
  FaInfo,
  FaVenusMars,
  FaHeart,
  FaSearch,
  FaMapMarkerAlt,
  FaUsers,
  FaBan,
} from "react-icons/fa";
import Image from "next/image";
import { getCityFromLocation } from "@/utils";
import Header from "../Header";
import EditProfileScreen from "./EditProfileScreen";
import { SignOutButton } from "@clerk/nextjs";
import { useNotification } from "@/hooks/webPush";
import { PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { deleteBlob } from "@/utils/deleteBlob";

type ProfileDataProps = {
  profile: Profile;
  setPreview: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileData = ({ profile, setPreview }: ProfileDataProps) => {
  const { isSubscribed, subscribeToNotifications } = useNotification();
  const [editing, setEditing] = useState(false);

  const authFetch = useAuthFetch();
  const [city, setCity] = useState<string | undefined>();
  const [blockedUsers, setBlockedUsers] = useState<Profile[]>([]);
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    setExistingImages(profile.images || []);

    const getCity = async () => {
      const cityName = await getCityFromLocation(
        profile?.location?.coordinates[1],
        profile?.location?.coordinates[0]
      );

      if (cityName) {
        setCity(cityName || "Unknown Location");
      }
    };

    const getBlockedUsers = async () => {
      try {
        const response = await authFetch("/api/block", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response?.json();
        setBlockedUsers(data.blockedUsers);
      } catch (error) {
        console.error("Error fetching blocked users:", error);
      }
    };

    getCity();
    // getBlockedUsers();
  }, [profile?.location, authFetch]);

  const sendData = async (updatedProfile: Profile) => {
    try {
      const keptImages = updatedProfile.images.filter((image) =>
        existingImages.includes(image)
      );

      const newImages = updatedProfile.images.filter(
        (image) => !existingImages.includes(image)
      );

      const deletedImages = existingImages.filter(
        (image) =>
          !updatedProfile.images.includes(image) && !newImages.includes(image)
      );

      if (deletedImages) {
        await authFetch("/avatar/delete", {
          method: "DELETE",
          body: JSON.stringify({
            urls: deletedImages,
          }),
        });
      }

      if (newImages) {
        const uploadedBlobUrls = await Promise.all(
          newImages.map(async (file: any) => {
            const newBlob: PutBlobResult = await upload(
              (file as any).name,
              file,
              {
                access: "public",
                handleUploadUrl: "/api/avatar/upload",
              }
            );
            return newBlob.url;
          })
        );

        updatedProfile.images = [...keptImages, ...uploadedBlobUrls];
      }

      const response = await authFetch("/user/profile", {
        method: "PATCH",
        body: JSON.stringify({
          ...updatedProfile,
          imageUrls: updatedProfile.images,
        }),
      });

      console.log("Profile updated successfully:", response);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  //   if (showBlockedUsers) {
  //     return (
  //       <BlockedUsers
  //         initialBlockedUsers={blockedUsers}
  //         setShowBlockedUsers={setShowBlockedUsers}
  //       />
  //     );
  //   }

  return (
    <div className="overflow-y-auto bg-white ">
      <Header />
      <div className="overflow-y-auto flex justify-evenly">
        {editing ? (
          <EditProfileScreen
            profile={profile}
            onSave={(updatedProfile: any) => {
              sendData(updatedProfile);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <>
            <div className="flex flex-col   p-6 h-full overflow-auto">
              {!isSubscribed && (
                <button
                  onClick={subscribeToNotifications}
                  className="bg-green-500 mb-2 text-white p-4 rounded-full items-center"
                >
                  <p className="text-lg font-bold">Allow Notifications</p>
                </button>
              )}
              {profile.images ? (
                <>
                  <button
                    className="absolute top-3 right-2 bg-gray-200 p-2 rounded-full"
                    onClick={() => setPreview(true)}
                  >
                    Preview
                  </button>
                  <div className=" relative w-40 h-40 rounded-full bg-gray-200 self-center">
                    <Image
                      src={profile.images[0]}
                      alt={profile.name}
                      fill
                      className="rounded-full object-cover self-center w-full h-full "
                    />
                  </div>
                </>
              ) : (
                <p className="text-4xl text-white">No Image</p>
              )}
              <p className="mt-2  text-2xl font-bold text-gray-800 text-center">
                {profile.name}
              </p>
              <p className="text-lg text-center text-gray-600 mt-1">
                {city || "Unknown Location"}
              </p>

              <div className="mt-5 px-5">
                <div className="flex items-center mb-4">
                  <FaEnvelope size={20} />
                  <p className="ml-3 text-base text-gray-800">
                    {profile.email}
                  </p>
                </div>
                <div className="flex items-center mb-4">
                  <FaCalendar size={20} />
                  <p className="ml-3 text-base text-gray-800">
                    Age: {profile.age}
                  </p>
                </div>
                <div className="flex items-center mb-4">
                  <FaInfo size={20} />
                  <p className="ml-3 text-base text-gray-800">
                    Bio: {profile.bio}
                  </p>
                </div>
                <div className="flex items-center mb-4">
                  <FaVenusMars size={20} />
                  <p className="ml-3 text-base text-gray-800">
                    Gender: {profile.gender}
                  </p>
                </div>
                <div className="flex items-center mb-4">
                  <FaHeart size={20} />
                  <p className="ml-3 text-base text-gray-800">
                    Interests: {profile.interests.join(", ")}
                  </p>
                </div>
                <div className="flex items-center mb-4">
                  <FaSearch size={20} />
                  <p className="ml-3 text-base text-gray-800">
                    Preferred Gender: {profile.preferredGender}
                  </p>
                </div>
                <div className="flex items-center mb-4">
                  <FaMapMarkerAlt size={20} />
                  <p className="ml-3 text-base text-gray-800">
                    Max Distance: {profile.maxDistance} miles
                  </p>
                </div>
                <div className="flex items-center mb-4">
                  <FaUsers size={20} />
                  <p className="ml-3 text-base text-gray-800">
                    Matched Users: {profile.matchedUsers.length}
                  </p>
                </div>
                <button
                  onClick={() => setShowBlockedUsers(true)}
                  className="flex items-center mb-4"
                >
                  <FaBan size={20} />
                  <p className="ml-3 text-base text-gray-800">
                    Blocked Users: {blockedUsers.length}
                  </p>
                </button>
              </div>

              <button
                className={`block lg:hidden mt-7 ${
                  profile.gender === "Male" ? "bg-[#3eaba5]" : "bg-[#ffc0cb]"
                } p-4 mx-5 rounded-full items-center`}
                onClick={() => setEditing(true)}
              >
                <p
                  className={`${
                    profile.gender === "Male" ? "text-white" : "text-gray-600"
                  } text-lg font-bold`}
                >
                  Edit Profile
                </p>
              </button>
              <SignOutButton>
                <p className="text-red-400 text-lg text-center font-bold">
                  Sign Out
                </p>
              </SignOutButton>
              {/* <DeleteAccount userId={profile.clerkId} /> */}
            </div>
          </>
        )}
        <div className="  hidden lg:block ">
          <EditProfileScreen
            profile={profile}
            onSave={(updatedProfile: any) => {
              sendData(updatedProfile);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileData;
