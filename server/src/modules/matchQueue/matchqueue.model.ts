import {
  prop,
  mongoose,
  buildSchema,
  modelOptions,
  Severity,
  Ref,
} from "@typegoose/typegoose";
import { User } from "../user/user.model"; // Adjust the import path according to your project structure

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "match_queues",
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
class MatchQueue {
  @prop({ ref: () => User, required: true })
  public userId!: Ref<User>;

  @prop({ required: true })
  public socketId!: string;
}

const MatchQueueModel = mongoose.connection
  .useDb("workspace")
  .model("match_queues", buildSchema(MatchQueue));

export default MatchQueueModel;
