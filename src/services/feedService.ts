import { IUser } from "../models/userModel";
import User from "../models/userModel";
import Like from "../models/likeModel";
import Block from "../models/blockModel";
import { createMatch } from "./matches";
import Match, { IMatch } from "@/models/matchModel";

export const getUserFeed = async (userId: string): Promise<IUser[]> => {
  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    throw new Error("User not found");
  }

  const [lon, lat] = user.location?.coordinates || [0, 0];

  console.log("user.location.cordinates", user.location?.coordinates);

  if (!lon || !lat) {
    throw new Error("User location not available");
  }

  const maxDistanceMeters = (user.maxDistance || 10000) * 1609.34; // Convert miles to meters
  const currentYear = new Date().getFullYear();
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  // Calculate the current user's average rating
  const userAverageRating =
    user.ratings && user.ratings.length > 0
      ? user.ratings.reduce((acc: any, curr: any) => acc + curr, 0) /
        user.ratings.length
      : 0;

  console.log("userAverageRating", userAverageRating);

  const blockedUsers = await Block.find({
    $or: [{ userId: user.clerkId }, { blockedUserId: user.clerkId }],
  });

  const blockedIds = blockedUsers.map((block) =>
    block.userId === user.clerkId ? block.blockedUserId : block.userId
  );

  user.viewedUsers = user.viewedUsers?.filter(
    (view: { userId: string; viewedAt: Date }) => view.viewedAt > twoMonthsAgo
  );

  const viewedIds =
    user.viewedUsers?.map(
      (view: { userId: string; viewedAt: Date }) => view.userId
    ) || [];

  await user.save();

  const ratingMatch =
    userAverageRating === 0
      ? {} // If userAverageRating is 0, match all users regardless of their rating
      : {
          $or: [
            { ratingCount: { $lt: 2 } }, // Include users with fewer than 2 ratings
            {
              averageRating: {
                $gte:
                  userAverageRating === 10
                    ? userAverageRating - 2
                    : userAverageRating - 1,
                $lte: userAverageRating + 1,
              },
            }, // Include users within the rating range
          ],
        };

  const genderMatch =
    user.preferredGender === "Both"
      ? { gender: { $in: ["Male", "Female"] } }
      : { gender: user.preferredGender };

  const nearbyUsers = await User.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lon, lat],
        },
        distanceField: "distance", // This will add a 'distance' field to the results
        spherical: true,
        maxDistance: maxDistanceMeters,
      },
    },
    {
      $addFields: {
        age: {
          $subtract: [currentYear - 1, { $year: "$dob" }],
        },
        ratings: { $ifNull: ["$ratings", []] }, // If ratings are null, treat as an empty array
        averageRating: { $avg: "$ratings" }, // Calculate the average rating for each user
        ratingCount: { $size: { $ifNull: ["$ratings", []] } }, // Ensure $size operates on an array
      },
    },
    {
      $match: {
        $and: [
          { clerkId: { $ne: user.clerkId } }, // Exclude the current user
          { clerkId: { $nin: user.likedUsers || [] } }, // Exclude users already liked
          { clerkId: { $nin: user.matchedUsers || [] } }, // Exclude users already matched
          { clerkId: { $nin: blockedIds } }, // Exclude users who have blocked the current user
          { clerkId: { $nin: viewedIds } },

          // Exclude users viewed in the last two months
          genderMatch, // Match gender preference
          ratingMatch, // Match rating preference
          {
            age: {
              $gte: user.preferredAgeRange?.[0] || 18,
              $lte: user.preferredAgeRange?.[1] || 100,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        age: 1,
        bio: 1,
        interests: 1,
        images: 1,
        clerkId: 1,
        distance: { $round: [{ $divide: ["$distance", 1609.34] }, 2] }, // Convert distance to miles and round to 2 decimal places
        averageRating: 1, // Include the calculated average rating
      },
    },
    {
      $limit: 10,
    },
  ]);

  return nearbyUsers;
};

export const likeUser = async (userId: string, likedUserId: string) => {
  const user = await User.findOne({ clerkId: userId });
  const likedUser = await User.findOne({ clerkId: likedUserId });

  if (!user || !likedUser) {
    throw new Error("User not found");
  }

  if (user.likedUsers?.includes(likedUserId)) {
    throw new Error("User already liked");
  }

  user.likedUsers = user.likedUsers || [];
  likedUser.likedUsers = likedUser.likedUsers || [];

  user.likedUsers.push(likedUserId);
  await user.save();

  const newLike = new Like({
    userId,
    likedUserId,
  });

  await newLike.save();

  if (likedUser.likedUsers.includes(userId)) {
    console.log("Match found!");
    user.matchedUsers = user.matchedUsers || [];
    likedUser.matchedUsers = likedUser.matchedUsers || [];
    user.matchedUsers?.push(likedUserId);
    likedUser.matchedUsers?.push(userId);
    await user.save();
    await likedUser.save();

    console.log("sending match match...", user.clerkId, likedUser.clerkId);

    const matchId = await createMatch(user.clerkId, likedUser.clerkId);

    return {
      message: `Match found for ${likedUser.name}`,
      matchId: matchId,
    };
  }
};

export const viewUser = async (userId: string, viewedUserId: string) => {
  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    throw new Error("User not found");
  }

  const now = new Date();
  const twoMonthsFromNow = new Date();
  twoMonthsFromNow.setMonth(now.getMonth() + 2);

  user.viewedUsers = user.viewedUsers || [];

  // Check if the user was already viewed, if so, update the viewedAt time
  const existingView = user.viewedUsers.find(
    (view: { userId: string; viewedAt: Date }) =>
      view.userId.toString() === viewedUserId
  );

  if (existingView) {
    existingView.viewedAt = now;
  } else {
    user.viewedUsers.push({ userId: viewedUserId, viewedAt: now });
  }

  await user.save();

  return { message: "User viewed" };
};

export const rateUser = async (ratedUserId: string, newRating: number) => {
  const ratedUser = await User.findOne({ clerkId: ratedUserId });

  if (!ratedUser) {
    throw new Error("User not found");
  }

  ratedUser.ratings = ratedUser.ratings || [];

  ratedUser.ratings.push(newRating);

  await ratedUser.save();
  console.log("User rated successfully", ratedUser);
};
