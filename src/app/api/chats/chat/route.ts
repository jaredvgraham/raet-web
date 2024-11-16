//chat controller

import { v4 as uuidv4 } from "uuid";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Match from "@/models/matchModel";
import Block from "@/models/blockModel";
import Chat from "@/models/chatModel";
import Message from "@/models/messageModel";
import { db } from "@/lib/firebase";

export async function GET(req: NextRequest) {
  const { matchId } = await req.json();
  const { userId } = await auth();

  if (!userId) {
    return { json: { message: "User not found" }, status: 404 };
  }

  try {
    // Fetch the match data to find the other user's Clerk ID
    const match = await Match.findById(matchId);
    if (!match) {
      return NextResponse.json({ message: "Match not found" }, { status: 404 });
    }

    const matchedUserId =
      match.user1ClerkId === userId ? match.user2ClerkId : match.user1ClerkId;

    // Check if the current user or the matched user has blocked each other
    const blockExists = await Block.findOne({
      $or: [
        { userId: userId, blockedUserId: matchedUserId }, // Current user blocked the matched user
        { userId: matchedUserId, blockedUserId: userId }, // Matched user blocked the current user
      ],
    });

    if (blockExists) {
      return NextResponse.json(
        { message: "Access to chat is blocked." },
        { status: 403 }
      );
    }

    const chat = await Chat.findOne({ matchId }).populate("messages");
    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }
    return NextResponse.json({ chat }, { status: 200 });
  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { matchId, messageText } = await req.json();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  console.log("at sendMessage", req.body);

  try {
    const match = await Match.findById(matchId);
    if (!match) {
      return NextResponse.json({ message: "Match not found" }, { status: 404 });
    }

    const matchedUserId =
      match.user1ClerkId === userId ? match.user2ClerkId : match.user1ClerkId;

    const blockExists = await Block.findOne({
      $or: [
        { userId: userId, blockedUserId: matchedUserId },
        { userId: matchedUserId, blockedUserId: userId },
      ],
    });

    if (blockExists) {
      return NextResponse.json(
        { message: "Access to chat is blocked." },
        { status: 403 }
      );
    }

    let chat = await Chat.findOne({ matchId: matchId });
    if (!chat) {
      // Create a new chat if it doesn't exist
      chat = new Chat({
        matchId: matchId,
        messages: [],
      });
      await chat.save();

      // Update the Match to reference the new Chat
      (match as any).chat = chat._id;
      await match.save();
    }

    // Create and save the message in MongoDB
    const message = new Message({
      id: uuidv4(),
      senderId: userId,
      receiverId:
        match.user1ClerkId === userId ? match.user2ClerkId : match.user1ClerkId,
      message: messageText,
      receiverViewed: false,
    });
    await message.save();

    // Push message to Firebase for real-time updates
    const chatRef = db.ref(`chats/${matchId}`);

    const msg = {
      id: (message as any).id,
      senderId: userId,
      receiverId: (message as any).receiverId,
      message: messageText,
      sentAt: Date.now(),
      receiverViewed: false,
    };

    await chatRef.child((message as any).id).set(msg);

    // Update Chat with the new message
    chat.messages.push((message as any)._id);
    await chat.save();

    return NextResponse.json({ message: "Message sent" }, { status: 200 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// chatController.js

export async function PATCH(req: NextRequest) {
  const { messageId, matchId } = await req.json();
  const { userId } = await auth();
  // Assuming matchId is passed in the request body

  try {
    // Fetch the message from Firebase
    const messageRef = db.ref(`chats/${matchId}/${messageId}`);
    const messageSnapshot = await messageRef.once("value");
    const messageData = messageSnapshot.val();

    if (!messageData) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 }
      );
    }

    // Ensure that only the intended receiver can mark the message as read
    if (messageData.receiverId !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Update the message as read in Firebase
    await messageRef.update({ receiverViewed: true });

    // Also update the message in MongoDB
    const message = await Message.findOne({ id: messageId });

    if (message) {
      message.receiverViewed = true;
      await message.save();
    }

    return NextResponse.json(
      { message: "Message marked as read" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking message as read:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
