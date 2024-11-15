// src/models/userModel.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  clerkId: string;
  dob: Date;
  bio?: string;
  gender?: "Male" | "Female";
  ratings?: number[] | null;
  images?: string[];
  location?: {
    type: string;
    coordinates: [number, number];
  };
  maxDistance?: number;
  interests?: string[];
  preferredAgeRange?: [number, number];
  preferredGender?: "Male" | "Female" | "Both";
  likedUsers?: string[];
  viewedUsers?: {
    userId: string;
    viewedAt: Date;
  }[];
  matchedUsers?: string[];
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  clerkId: { type: String, required: true, unique: true, index: true },
  dob: { type: Date, required: false },
  bio: { type: String, required: false },
  gender: { type: String, enum: ["Male", "Female"], required: false },
  ratings: { type: [Number], required: false },
  images: [{ type: String, required: false }],
  location: {
    type: { type: String, enum: ["Point"], required: false },
    coordinates: { type: [Number], required: false },
  },
  maxDistance: { type: Number, required: false, default: 10000 },
  interests: [{ type: String, required: false }],
  preferredAgeRange: { type: [Number], required: false, default: [18, 100] },
  preferredGender: {
    type: String,
    enum: ["Male", "Female", "Both"],
    required: false,
  },
  likedUsers: [{ type: String, ref: "User" }],
  viewedUsers: [
    {
      userId: { type: String, ref: "User" },
      viewedAt: { type: Date, default: Date.now },
    },
  ],
  matchedUsers: [{ type: String, ref: "User" }],
});

userSchema.index({ location: "2dsphere" });

const User = mongoose.model<IUser>("User", userSchema);

export default User;
