import { createClerkClient } from "@clerk/nextjs/server";

const key = process.env.CLERK_SECRET_KEY;

const clerkClient = createClerkClient({ secretKey: key });

export default clerkClient;
