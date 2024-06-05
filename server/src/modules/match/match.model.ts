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
  AwaitingResult = "awaitingResult",
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

  @prop({ required: true })
  public section!: number;

  @prop({ required: true })
  public board!: number;

  @prop({ type: () => String, enum: MatchStatus, default: MatchStatus.Waiting })
  public status!: MatchStatus;

  @prop({ required: true })
  public player1SocketId!: string;

  @prop()
  public player2SocketId?: string;

  @prop({ type: () => [String], default: ["pending", "pending"] })
  public result!: string[];

  @prop({ type: () => [Boolean], default: [false, false] })
  public resultSubmitted!: boolean[]; // Indicate if players have submitted their results

  @prop({ type: () => [Boolean], default: [false, false] })
  public rematchAccepted!: boolean[]; // Indicate if players have accepted rematch
}

const MatchModel = mongoose.connection
  .useDb("workspace")
  .model("matches", buildSchema(Match));

export default MatchModel;
