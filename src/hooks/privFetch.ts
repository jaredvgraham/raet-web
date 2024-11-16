import { useSession } from "@clerk/nextjs";

export const useAuthFetch = () => {
  const { session } = useSession();
  console.log("session", session);

  const authFetch = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api${endpoint}`;
      console.log("url", url);

      const token = await session?.getToken();
      console.log("token", token);
      if (!token) {
        throw new Error("No token found!");
      }

      const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(
          errorData.message || errorData.error || "Something went wrong!"
        );
        console.log("error", error);
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  return authFetch;
};
