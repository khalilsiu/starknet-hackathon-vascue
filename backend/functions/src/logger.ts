import pinoms from "pino-multi-stream";
import { config } from "firebase-functions";
import stackdriver from "pino-stackdriver";

const { GCP_PROJECT_ID } = process.env;

const writeStream = stackdriver.createWriteStream({
  logName: "vascueStarknetApi",
  projectId: GCP_PROJECT_ID || config().gcp.project.id,
});

export const logger = pinoms({
  streams: [{ stream: process.stdout }, { stream: writeStream }],
});
