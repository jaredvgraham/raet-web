"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ref, push, onChildAdded } from "firebase/database";

import { useAuthFetch } from "@/hooks/privFetch";
import Header from "@/components/Header";
import Image from "next/image";
import Icon from "react-icons/fa";
import UserDetailScreen from "@/components/feed/UserDetails";
import { db } from "@/lib/frontendFirebase";
import { useAuth, useSession, useUser } from "@clerk/nextjs";
import { Profile } from "@/types";
import { useShowNav } from "@/hooks/showNav";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  receiverViewed: boolean;
  sentAt: number;
}

const ChatScreen = () => {
  const router = useRouter();
  const { matchId } = useParams();
  const { userId } = useAuth();
  const authFetch = useAuthFetch();
  const { setHideNav, hideNav, setShowNav } = useShowNav();

  const [match, setMatch] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const messagesEndRef = useRef(null);
  const messageIds = new Set();
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      console.log("msgendref", messagesEndRef.current);

      (messagesEndRef as any).current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!matchId) return;

    const chatRef = ref(db, `chats/${matchId}`);

    // Listen for new messages
    onChildAdded(chatRef, (snapshot) => {
      const newMessage = snapshot.val();
      console.log("New message", newMessage);
      console.log("messages", messages);

      if (messageIds.has(newMessage.id)) {
        return;
      } else {
        messageIds.add(newMessage.id);
        setMessages((messages) => [...messages, newMessage]);
      }
    });
    setTimeout(() => scrollToBottom(), 500);
  }, [matchId]);

  useEffect(() => {
    const fetchMatch = async () => {
      setShowNav(false);
      try {
        const response = await authFetch(`/matches/match`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matchId }),
        });

        console.log("Match response", response);

        setMatch({
          ...response.profile,
          distance: response.distance,
        });
      } catch (error) {
        console.error("Error fetching match:", error);
      }
    };

    fetchMatch();
  }, [matchId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setIsSending(true);

    try {
      await authFetch("/chats/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ matchId, messageText: message }),
      });

      setMessage(""); // Clear the input field
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    console.log("scrolling to bottom");
    console.log("messages", messages);

    scrollToBottom();
  }, [messages]);

  const handleBlur = () => {
    setTimeout(() => setHideNav(false), 100); // Delay to avoid interference
  };

  if (!match) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-gray-500">Loading Chat...</p>
      </div>
    );
  }

  if (showProfile) {
    return (
      <UserDetailScreen
        profile={match}
        onClose={() => setShowProfile(false)}
        onSwipeLeft={() => {}}
        onSwipeRight={() => {}}
        showButtons={false}
      />
    );
  }

  return (
    <div className={`flex flex-col ${hideNav ? "h-screen" : "h-[95%]"}`}>
      <Header
        backArrow={true}
        image={match.images[0]}
        backDestination="/chat"
        userName={match.name}
        style="py-6"
        imageOnPress={() => setShowProfile(true)}
      />
      <div className="flex-grow overflow-y-auto p-4 bg-gray-100">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.senderId !== userId ? "justify-start" : "justify-end"
            } mb-4`}
          >
            {msg.senderId !== userId && (
              <div className="relative w-10 h-10 overflow-hidden rounded-full mr-1 self-end">
                <Image
                  src={match?.images?.[0]} // Fallback if no image
                  alt={match?.name || "User Image"}
                  width={40} // These ensure consistent dimensions
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div
              className={`p-3 rounded-xl max-w-[80%]  ${
                msg.senderId !== userId ? "bg-gray-200" : "bg-blue-100"
              }`}
            >
              <p className="text-lg break-words  ">{msg.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center border-t border-gray-300 p-3 ">
        <input
          type="text"
          value={message}
          onFocus={() => setHideNav(true)}
          onBlur={handleBlur}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow border border-gray-400 p-3 rounded-full mr-3"
          placeholder="Type a message"
        />
        <button
          onClick={sendMessage}
          disabled={isSending}
          className="px-4 py-2 bg-blue-500 text-white rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
