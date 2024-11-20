import webpush from "web-push";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subscription from "@/models/subscriptionModel";
import { auth } from "@clerk/nextjs/server";

// Configure VAPID keys
webpush.setVapidDetails(
  "mailto:jrod1532002@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
  const { clerkId, title, body, url, message } = await req.json();

  if (!clerkId || !title || !body) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    // Fetch the user's subscriptions from the database
    const userSubscription = await Subscription.findOne({ clerkId });
    if (!userSubscription || !userSubscription.subscriptions) {
      return NextResponse.json(
        { message: "No subscriptions found" },
        { status: 404 }
      );
    }

    // Prepare notification payload
    const notificationPayload = JSON.stringify({
      title,
      body: `${body}${message ? ` - ${message}` : ""}`, // Append the message, if provided
      url: url || "/", // Default to root if no URL is provided
    });

    const devices = Object.keys(userSubscription.subscriptions);

    // Send notifications to all subscribed devices
    const results = await Promise.allSettled(
      devices.map((device) => {
        const sub = userSubscription.subscriptions[device];
        return webpush.sendNotification(sub, notificationPayload);
      })
    );

    // Handle failed notifications
    const failedDevices = results
      .map((result, index) =>
        result.status === "rejected" ? devices[index] : null
      )
      .filter(Boolean);

    if (failedDevices.length > 0) {
      console.error("Failed to send notifications to:", failedDevices);
    }

    return NextResponse.json({
      message: "Notifications sent successfully",
      failedDevices,
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
