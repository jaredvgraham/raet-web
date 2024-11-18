import { connectDB } from "@/lib/db";
import User from "@/models/userModel";
import { createUserProfile, getUserProfile } from "@/services/user/profile";
import { calculateAge } from "@/utils/calculateAge";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { message: "User not found", status: 404 },
        { status: 404 }
      );
    }
    const { dateOfBirth, gender, interests, preferredGender, imageUrls } =
      await req.json();

    console.log("req.body", req.body);

    if (
      !dateOfBirth ||
      !gender ||
      !interests ||
      !preferredGender ||
      !imageUrls
    ) {
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
      preferredGender,
      imageUrls
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

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { message: "User not found", status: 404 },
        { status: 404 }
      );
    }
    const profile = await getUserProfile(userId);

    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found", status: 404 },
        { status: 404 }
      );
    }

    const hasProfile = profile.gender ? true : false;

    const age = calculateAge(profile.dob);

    const updatedProfile = {
      ...profile.toObject(),
      age,
    };

    return NextResponse.json(
      { message: "Profile found", profile: updatedProfile, hasProfile },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error getting profile", error },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { name, bio, preferredGender, maxDistance, interests, imageUrls } =
      await req.json();

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.preferredGender = preferredGender || user.preferredGender;
    user.maxDistance = maxDistance
      ? parseInt(maxDistance, 10)
      : user.maxDistance;
    user.interests = interests
      ? interests.split(",").map((item: string) => item.trim())
      : user.interests;
    user.images = imageUrls.length > 0 ? imageUrls : user.images;

    await user.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        bio: user.bio,
        preferredGender: user.preferredGender,
        maxDistance: user.maxDistance,
        interests: user.interests,
        images: user.images,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error updating profile", error },
      { status: 500 }
    );
  }
}
