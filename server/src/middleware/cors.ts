import cors from "cors";
import { config } from "../config";

export const corsOptions = {
  origin: [config.app.frontend],
  credentials: true,
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
};

export const corsMiddleware = cors(corsOptions);
