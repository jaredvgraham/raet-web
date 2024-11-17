"use client";
import { SignOutButton } from "@clerk/nextjs";
import React from "react";

const page = () => {
  return (
    <div>
      <h1>Feed</h1>
      <SignOutButton />
    </div>
  );
};

export default page;
