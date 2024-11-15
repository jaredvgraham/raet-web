import { connectDB } from "@/lib/db";
import User from "@/models/userModel";

export const createUser = async (user: any) => {
  try {
    await connectDB();
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
    throw new Error("Error creating user");
  }
};
