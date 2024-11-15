import User, { IUser } from "@/models/userModel";

export const createUserProfile = async (
  userId: string,
  dateOfBirth: Date,
  gender: "Male" | "Female",
  interests: string[],
  preferredGender: "Male" | "Female" | "Both"
): Promise<IUser> => {
  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    throw new Error("User not found");
  }

  user.dob = new Date(dateOfBirth);
  user.gender = gender;
  user.interests = interests;
  user.preferredGender = preferredGender;

  await user.save();

  return user;
};
