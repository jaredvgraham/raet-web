import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subscription from "@/models/subscriptionModel";
import { auth } from "@clerk/nextjs/server";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:jrod1532002@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
  const { subscription, device } = await req.json(); // `device` is 'web' or 'pwa'
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!subscription || !device) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  try {
    await connectDB();

    // Fetch the user's existing subscription
    let userSubscription = await Subscription.findOne({ clerkId });

    if (!userSubscription) {
      // Create a new subscription if none exists
      userSubscription = new Subscription({
        clerkId,
        subscriptions: { [device]: subscription },
      });
    } else {
      // Update the subscription for the given device
      userSubscription.subscriptions[device] = subscription;
    }

    // Save the subscription document
    await userSubscription.save();
    console.log("userSubscription", userSubscription);

    return NextResponse.json({
      message: "Subscription updated successfully",
      subscription: userSubscription.subscriptions[device],
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get subscription status
export async function GET(req: NextRequest) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const userSubscription = await Subscription.findOne({ clerkId });

    if (!userSubscription) {
      return NextResponse.json(
        { message: "No subscription found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ subscription: userSubscription });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete a subscription
export async function DELETE(req: NextRequest) {
  const { device } = await req.json();
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const userSubscription = await Subscription.findOne({ clerkId });

    if (userSubscription) {
      userSubscription[device] = null;
      await userSubscription.save();
    }

    return NextResponse.json({ message: "Subscription removed" });
  } catch (error) {
    console.error("Error removing subscription:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
