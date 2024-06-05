import {
  mongoose,
  modelOptions,
  Severity,
  buildSchema,
  prop,
  Ref,
} from "@typegoose/typegoose";
import { User } from "../user/user.model";

enum Results {
  Loss = "loss",
  Win = "win",
  Draw = "draw",
  Abort = "abort",
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "matches",
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Match {
  @prop({ ref: () => User, required: true })
  public players!: Ref<User>[];

  @prop({ required: true })
  public section!: number;

  @prop({ required: true })
  public board!: number;

  @prop({ type: () => [String], default: ["pending", "pending"] })
  public result!: Results[];
}

const MatchModel = mongoose.connection
  .useDb("workspace")
  .model("matches", buildSchema(Match));

export default MatchModel;
