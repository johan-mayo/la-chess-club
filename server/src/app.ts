import express, { Express, Request, Response } from "express";
import { config } from "./config";
import routes from "./modules/routes";
import { corsMiddleware } from "./middleware/cors";
import mongoose from "mongoose";

const app: Express = express();

import { Webhook } from "svix";
import bodyParser from "body-parser";
import UserModel from "./modules/user/user.model";

app.use(corsMiddleware);

app.post(
  "/api/webhooks",
  bodyParser.raw({ type: "application/json" }),
  async function (req: Request, res: Response) {
    try {
      const payloadString = req.body.toString();
      const svixHeaders = req.headers;

      const wh = new Webhook(config.clerk.webhookSecret as string);
      const evt = wh.verify(payloadString, svixHeaders as any) as any;
      const { id, ...attributes } = evt.data;
      // Handle the webhooks
      const eventType = evt.type;

      const firstName = attributes.first_name;
      const lastName = attributes.last_name;
      const email = attributes.email_addresses.find(
        (_: any) => attributes.primary_email_address_id === _.id,
      ).email_address;
      const imgUrl = attributes.image_url;

      if (eventType === "user.created") {
        const user = new UserModel({
          clerkUserId: id,
          firstName: firstName,
          lastName: lastName,
          email: email,
          imgUrl: imgUrl,
        });

        await user.save();
      }

      if (eventType === "user.updated") {
        await UserModel.findOneAndUpdate(
          { clerkUserId: id },
          {
            clerkUserId: id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            imgUrl: imgUrl,
          },
        );
      }
      return res.status(200).json({
        success: true,
        message: "Webhook received",
      });
    } catch (err: any) {
      console.error(err.message);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },
);

app.use(express.json());

app.use("/api", routes);

mongoose
  .connect(config.db.uri as string)
  .then(() => {
    console.log("MongoDB connected");
    mongoose.model("User", UserModel.schema);
  })
  .catch((err) => console.log(err));

export default app;
