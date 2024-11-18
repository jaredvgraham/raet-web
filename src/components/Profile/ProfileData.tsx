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

type ProfileDataProps = {
  profile: Profile;
  setPreview: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileData = ({ profile, setPreview }: ProfileDataProps) => {
  const [editing, setEditing] = useState(false);
  const authFetch = useAuthFetch();
  const [city, setCity] = useState<string | undefined>();
  const [blockedUsers, setBlockedUsers] = useState<Profile[]>([]);
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);

  useEffect(() => {
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
    getBlockedUsers();
  }, [profile?.location, authFetch]);

  const sendData = async (updatedProfile: Profile) => {
    try {
      const formData = new FormData();

      formData.append("name", updatedProfile.name);
      if (updatedProfile.bio) formData.append("bio", updatedProfile.bio);
      formData.append("preferredGender", updatedProfile.preferredGender);
      formData.append("maxDistance", updatedProfile.maxDistance.toString());
      formData.append("interests", updatedProfile.interests.join(","));

      for (const image of updatedProfile.images) {
        formData.append("images", image); // Assuming `image` is a string
      }

      const response = await authFetch("/user/profile", {
        method: "PATCH",
        body: formData,
      });

      console.log("Profile updated successfully:", response);
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
    <div className="overflow-y-auto ">
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
            <div className="flex flex-col bg-gray-100 p-6 h-full overflow-auto">
              {profile.images ? (
                <>
                  <button
                    className="absolute top-3 right-2 bg-gray-200 p-2 rounded-full"
                    onClick={() => setPreview(true)}
                  >
                    Preview
                  </button>
                  <Image
                    src={profile.images[0]}
                    alt={profile.name}
                    width={150}
                    height={150}
                    className="rounded-full object-cover self-center "
                  />
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