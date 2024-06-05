import {
  mongoose,
  modelOptions,
  Severity,
  buildSchema,
  prop,
  Ref,
} from "@typegoose/typegoose";
import { User } from "../user/user.model"; // Adjust the import path according to your project structure

export enum MatchStatus {
  Waiting = "waiting",
  Matched = "matched",
  Finished = "finished",
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
  public player1!: Ref<User>;

  @prop({ ref: () => User })
  public player2?: Ref<User>;

  @prop({ enum: MatchStatus, default: MatchStatus.Waiting })
  public status!: MatchStatus;

  @prop()
  public section!: number;

  @prop()
  public board!: number;

  @prop({ type: () => [String], default: ["pending", "pending"] })
  public result!: string[];

  @prop()
  public player1SocketId!: string;

  @prop()
  public player2SocketId?: string;
}

const MatchModel = mongoose.connection
  .useDb("workspace")
  .model("matches", buildSchema(Match));

export default MatchModel;
