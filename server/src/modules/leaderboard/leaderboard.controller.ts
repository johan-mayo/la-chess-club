import { Request, Response } from "express";
import LeaderboardModel from "./leaderboard.model";

export const getLeaderboard = async (_req: Request, res: Response) => {
  try {
    const leaderboardEntries = await LeaderboardModel.find()
      .sort({ score: -1 }) // Sort by score in descending order
      .populate("user"); // Populate the user field with user details

    return res.status(200).json(leaderboardEntries);
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
