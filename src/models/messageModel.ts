//message model

import mongoose, { Document, models, Schema } from "mongoose";
import { IUser } from "./userModel"; // Assuming you have a User model defined

export interface IMessage extends Document {
  senderId: string;
  receiverId: string;
  message: string;
  receiverViewed: boolean;
  sentAt: Date;
}

const messageSchema = new Schema<IMessage>({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  message: { type: String, required: true },
  receiverViewed: { type: Boolean, default: false },
  sentAt: { type: Date, default: Date.now },
});

const Message =
  mongoose.models.Message || mongoose.model<IMessage>("Message", messageSchema);

export default Message;
