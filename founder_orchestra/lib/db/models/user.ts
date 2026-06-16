/**
 * =============================================================================
 * MONGOOSE MODEL — USER
 * =============================================================================
 *
 * This defines the User document shape in MongoDB.
 * NextAuth will automatically create users when someone signs in,
 * but this model lets us add custom fields (like projects list).
 *
 * Owner: Backend Lead (Team Member C)
 * =============================================================================
 */

import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  /** Array of Project document IDs that belong to this user */
  projects: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true, // No two users can have the same email
    },
    image: { type: String },
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project", // This creates a relationship to the Project collection
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
