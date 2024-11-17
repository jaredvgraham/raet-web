import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { Profile } from "@/types";
import Dots from "@/components/Dots";
import RatingButtons from "./RateButtons";

interface SwipeableCardProps {
  profile: Profile;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  isCurrentCard: boolean;
  onRateChange: (number: number) => void;
  rate: number | null;
}

const SwipeableCard = ({
  profile,
  onSwipeRight,
  onSwipeLeft,
  isCurrentCard,
  onRateChange,
  rate,
}: SwipeableCardProps) => {
  const controls = useAnimation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dragDirection, setDragDirection] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const swipeThreshold = 100;

  const handleDrag = (event: PointerEvent, info: { offset: { x: number } }) => {
    setDragging(true);

    if (info.offset.x > swipeThreshold) {
      setDragDirection("right");
    } else if (info.offset.x < -swipeThreshold) {
      setDragDirection("left");
    } else {
      setDragDirection(null);
    }
  };

  const handleDragEnd = async (
    event: PointerEvent,
    info: { offset: { x: number } }
  ) => {
    setDragging(false);

    if (info.offset.x > swipeThreshold) {
      await controls.start({ x: 1000, opacity: 0 });
      onSwipeRight();
    } else if (info.offset.x < -swipeThreshold) {
      await controls.start({ x: -1000, opacity: 0 });
      onSwipeLeft();
    } else {
      await controls.start({ x: 0, opacity: 1 });
      setDragDirection(null);
    }
  };

  const handleImageTap = (e: React.MouseEvent) => {
    const containerWidth = e.currentTarget.getBoundingClientRect().width;
    const clickPosition = e.nativeEvent.offsetX;

    if (clickPosition > containerWidth / 2) {
      setCurrentImageIndex((prev) =>
        prev < profile.images.length - 1 ? prev + 1 : prev
      );
    } else {
      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  return (
    <motion.div
      className={`absolute w-full h-full `}
      initial={{ x: 0, opacity: 1 }}
      animate={controls}
      drag={isCurrentCard ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{ zIndex: isCurrentCard ? 1 : 0 }}
    >
      <div
        className="relative w-full h-full overflow-hidden rounded-t-2xl bg-white"
        onClick={handleImageTap}
      >
        {/* Image and Indicators */}
        <div className="relative w-full h-full">
          <Image
            src={profile.images[currentImageIndex]}
            alt={profile.name}
            fill
            className="object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white">
            <div className="text-center">
              <h2 className="text-2xl font-bold">
                {profile.name}, {profile.age}
              </h2>
              <p className="text-lg text-gray-300">
                Distance: {Math.floor(profile.distance)} Miles
              </p>
            </div>
          </div>
        </div>

        {/* Dots Component */}
        <div className="absolute top-2 left-0 right-0 flex justify-center z-40">
          <Dots
            totalSlides={profile.images.length}
            activeIndex={currentImageIndex}
          />
        </div>

        {/* Visual Feedback for Swiping */}
        {dragDirection === "right" && dragging && (
          <p className="absolute top-10 left-10 text-3xl font-bold text-green-500 bg-white p-2 rounded shadow-lg">
            Like
          </p>
        )}
        {dragDirection === "left" && dragging && (
          <p className="absolute top-10 right-10 text-3xl font-bold text-red-500 bg-white p-2 rounded shadow-lg">
            Nope
          </p>
        )}

        {/* Like and Dislike Buttons */}
        <div className="absolute bottom-5 left-3">
          <button onClick={onSwipeLeft}>
            <Image
              src="/dislike.png"
              alt="Dislike"
              width={40}
              height={40}
              className="rounded-full"
            />
          </button>
        </div>
        <div className="absolute bottom-5 right-3">
          <button onClick={onSwipeRight}>
            <Image
              src="/like.png"
              alt="Like"
              width={40}
              height={40}
              className="rounded-full"
            />
          </button>
        </div>
      </div>
      <RatingButtons
        isCurrentCard={isCurrentCard}
        onRateChange={onRateChange}
        rate={rate}
      />
    </motion.div>
  );
};

export default SwipeableCard;
