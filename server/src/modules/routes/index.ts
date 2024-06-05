import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.send("Hello from LA Chess Club API");
});

//router.post("/join", joinMatchmaking);

// Define other routes here
// router.use("/users", userRoutes);
// router.use("/events", eventRoutes);

export default router;
