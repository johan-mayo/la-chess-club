import express, { Express, Request, Response } from "express";
import { config } from "./config";
import routes from "./modules/routes";
import { corsMiddleware } from "./middleware/cors";
import mongoose from "mongoose";

const app: Express = express();

app.post("/webhook", async (req: Request, res: Response) => {
  console.log(req.body);
  return res.send(200);
});

app.use(corsMiddleware);
app.use(express.json());

app.use("/api", routes);

mongoose
  .connect(config.db.uri as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

export default app;
