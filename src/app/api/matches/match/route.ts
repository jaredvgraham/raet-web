import { connectDB } from "@/lib/db";
import Match from "@/models/matchModel";
import User from "@/models/userModel";
import { calculateAge } from "@/utils/calculateAge";
import { calculateDistance } from "@/utils/calculateDistance";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = await auth();
    const { matchId } = await req.json();

    const user = await User.findOne({ clerkId: userId });
    const match = await Match.findOne({ _id: matchId });

    const matchProfile = await User.findOne({
      clerkId:
        match?.user1ClerkId === userId
          ? match?.user2ClerkId
          : match?.user1ClerkId,
    });

    console.log("user", user);
    console.log("match", matchProfile);

    if (!user || !matchProfile) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch =
      user.matchedUsers && user.matchedUsers.includes(matchProfile.clerkId);

    if (!isMatch) {
      return NextResponse.json({ message: "Not a match" }, { status: 404 });
    }
    let distance;
    if (user.location && matchProfile.location) {
      distance = await calculateDistance(
        user?.location?.coordinates,
        matchProfile.location.coordinates
      );
    }

    const age = calculateAge(matchProfile.dob);

    return NextResponse.json(
      {
        profile: {
          name: matchProfile.name,
          age,
          bio: matchProfile.bio,
          images: matchProfile.images,
          distance,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error getting match profile", error },
      { status: 500 }
    );
  }
}
