import {
  modelOptions,
  Severity,
  mongoose,
  buildSchema,
  prop,
  Ref,
} from "@typegoose/typegoose";
import { Match } from "../match/match.model";
import { Leaderboard } from "../leaderboard/leaderboard.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "leaderboards",
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
class Event {
  @prop({ required: true })
  public date!: string;

  @prop({ ref: () => Match })
  public activeMatches!: Ref<Match>[];

  @prop({ ref: () => Match })
  public pastMatches!: Ref<Match>[];

  @prop({ ref: () => Leaderboard })
  public leaderboard!: Ref<Leaderboard>;
}

const EventModel = mongoose.connection
  .useDb("workspace")
  .model("events", buildSchema(Event));

export default EventModel;
