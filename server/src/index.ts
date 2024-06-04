import express, { Express, Request, Response } from "express";
import cors from "cors";
import { config } from "./config";
import routes from "./modules/routes";

const app: Express = express();

const port = config.app.port;
const host = config.app.host;

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from LA Chess Club API");
});

app.use(
  cors({
    origin: [config.app.frontend],
    credentials: true,
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
  }),
);

app.use(routes);

app.listen(port, () => {
  console.log(`[server]: Server is running at ${host}:${port}`);
});
