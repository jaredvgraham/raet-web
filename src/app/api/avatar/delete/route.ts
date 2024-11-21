import { connectDB } from "@/lib/db";
import { deleteBlob } from "@/utils/deleteBlob";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { message: "User not found", status: 404 },
        { status: 404 }
      );
    }

    const { urls } = await req.json();

    if (!urls) {
      return NextResponse.json(
        { message: "Please provide an avatar url", status: 400 },
        { status: 400 }
      );
    }

    await Promise.all(urls.map((url: string) => deleteBlob(url)));

    return NextResponse.json({ message: "Avatar deleted" }, { status: 200 });
  } catch (error) {
    console.log("error deleting avatar", error);
    return NextResponse.json(
      { message: "Error deleting avatar", error },
      { status: 500 }
    );
  }
}
