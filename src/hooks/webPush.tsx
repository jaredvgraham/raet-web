"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useSession, useUser } from "@clerk/nextjs";
import { useAuthFetch } from "@/hooks/privFetch";
import { set } from "mongoose";

type NotificationContextType = {
  subscription: PushSubscription | null;
  isSubscribed: boolean;
  subscribeToNotifications: () => Promise<void>;
  unsubscribeFromNotifications: () => Promise<void>;
  device: "web" | "pwa";
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session } = useSession();
  const authFetch = useAuthFetch();
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [device, setDevice] = useState<"web" | "pwa">("web");

  useEffect(() => {
    const detectDevice = async () => {
      // Check both matchMedia and navigator.standalone
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as any).standalone;

      // Fallback: Wait for DOM to load and re-check
      if (document.readyState === "loading") {
        await new Promise((resolve) =>
          document.addEventListener("DOMContentLoaded", resolve, {
            once: true,
          })
        );
      }

      setDevice(isStandalone ? "pwa" : "web");
    };

    detectDevice();

    if (session?.getToken()) {
      checkSubscription();
    }
  }, [session]);

  useEffect(() => {
    // Detect device changes dynamically
    const handleDeviceChange = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as any).standalone;
      setDevice(isStandalone ? "pwa" : "web");
    };

    // Debounced media query listener
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const debouncedDeviceChange = () => {
      setTimeout(handleDeviceChange, 200); // Debounce by 200ms
    };

    mediaQuery.addEventListener("change", debouncedDeviceChange);

    return () => {
      mediaQuery.removeEventListener("change", debouncedDeviceChange);
    };
  }, []);
  const checkSubscription = async () => {
    try {
      const data = await authFetch("/push/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device }),
      });
      console.log("data", data.subscription);

      setIsSubscribed(true);

      setSubscription(data.subscription || null);
    } catch (error) {
      console.error("Error checking subscription:", error);
      setIsSubscribed(false);
      setSubscription(null);
    }
  };

  const subscribeToNotifications = async () => {
    console.log("in subscribeToNotifications");
    if (isSubscribed) return;

    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
      console.error("VAPID public key is not defined in the environment.");
      return;
    }
    console.log("in subscribeToNotifications 2");

    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      if (!registration) {
        console.error("Service worker registration failed.");
        return;
      }
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });
      setSubscription(sub);
      console.log("sub", sub);
      console.log("device", device);

      await authFetch("/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub, device }),
      });

      setIsSubscribed(true);
    } catch (error) {
      console.error("Error subscribing to notifications:", error);
    }
  };

  const unsubscribeFromNotifications = async () => {
    if (!subscription) return;

    try {
      await subscription.unsubscribe();

      await authFetch("/push", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint, device }),
      });

      setSubscription(null);
      setIsSubscribed(false);
    } catch (error) {
      console.error("Error unsubscribing from notifications:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        subscription,
        isSubscribed,
        subscribeToNotifications,
        unsubscribeFromNotifications,
        device,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return new Uint8Array(Array.from(rawData).map((char) => char.charCodeAt(0)));
};
