import Block from "@/models/blockModel";
import Chat from "@/models/chatModel";
import Match from "@/models/matchModel";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  console.log("getLastMsgAndMatch");

  try {
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
    }).populate("chat"); // Populate the chat field to get the chat IDs

    if (!matches || matches.length === 0) {
      return NextResponse.json(
        { message: "No matches found" },
        { status: 404 }
      );
    }

    const conversations = await Promise.all(
      matches.map(async (match) => {
        const chat = await Chat.findOne({ matchId: match._id }).populate({
          path: "messages",
          options: { sort: { sentAt: -1 }, limit: 1 },
        });

        const matchedUserId =
          match.user1ClerkId === userId
            ? match.user2ClerkId
            : match.user1ClerkId;

        const matchedUser = await User.findOne({
          clerkId: matchedUserId,
        }).select("name age bio images");

        const lastMessage =
          chat && chat.messages.length > 0 ? chat.messages[0] : null;

        if (lastMessage) {
          return {
            matchedUser,
            matchId: match._id,
            lastMessage,
          };
        }

        return null; // Return null if there's no last message
      })
    );

    // Filter out null values (i.e., matches without messages)
    console.log("conversations before filtering ", conversations);

    const filteredConversations = conversations.filter(
      (conversation) => conversation !== null
    );

    console.log("conversations after filtering ", filteredConversations);

    if (filteredConversations.length === 0) {
      return NextResponse.json(
        { message: "No conversations found" },
        { status: 404 }
      );
    }

    filteredConversations.sort((a, b) => {
      return (
        new Date((b?.lastMessage as any).sentAt).getTime() -
        new Date((a?.lastMessage as any).sentAt).getTime()
      );
    });

    return NextResponse.json(
      { conversations: filteredConversations },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}