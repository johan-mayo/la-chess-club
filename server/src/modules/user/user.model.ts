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
  public clerkUserId!: string;

  @prop({ required: true })
  public email!: string;

  @prop({ required: true })
  public firstName!: string;

  @prop({ required: true })
  public lastName!: string;

  @prop({ required: false })
  public imgUrl?: string;
}

const UserModel = mongoose.connection
  .useDb("auth")
  .model("users", buildSchema(User));

export default UserModel;
