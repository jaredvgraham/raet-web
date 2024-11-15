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

export const getUserProfile = async (
  userId: string
): Promise<IUser | false> => {
  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    return false;
  }
  return user;
};

export const updateUserLocation = async (
  userId: string,
  lon: number,
  lat: number
) => {
  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    throw new Error("User not found");
  }

  user.location = {
    type: "Point",
    coordinates: [lon, lat],
  };

  await user.save();

  return user;
};
