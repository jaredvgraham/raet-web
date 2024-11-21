"use client"; // This directive is necessary to make this a client component

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analytics } from "@/lib/frontendFirebase";
import { logEvent } from "firebase/analytics";

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (analytics) {
        logEvent(analytics, "page_view", { page_path: url });
      }
    };

    // Log initial page load
    handleRouteChange(pathname);
  }, [pathname]);

  return null;
}
