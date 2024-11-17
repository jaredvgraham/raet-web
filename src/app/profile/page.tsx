import { SignOutButton, UserProfile } from "@clerk/nextjs";
import React from "react";

const page = () => {
  return (
    <>
      <h1>Profile</h1>
      <UserProfile />
      <SignOutButton />
    </>
  );
};

export default page;
