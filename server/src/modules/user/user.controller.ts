import { Request, Response } from "express";
import UserModel from "./user.model";

export const getUser = async (req: Request, res: Response) => {
  const query = req.query;

  try {
    const user = await UserModel.findById(query.id);
    if (!user) return res.status(404).send("User not found");
    return res.status(200).json(user);
  } catch (e: any) {
    console.error(e);
    return res.status(500).send("Server Error");
  }
};
