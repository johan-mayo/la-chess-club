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
  @prop({ required: true, unique: true })
  public user!: Ref<User>;

  @prop({ required: true, default: 0 })
  public score!: number;
}

const LeaderboardModel = mongoose.connection
  .useDb("workspace")
  .model("leaderboards", buildSchema(Leaderboard));

export default LeaderboardModel;
