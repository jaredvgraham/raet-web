import { connectDB } from "@/lib/db";
import User from "@/models/userModel";

export const createUser = async (user: any) => {
  try {
    await connectDB();
    const newUser = await User.create({
      ...user,
      name: user.name.charAt(0).toUpperCase() + user.name.slice(1),
    });
    console.log("adding user", newUser);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
    throw new Error("Error creating user");
  }
};
