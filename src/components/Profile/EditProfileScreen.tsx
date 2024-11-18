"use client";

import React, { useState } from "react";
import { Profile } from "@/types";
import { FaGenderless, FaTimes, FaPlus } from "react-icons/fa";

type EditProfileScreenProps = {
  profile: Profile;
  onSave: (profile: Profile) => void;
  onCancel: () => void;
};

const SLIDER_MAX_VALUE = 100;
const MAX_DISTANCE_MILES = 10000;

const predefinedInterests = [
  "Sports",
  "Music",
  "Movies",
  "Travel",
  "Books",
  "Art",
];

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  profile,
  onSave,
  onCancel,
}) => {
  const [bio, setBio] = useState<string>(profile.bio as string);
  const [preferredGender, setPreferredGender] = useState<string>(
    profile.preferredGender
  );
  const [sliderValue, setSliderValue] = useState<number>(() => {
    return profile.maxDistance === MAX_DISTANCE_MILES
      ? SLIDER_MAX_VALUE
      : profile.maxDistance;
  });
  const [isMaxDistance, setIsMaxDistance] = useState<boolean>(
    profile.maxDistance === MAX_DISTANCE_MILES
  );
  const [interests, setInterests] = useState<string[]>(profile.interests);
  const [customInterest, setCustomInterest] = useState<string>("");
  const [images, setImages] = useState<string[]>(profile.images);

  const handleSave = () => {
    const maxDistance = isMaxDistance ? MAX_DISTANCE_MILES : sliderValue;

    const updatedProfile = {
      ...profile,
      bio,
      preferredGender,
      maxDistance,
      interests,
      images,
    };

    onSave(updatedProfile);
  };

  const handleAddInterest = (interest: string) => {
    if (!interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((item) => item !== interest));
  };

  const handleCustomInterest = () => {
    if (customInterest.trim()) {
      handleAddInterest(customInterest.trim());
      setCustomInterest("");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const uploadedImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages([...images, ...uploadedImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col bg-gray-100 p-6 h-full overflow-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-5">Edit Profile</h2>

      {/* Profile Images */}
      <div className="mb-4">
        <label className="block text-base text-gray-800 mb-2">
          Profile Images
        </label>
        <div className="flex gap-2 flex-wrap mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative w-20 h-20">
              <img
                src={image}
                alt={`Uploaded ${index}`}
                className="w-full h-full rounded-lg object-cover"
              />
              <button
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                onClick={() => removeImage(index)}
              >
                <FaTimes />
              </button>
            </div>
          ))}
          <label className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer">
            <FaPlus className="text-gray-600 text-xl" />
            <input
              type="file"
              multiple
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-4">
        <label className="block text-base text-gray-800 mb-2">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg"
          placeholder="Tell something about yourself"
        />
      </div>

      {/* Preferred Gender */}
      <div className="mb-4">
        <label className="block text-base text-gray-800 mb-2">
          Preferred Gender
        </label>
        <div className="flex gap-4">
          {["Male", "Female", "Other"].map((gender) => (
            <button
              key={gender}
              onClick={() => setPreferredGender(gender)}
              className={`py-2 px-4 rounded-lg ${
                preferredGender === gender
                  ? "bg-black text-white"
                  : "bg-gray-300"
              }`}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      {/* Max Distance */}
      <div className="mb-4">
        <label className="block text-base text-gray-800 mb-2">
          Max Distance: {isMaxDistance ? "Max" : sliderValue} miles
        </label>
        {!isMaxDistance && (
          <>
            <input
              type="range"
              min={1}
              max={SLIDER_MAX_VALUE}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full"
            />
            <button
              onClick={() => setIsMaxDistance(true)}
              className="mt-2 py-2 px-4 rounded-lg bg-gray-300"
            >
              Set Max Distance
            </button>
          </>
        )}

        {isMaxDistance && (
          <button
            onClick={() => setIsMaxDistance(false)}
            className="mt-2 py-2 px-4 rounded-lg bg-gray-300"
          >
            Set Specific Distance
          </button>
        )}
      </div>

      {/* Interests */}
      <div className="mb-4">
        <label className="block text-base text-gray-800 mb-2">Interests</label>
        <div className="flex gap-2 flex-wrap mb-4">
          {predefinedInterests.map((interest) => (
            <button
              key={interest}
              className={`py-2 px-4 rounded-lg ${
                interests.includes(interest)
                  ? "bg-black text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => handleAddInterest(interest)}
            >
              {interest}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            placeholder="Add your own..."
            className="flex-1 p-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleCustomInterest}
            className="py-2 px-4 rounded-lg bg-violet-400 text-white"
          >
            Add
          </button>
        </div>
        <div className="flex gap-2 flex-wrap mt-4">
          {interests.map((interest, index) => (
            <button
              key={index}
              className="py-2 px-4 rounded-lg bg-black text-white"
              onClick={() => handleRemoveInterest(interest)}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Save & Cancel Buttons */}
      <div className="flex justify-between mt-6">
        <button
          className="bg-red-500 text-white py-3 px-6 rounded-lg"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="bg-green-400 text-white py-3 px-6 rounded-lg"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditProfileScreen;
