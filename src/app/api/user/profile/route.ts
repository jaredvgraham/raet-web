import { createUserProfile } from "@/services/user/profile";
import { calculateAge } from "@/utils/calculateAge";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { message: "User not found", status: 404 },
        { status: 404 }
      );
    }
    const { dateOfBirth, gender, interests, preferredGender } =
      await req.json();

    console.log("req.body", req.body);

    if (!dateOfBirth || !gender || !interests || !preferredGender) {
      return NextResponse.json(
        { message: "Please provide all fields", status: 400 },
        { status: 400 }
      );
    }

    const age = calculateAge(dateOfBirth);

    if (age < 18) {
      return NextResponse.json(
        { message: "You must be 18 years or older to use this app" },
        { status: 400 }
      );
    }

    const profile = await createUserProfile(
      userId,
      dateOfBirth,
      gender,
      interests,
      preferredGender
    );
    console.log("profile", profile);

    return NextResponse.json(
      { message: "Profile created", profile },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error creating profile", error },
      { status: 500 }
    );
  }
}
