import React, { useState } from "react";
import Image from "next/image";
import { Profile } from "@/types";
import { Fa500Px } from "react-icons/fa";

interface UserDetailScreenProps {
  profile: Profile;
  onClose: (value: boolean) => void;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  showButtons?: boolean;
}

const UserDetailScreen = ({
  profile,
  onClose,
  onSwipeRight,
  onSwipeLeft,
  showButtons = true,
}: UserDetailScreenProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle image tap
  const handleImageTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const containerWidth = e.currentTarget.getBoundingClientRect().width;
    const clickPosition = e.nativeEvent.offsetX;

    if (clickPosition > containerWidth / 2) {
      // Go to the next image
      setActiveIndex((prev) =>
        prev < profile.images.length - 1 ? prev + 1 : prev
      );
    } else {
      // Go to the previous image
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  return (
    <div className="relative flex flex-col h-screen bg-white overflow-hidden">
      {/* Image Section */}
      <div
        className="relative h-[400px] w-full"
        onClick={handleImageTap} // Add the click handler here
      >
        <div className="w-full h-full overflow-hidden">
          <Image
            src={profile.images[activeIndex]}
            alt={`${profile.name}'s photo`}
            layout="fill"
            objectFit="cover"
          />
        </div>

        {/* Dots for Image Indicators */}
        <div className="absolute top-3 left-0 right-0 flex justify-center z-10">
          {profile.images.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 mx-1 rounded-full ${
                index === activeIndex ? "bg-black" : "bg-gray-300 opacity-35"
              }`}
            />
          ))}
        </div>

        {/* Swipe Buttons */}
        {showButtons && (
          <>
            <button
              className="absolute bottom-5 left-5 bg-gray-100 p-2 rounded-full z-50"
              onClick={(e) => {
                e.stopPropagation(); // Prevent the click event from propagating
                onClose(false);
                onSwipeLeft();
              }}
            >
              <Image
                src="/dislike.png"
                alt="Dislike"
                width={40}
                height={40}
                className="rounded-full"
              />
            </button>
            <button
              className="absolute bottom-5 right-5 bg-gray-100 p-2 rounded-full z-50"
              onClick={(e) => {
                e.stopPropagation(); // Prevent the click event from propagating
                onClose(false);
                onSwipeRight();
              }}
            >
              <Image
                src="/like.png"
                alt="Like"
                width={40}
                height={40}
                className="rounded-full"
              />
            </button>
          </>
        )}
      </div>

      {/* Details Section */}
      <div className="p-5 overflow-y-auto">
        <div className="mb-2">
          <h2 className="text-2xl font-bold text-gray-800">
            {profile.name}, {profile.age}
          </h2>
          <p className="text-base text-gray-600">{profile.bio}</p>
        </div>

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-800 mb-2">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-black text-white rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Distance */}
        <div className="mb-4">
          <p className="text-base text-gray-800">
            Distance: {Math.floor(profile.distance)} miles away
          </p>
        </div>
      </div>

      {/* Close Button */}
      <button
        className="absolute top-5 right-5 bg-gray-100 p-2 rounded-full"
        onClick={() => onClose(false)}
      >
        X
      </button>
    </div>
  );
};

export default UserDetailScreen;
