import { connectDB } from "@/lib/db";
import Block from "@/models/blockModel";
import Match from "@/models/matchModel";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("entered getMatches");

  const { userId } = await auth();
  try {
    await connectDB();
    // Find matches related to the user

    const blockList = await Block.find({
      $or: [{ userId: userId }, { blockedUserId: userId }],
    });

    const blockedIds = blockList.map((block) =>
      block.userId === userId ? block.blockedUserId : block.userId
    );

    const matches = await Match.find({
      $or: [{ user1ClerkId: userId }, { user2ClerkId: userId }],
      $and: [
        { user1ClerkId: { $nin: blockedIds } },
        { user2ClerkId: { $nin: blockedIds } },
      ],
    });

    if (!matches || matches.length === 0) {
      return NextResponse.json(
        { message: "No matches found" },
        { status: 404 }
      );
    }

    // Prepare an array to store matched profiles with matchId
    const matchedProfilesWithMatchId = [] as any[];

    // Map through the matches to find the user IDs and pair them with their matchId
    const matchedUserIds = matches.map((match) => {
      const matchedUserId =
        match.user1ClerkId === userId ? match.user2ClerkId : match.user1ClerkId;
      matchedProfilesWithMatchId.push({
        matchId: match._id,
        clerkId: matchedUserId,
      });
      return matchedUserId;
    });

    // Fetch the profiles of the matched users
    const matchedProfiles = await User.find({
      clerkId: { $in: matchedUserIds },
    }).select("name age bio images clerkId");

    // Combine profiles with their matchIds
    const response = matchedProfiles.map((profile) => {
      const match = (matchedProfilesWithMatchId as any).find(
        (item: { clerkId: string }) => item.clerkId === profile.clerkId
      );
      return {
        matchId: match.matchId,
        profile: {
          name: profile.name,

          bio: (profile as any).bio,
          images: profile.images,
          clerkId: profile.clerkId,
        },
      };
    });

    return NextResponse.json({ matches: response }, { status: 200 });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { message: "Error fetching matches" },
      { status: 500 }
    );
  }
}
