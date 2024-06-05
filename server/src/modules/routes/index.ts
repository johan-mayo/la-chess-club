import { Router, Request, Response } from "express";
import matchRoutes from "../match/match.route";
import userRoutes from "../user/user.route";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.send("Hello from LA Chess Club API");
});

//router.post("/join", joinMatchmaking);

// Define other routes here
router.use("/match", matchRoutes);
router.use("/user", userRoutes);
// router.use("/users", userRoutes);
// router.use("/events", eventRoutes);

export default router;
