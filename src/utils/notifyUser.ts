import { AuthFetch } from "./sendLocation";

export const notifyUser = async (
  title: string,
  message: string,
  receiverId: string,
  link: string,
  authFetch: AuthFetch
) => {
  await authFetch("/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clerkId: receiverId,
      title: title,
      body: message,
      url: link,
    }),
  });
};
