import { User } from "../model/user.model.js";
import { Like } from "../model/like.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

export const addUser = asyncHandler(async (req, res) => {
  let { message } = req.body;
  message = message?.trim();
  console.log(message);

  // check message is empty or not
  if (!message || message?.trim().length === 0) {
    return res.status(200).json("Message is empty");
  }

  // check message already exists or not
  const users = await User.aggregate([
    {
      $project: {
        _id: 1,
        message: { $toLower: "$message" },
      },
    },
  ]);

  function isMessageInUsersArray(usersArray, targetMessage) {
    for (let user of usersArray) {
      if (user.message === targetMessage.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  const isStringFound = isMessageInUsersArray(users, message);

  if (isStringFound) {
    return res.status(201).json("Message alredy exists");
  }
  const newUser = await User.create({
    message: message,
  });
  await newUser.save();

  const newLike = await Like.create({
    userId: newUser._id,
  });
  await newLike.save();
  
  return res
    .status(200)
    .json("Confession captured! 🤐🔒");
});

export const increaseLike = asyncHandler(async (req, res) => {
  const { message } = req.body;

  // Find user by message
  const user = await User.findOne({ message });

  if (user) {
    // Create new Like document
    const newLike = new Like({
      userId: user._id,
    });

    // Save the new Like document
    await newLike.save();

    // Return success response with updated likes
    const allLike = await Like.find();
    return res.status(200).json(allLike);
  } else {
    // Return error response if user is not found
    return res.status(404).json({ message: "User not found for this message" });
  }
});

export const decreasedLike = asyncHandler(async (req, res) => {
  const { message } = req.body;

  // Find user by message
  const user = await User.findOne({ message });

  if (!user) {
    return res.status(404).json({ message: "User not found for this message" });
  }

  const likeCount = await Like.countDocuments({ userId: user._id });

  if (likeCount > 1) {
    // If there is more than one like, delete one
    await Like.deleteOne({ userId: user._id });

    // Fetch all likes after the deletion
    const allLikes = await Like.find();

    return res
      .status(200)
      .json({ message: "Like removed for this message", likes: allLikes });
  } else {
    // If there is only one like or none, return without deleting
    const allLikes = await Like.find();

    return res
      .status(200)
      .json({ message: "No action taken", likes: allLikes });
  }
});

export const all = asyncHandler(async (req, res) => {
  const allUser = await Like.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $group: {
        _id: "$user.message",
        likeCount: { $sum: 1 },
        latestDate: { $max: "$createdAt" } // Get the maximum creation date
      },
    },
    {
      $project: {
        _id: 0,
        message: "$_id",
        likeCount: {
          $subtract: ["$likeCount", 1],
        },
        latestDate: 1 // Include the latest date in the projection
      },
    },
    {
      $sort: {
        likeCount: -1,
        latestDate: -1 // Sort by likeCount in descending order and latestDate in descending order
      },
    },
  ]);

  return res.status(200).json(allUser);
});

export const likeCount = asyncHandler(async (req, res) => {
  const { message } = req.body;

  // Find user by message
  const user = await User.findOne({ message });

  if (user) {
    // Find like documents for the user
    const likeDocuments = await Like.find({ userId: user._id });

    return res.status(200).json({ totalLike: likeDocuments.length });
  } else {
    return res.status(404).json({ message: "No users found" });
  }
});
