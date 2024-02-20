import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    message: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      index: true,
    },
  },

  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
