import {
  mongoose,
  buildSchema,
  prop,
  Ref,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { User } from "../user/user.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "leaderboards",
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Leaderboard {
  @prop({ required: true })
  public users!: Array<{ user: Ref<User>; score: number }>;
}

const LeaderboardModel = mongoose.connection
  .useDb("workspace")
  .model("leaderboards", buildSchema(Leaderboard));

export default LeaderboardModel;
