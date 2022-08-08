import "dotenv/config";

import { Agenda } from "agenda";
import mongoose from "mongoose";

import { config } from "./config";
import { fetchJob } from "./jobs";

const agenda = new Agenda({ db: { address: config.MONGO_URI } });

const defineAgenda = async () => {
  agenda.define(fetchJob.name, fetchJob.handler);
  await agenda.start();
  await agenda.every(fetchJob.schedule, fetchJob.name);
};

const main = async () => {
  await mongoose.connect(config.MONGO_URI);
  await defineAgenda();
};

main();
