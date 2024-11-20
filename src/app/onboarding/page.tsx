"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Dots from "@/components/Dots";
import Image from "next/image";
import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { useAuthFetch } from "@/hooks/privFetch";
import { formatError } from "@/utils/formatErr";
import { useShowNav } from "@/hooks/showNav";
import TermsOfService from "../terms/page";

interface Slide {
  title: string;
  component: React.ReactNode;
}

const Onboarding = () => {
  const router = useRouter();
  const authfetch = useAuthFetch();
  const { setHideNav } = useShowNav();
  const swiperRef = useRef<SwiperCore | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // State for form fields
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [gender, setGender] = useState<string>("");
  const [preferredGender, setPreferredGender] = useState<string>("");
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<File[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isToSModalOpen, setIsToSModalOpen] = useState(false);
  const [submiting, setSubmiting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Predefined interests
  const predefinedInterests: string[] = [
    "Sports",
    "Music",
    "Movies",
    "Travel",
    "Books",
    "Art",
  ];

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

  const handleSubmit = async () => {
    if (submiting) {
      return;
    }
    setSubmiting(true);
    try {
      console.log("Submitting user data", {
        dateOfBirth,
        gender,
        preferredGender,
        interests,
        uploadedFiles,
      });

      if (
        !dateOfBirth ||
        !uploadedFiles ||
        !gender ||
        !preferredGender ||
        interests.length === 0
      ) {
        setError("Please fill all the required fields");
        return;
      }

      const uploadedBlobUrls = await Promise.all(
        uploadedFiles.map(async (file) => {
          const newBlob: PutBlobResult = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/avatar/upload",
          });
          return newBlob.url;
        })
      );

      const res = await authfetch("/user/profile", {
        method: "POST",
        body: JSON.stringify({
          dateOfBirth,
          gender,
          preferredGender,
          interests,
          imageUrls: uploadedBlobUrls,
        }),
      });
      console.log("Submitted", res);
      router.push("/feed");
      setHideNav(false);
    } catch (error) {
      console.error("Failed to submit", error);

      setError(formatError(error));
    } finally {
      setSubmiting(false);
    }
  };

  const slides: Slide[] = [
    {
      title: "Terms and Conditions",
      component: (
        <div className="text-center">
          <p className="text-gray-600">
            By continuing, you agree to our{" "}
            <button
              onClick={() => setIsToSModalOpen(true)}
              className="text-blue-500 underline"
            >
              Terms and Conditions
            </button>
            .
          </p>
        </div>
      ),
    },
    {
      title: "What's your date of birth?",
      component: (
        <DatePicker
          selected={dateOfBirth}
          onChange={(date: Date | null) => setDateOfBirth(date)}
          dateFormat="MM/dd/yyyy"
          className="border p-2 rounded w-full"
        />
      ),
    },
    {
      title: "What's your gender?",
      component: (
        <div className="flex justify-around w-full">
          {["Male", "Female"].map((option) => (
            <button
              key={option}
              className={`p-4 rounded-lg w-1/3 ${
                gender === option
                  ? option === "Male"
                    ? "bg-blue-400 text-white"
                    : "bg-pink-400 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => setGender(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Who should we show you?",
      component: (
        <div className="flex justify-around w-full">
          {["Male", "Female", "Both"].map((option) => (
            <button
              key={option}
              className={`p-4 rounded-lg w-1/4 ${
                preferredGender === option
                  ? option === "Male"
                    ? "bg-blue-400 text-white"
                    : option === "Female"
                    ? "bg-pink-400 text-white"
                    : "bg-purple-300 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => setPreferredGender(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What are your interests?",
      component: (
        <div className="w-full">
          <div className="flex gap-2 mb-4 overflow-x-scroll">
            {predefinedInterests.map((interest) => (
              <button
                key={interest}
                className={`px-4 py-2 rounded-full ${
                  interests.includes(interest)
                    ? "bg-violet-300 text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => handleAddInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
          <div className="flex items-center">
            <input
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              placeholder="Add your own..."
              className="flex-1 p-2 border rounded mr-2"
            />
            <button
              className="p-2 bg-teal-400 text-white rounded"
              onClick={handleCustomInterest}
            >
              Add
            </button>
          </div>
          <div className="mt-4 flex gap-2 flex-wrap">
            {interests.map((interest) => (
              <button
                key={interest}
                className="px-4 py-2 rounded-full bg-violet-300 text-white"
                onClick={() => handleRemoveInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Upload Your Best Pictures",
      component: (
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            multiple
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                setUploadedFiles((prev: File[] | null) => [
                  ...(prev || []),
                  ...Array.from(files),
                ]);
              }
            }}
          />
          <button
            className="p-4 bg-black text-white rounded"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Images
          </button>

          <p className="text-gray-600 text-center">
            Add your favorite pictures to showcase yourself!
          </p>
          {uploadedFiles && (
            <div className="grid grid-cols-2 gap-2">
              {uploadedFiles?.map((file, index) => (
                <div
                  className="w-44 h-44 relative rounded overflow-hidden bg-black"
                  key={index}
                >
                  {/* Delete button */}
                  <button
                    className="absolute top-1 right-1 p-2 bg-black text-white rounded-full z-10"
                    onClick={() =>
                      setUploadedFiles((prev) =>
                        prev ? prev.filter((_, i) => i !== index) : []
                      )
                    }
                  >
                    X
                  </button>

                  {/* Image preview */}
                  <Image
                    alt={`Uploaded Image ${index + 1}`}
                    src={URL.createObjectURL(file)}
                    fill
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (activeIndex === slides.length - 1) {
      handleSubmit(); // Submit on the last slide
    } else {
      swiperRef.current?.slideNext(); // Move to the next slide
    }
  };

  if (isToSModalOpen) {
    console.log("tos modal");

    return <TermsOfService setTosModal={setIsToSModalOpen} />;
  }

  return (
    <div className="flex flex-col items-center justify-center  h-full pb-2">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)} // Capture Swiper instance
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        slidesPerView={1}
        className="w-full h-[80vh]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col items-center justify-center h-full px-4">
              <h2 className="text-2xl mb-4 text-center">{slide.title}</h2>
              {slide.component}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Add the Dots Component */}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Dots totalSlides={slides.length} activeIndex={activeIndex} />

      <button
        className="mt-6 bg-black text-white px-6 py-3 rounded"
        onClick={handleNext}
      >
        {submiting
          ? "Submiting"
          : activeIndex === slides.length - 1
          ? "Submit"
          : "Next"}
      </button>
    </div>
  );
};

export default Onboarding;
