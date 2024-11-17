type AuthFetch = (url: string, options: RequestInit) => Promise<Response>;
export const sendLocation = async (
  latitude: number,
  longitude: number,
  authFetch: AuthFetch
) => {
  try {
    const res = await authFetch("/user/location", {
      method: "PATCH",
      body: JSON.stringify({ lat: latitude, lon: longitude }),
    });
    console.log("Location sent", res);
  } catch (error) {
    console.error("Failed to send location", error);
  }
};
