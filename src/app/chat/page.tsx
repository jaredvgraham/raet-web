"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { ref, query, limitToLast, onChildAdded } from "firebase/database";

import Image from "next/image";
import Header from "@/components/Header";

import { db } from "@/lib/frontendFirebase";
import { useAuthFetch } from "@/hooks/privFetch";
import { FaBell, FaCheck } from "react-icons/fa";
import { Message } from "@/types";
import { useNotification } from "@/hooks/webPush";

interface Match {
  matchId: string;
  profile: {
    images: string[];
    name: string;
  };
}

interface LastMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  receiverViewed: boolean;
  sentAt: number;
}

interface Conversation {
  matchId: string;
  matchedUser: {
    name: string;
    images: string[];
  };
  lastMessage: LastMessage;
}

const Chat = () => {
  const router = useRouter();
  const { user } = useUser();
  const authFetch = useAuthFetch();
  const { isSubscribed, subscribeToNotifications } = useNotification();

  const [matches, setMatches] = useState<Match[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [noMatches, setNoMatches] = useState(true);
  const [noConversations, setNoConversations] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      const response = await authFetch("/matches", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const matches = response.matches;

      setMatches(matches);
      setNoMatches(matches.length === 0);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setNoMatches(true);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await authFetch("/chats", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const initialConversations = response.conversations;

      if (!initialConversations || initialConversations.length === 0) {
        setNoConversations(true);
      } else {
        setConversations(initialConversations);
        setNoConversations(false);

        // Listen for the latest message in each conversation
        initialConversations.forEach((conversation: Conversation) => {
          const chatRef = query(
            ref(db, `chats/${conversation.matchId}`),
            limitToLast(1)
          );

          onChildAdded(chatRef, (snapshot) => {
            const newMessage = snapshot.val();
            setConversations((prevConversations) => {
              const updatedConversations = prevConversations.map((convo) => {
                if (convo.matchId === conversation.matchId) {
                  return {
                    ...convo,
                    lastMessage: {
                      ...convo.lastMessage,
                      ...newMessage,
                    },
                  };
                }
                return convo;
              });
              return updatedConversations;
            });
          });
        });
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]);
      setNoConversations(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching starts
      await Promise.all([fetchMatches(), fetchConversations()]);
      setLoading(false); // Set loading to false after both fetches finish
    };

    fetchData();
  }, []);

  const handleConvoClick = async (
    matchId: string,
    notRead: boolean,
    message: any
  ) => {
    console.log("notRead", notRead);
    console.log("message", message);

    router.push(`/chat/${matchId}`);

    if (notRead && message) {
      await authFetch("/chats/chat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, messageId: message.id }),
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Header style="w-full" />
        <p className="text-center text-2xl text-gray-500">Loading...</p>
      </div>
    );
  }

  if (noMatches && noConversations) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Header style="w-full" />
        <p className="text-center text-2xl text-gray-500">
          Nothing to see yet. Keep swiping!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="pb-24">
        <Header noti={true} />
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-xl font-bold">Matches</h2>
        </div>
        <div className="flex flex-col pt-4 pb-4 pl-1">
          {noMatches ? (
            <p className="text-center text-gray-500">
              No matches found. Please try again later.
            </p>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4">
              <div className="min-w-28 h-32  bg-black border border-gray-300 mb-6 rounded-2xl text-white flex flex-col items-center justify-center">
                <p className="text-center text-3xl text-teal-300">
                  {matches.length}
                </p>
                <p className="text-center text-gray-300">Matches</p>
              </div>
              {matches.map((match) => (
                <div key={match.matchId} className="flex-shrink-0">
                  <button
                    onClick={() => handleConvoClick(match.matchId, false, null)}
                    className="block"
                  >
                    <div className="relative w-28 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                      <Image
                        src={match.profile.images[0]}
                        alt={match.profile.name}
                        fill
                        className="rounded-2xl shadow-lg bg-black object-cover"
                      />
                    </div>
                    <p className="text-center font-semibold mt-2">
                      {match.profile.name.charAt(0).toUpperCase() +
                        match.profile.name.slice(1)}
                    </p>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-300">
          <h2 className="text-xl font-bold">Conversations</h2>
        </div>

        <div className="flex-1">
          {noConversations ? (
            <p className="text-center text-gray-500">
              No conversations found. Please try again later.
            </p>
          ) : (
            <div>
              {conversations.map((conversation) => {
                const notRead: boolean =
                  !!conversation.lastMessage &&
                  conversation.lastMessage.senderId !== user?.id &&
                  !conversation.lastMessage.receiverViewed;

                const sentByMe = conversation.lastMessage.senderId === user?.id;

                return (
                  <button
                    onClick={() =>
                      handleConvoClick(
                        conversation.matchId,
                        notRead,
                        conversation.lastMessage
                      )
                    }
                    className={`flex items-center w-full border-b border-gray-300 py-4 px-4 ${
                      notRead ? "bg-gray-100" : ""
                    }`}
                    key={conversation.matchId}
                  >
                    <div className="w-16 h-16 overflow-hidden rounded-full mr-2">
                      <Image
                        src={
                          conversation?.matchedUser?.images[0] || "/like.png"
                        }
                        alt={conversation?.matchedUser?.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full "
                      />
                    </div>

                    <div className="max-w-[100vw]">
                      <h3
                        className={`font-bold text-left ${
                          notRead ? "text-black" : "text-gray-700"
                        }`}
                      >
                        {conversation?.matchedUser?.name
                          .charAt(0)
                          .toUpperCase() +
                          conversation?.matchedUser?.name.slice(1)}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {sentByMe && (
                          <FaCheck
                            className={`text-gray-400 ${
                              conversation.lastMessage?.receiverViewed
                                ? "text-black"
                                : ""
                            }`}
                          />
                        )}
                        {!sentByMe && (
                          <FaBell
                            className={`${
                              notRead ? "text-teal-500" : "text-gray-400"
                            }`}
                          />
                        )}
                        <p className="text-sm text-gray-600 truncate break-words max-w-[80%]">
                          {conversation?.lastMessage?.message}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
