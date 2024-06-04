import dotenv from "dotenv";

dotenv.config();

const HOST = process.env.HOST;

const FRONTEND = process.env.FRONTEND as string;

const PORT = process.env.PORT;

const MONGO_URI = process.env.MONGO_URI;

const DAJOCODE_CS_ACCESS_KEY = process.env.DAJOCODE_CS_ACCESS_KEY;
const DAJOCODE_CS_SECRET_KEY = process.env.DAJOCODE_CS_SECRET_KEY;

const NODEMAILER_USER = process.env.NODEMAILER_USER;
const NODEMAILER_PASS = process.env.NODEMAILER_PASS;

const DAJOCODE_CS_URL = "https://dajocode-cloud-storage-api.com/api";

export const config = {
  app: {
    host: HOST,
    port: PORT,
    logLevel: "info",
    frontend: FRONTEND,
  },
  nodeMailer: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: NODEMAILER_USER,
      pass: NODEMAILER_PASS,
    },
  },
  db: {
    uri: MONGO_URI,
  },
  dajocode_cloud_storage: {
    api: {
      headers: {
        AccessKey: DAJOCODE_CS_ACCESS_KEY,
        SecretKey: DAJOCODE_CS_SECRET_KEY,
      },
      create: `${DAJOCODE_CS_URL}/create`,
      list: `${DAJOCODE_CS_URL}/list`,
      listByImageId: `${DAJOCODE_CS_URL}/list/imageId`,
      listImageVersionsByS3Key: `${DAJOCODE_CS_URL}/list/imageVersions`,
      read: `${DAJOCODE_CS_URL}/read`,
      overwrite: `${DAJOCODE_CS_URL}/overwrite`,
      delete: `${DAJOCODE_CS_URL}/delete`,
    },
  },
};
