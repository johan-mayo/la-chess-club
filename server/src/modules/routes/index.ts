import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.send("Hello from LA Chess Club API");
});

// Define other routes here
// router.use("/users", userRoutes);
// router.use("/events", eventRoutes);

export default router;
