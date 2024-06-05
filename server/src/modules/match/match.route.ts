import express from "express";
import { getMatch } from "./match.controller";

const router = express.Router();

router.get("/", getMatch);

export default router;
