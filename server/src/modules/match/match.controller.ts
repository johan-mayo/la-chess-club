import { Request, Response } from "express";
import MatchModel from "./match.model";

export const getMatch = async (req: Request, res: Response) => {
  const matchId = req.query.id;

  if (!matchId || typeof matchId !== "string") {
    return res.status(400).send("Invalid match ID");
  }

  try {
    const match = await MatchModel.findById(matchId);
    if (!match) return res.status(404).send("Match not found");
    return res.status(200).json(match);
  } catch (e: any) {
    console.error(e);
    return res.status(500).send("Server Error");
  }
};
