import { updateUserLocation } from "@/services/user/profile";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  console.log("entered updateLocation");

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { lon, lat } = await req.json();
    console.log("lon", lon);
    console.log("lat", lat);

    if (lon === undefined || lat === undefined) {
      return NextResponse.json(
        { message: "Please provide all fields" },
        { status: 400 }
      );
    }

    await updateUserLocation(userId, lon, lat);

    return NextResponse.json({ message: "Location updated" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error updating location", error },
      { status: 500 }
    );
  }
}
