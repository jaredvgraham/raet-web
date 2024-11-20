import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subscription from "@/models/subscriptionModel";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { device } = await req.json(); // 'web' or 'pwa'
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!device) {
    return NextResponse.json(
      { message: "Device type is required" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    // Find the user's subscription
    const userSubscription = await Subscription.findOne({ clerkId });
    console.log("userSubscription", userSubscription);

    if (!userSubscription || !userSubscription.subscriptions[device]) {
      return NextResponse.json(
        { message: "No subscription found" },
        { status: 404 }
      );
    }

    console.log("device", device);
    console.log(
      "userSubscription.subscriptions[device]",
      userSubscription.subscriptions[device]
    );

    // Return the subscription for the specified device
    return NextResponse.json(
      { subscription: userSubscription.subscriptions[device] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking subscription:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
