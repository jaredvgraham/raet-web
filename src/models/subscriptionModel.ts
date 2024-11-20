import mongoose, { Schema, Document } from "mongoose";

interface ISub {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface ISubscription extends Document {
  clerkId: string;
  subscriptions: {
    web?: ISub;
    pwa?: ISub;
    [key: string]: ISub | undefined; // Support for future device types
  };
}

const SubscriptionSchema = new Schema<ISubscription>({
  clerkId: { type: String, required: true, unique: true },
  subscriptions: {
    type: Object,
    default: {}, // Initialize as an empty object
  },
});

//indexing the clerkId field
SubscriptionSchema.index({ clerkId: 1 });

const Subscription =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

export default Subscription;
