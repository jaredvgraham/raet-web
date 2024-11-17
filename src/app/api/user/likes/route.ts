import { connectDB } from "@/lib/db";
import Block from "@/models/blockModel";
import Like from "@/models/likeModel";
import User from "@/models/userModel";
import { calculateAge } from "@/utils/calculateAge";
import { calculateDistance } from "@/utils/calculateDistance";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    console.log("entered getUserLikes");

    const { userId } = await auth();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const blockList = await Block.find({
      $or: [{ userId: user.clerkId }, { blockedUserId: user.clerkId }],
    });

    const blockedUserIds = blockList.map((block) =>
      block.userId === user.clerkId ? block.blockedUserId : block.userId
    );

    const likes = await Like.find({
      likedUserId: user.clerkId,
      userId: { $nin: blockedUserIds },
    });
    console.log("likes", likes);

    const likedUsersProfiles = await Promise.all(
      likes.map(async (like) => {
        try {
          const likedUser = await User.findOne({ clerkId: like.userId });
          if (likedUser && !likedUser.matchedUsers?.includes(user.clerkId)) {
            const userAverageRating =
              likedUser.ratings && likedUser.ratings.length > 0
                ? likedUser.ratings.reduce(
                    (acc: any, curr: any) => acc + curr,
                    0
                  ) / likedUser.ratings.length
                : 0;

            const maxDistanceMeters =
              (likedUser.maxDistance || 10000) * 1609.34;

            const [lon, lat] = likedUser.location?.coordinates || [0, 0];

            return {
              _id: likedUser._id,
              name: likedUser.name,
              clerkId: likedUser.clerkId,
              email: likedUser.email,
              age: calculateAge(likedUser.dob),
              bio: likedUser.bio,
              interests: likedUser.interests,
              images: likedUser.images,
              distance:
                lon && lat && user.location
                  ? await calculateDistance(user.location.coordinates, [
                      lon,
                      lat,
                    ])
                  : null,
              averageRating: userAverageRating,
              maxDistance: maxDistanceMeters / 1609.34, // Convert meters to miles
            };
          }
          return null; // In case the likedUser is not found
        } catch (err) {
          console.error("Error fetching user:", err);
          return null; // Return null if there's an error fetching the user
        }
      })
    );

    // Filter out any null values from the results
    const validProfiles = likedUsersProfiles.filter(Boolean);

    console.log("validProfiles", validProfiles);

    return NextResponse.json(
      { message: "Likes found", likes: validProfiles },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error getting likes", error },
      { status: 500 }
    );
  }
}
