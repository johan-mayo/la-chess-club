import {
  buildSchema,
  mongoose,
  prop,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "users",
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ required: true, unique: true })
  public clerkId!: string;

  @prop({ required: true })
  public userInfo: any;
}

const UserModel = mongoose.connection
  .useDb("auth")
  .model("users", buildSchema(User));

export default UserModel;
