import React from "react";
import Image from "next/image";
import { Profile } from "@/types";

interface SwipeableCardProps {
  profile: Profile;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  isCurrentCard: boolean;
}

const SwipeableCard = ({
  profile,
  onSwipeRight,
  onSwipeLeft,
  isCurrentCard,
}: SwipeableCardProps) => {
  return (
    <div
      className={`absolute w-full h-full transition-transform ${
        isCurrentCard ? "z-10" : "z-0"
      }`}
    >
      <div className="relative w-full h-full rounded-lg shadow-lg overflow-hidden bg-white">
        <Image
          src={profile.images[0]}
          alt={profile.name}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white">
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <p>{profile.bio}</p>
        </div>
        <div className="absolute top-4 right-4 flex space-x-4">
          <button
            className="bg-green-500 p-2 rounded-full"
            onClick={onSwipeRight}
          >
            👍
          </button>
          <button className="bg-red-500 p-2 rounded-full" onClick={onSwipeLeft}>
            👎
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwipeableCard;
