import IDL from "./idl.json";

const getPrivateKey = (s: string) => {
  return new Uint8Array(
    s
      .slice(1, s.length - 1)
      .split(",")
      .map((x) => parseInt(x))
  );
};

export const config = {
  MONGO_URI: process.env.MONGO_URI as string,
  REDIS_URI: process.env.REDIS_URI as string,
  PROGRAM_ID: process.env.PROGRAM_ID as string,
  CONNECTION_URL: process.env.CONNECTION_URL as string,
  BOT_PRIVATE_KEY: getPrivateKey(process.env.BOT_PRIVATE_KEY as string),
  BET_EVENT_ID_SIZE: 8,
  IDL,
};
