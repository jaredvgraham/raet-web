import { connectDB } from "@/lib/db";
import {
  getUserFeed,
  likeUser,
  rateUser,
  viewUser,
} from "@/services/feedService";
import { auth } from "@clerk/nextjs/server";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const feed = await getUserFeed(userId);
    console.log("feed", feed);

    return NextResponse.json({ feed }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error getting feed", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  console.log("endpoint hit");

  try {
    await connectDB();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { swipedId, direction, rate } = await req.json();
    console.log("req.body", req.body);

    if (!swipedId || !direction) {
      return NextResponse.json(
        { message: "Please provide all fields" },
        { status: 400 }
      );
    }

    if (rate) {
      await rateUser(swipedId, rate);
    }

    if (direction === "right") {
      const msg = await likeUser(userId, swipedId);
      return NextResponse.json({ message: msg }, { status: 200 });
    } else if (direction === "left") {
      await viewUser(userId, swipedId);
      return NextResponse.json({ message: "User viewed" }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error swiping", error },
      { status: 500 }
    );
  }
}
