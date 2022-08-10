import "dotenv/config";

import { Agenda } from "agenda";
import mongoose from "mongoose";

import { config } from "./config";
import { api } from "./controllers";
import { fetchJob, resolveJob } from "./jobs";

const agenda = new Agenda({ db: { address: config.MONGO_URI } });

const defineAgenda = async () => {
  agenda.define(fetchJob.name, fetchJob.handler);
  agenda.define(resolveJob.name, resolveJob.handler);

  await agenda.start();

  await agenda.every(fetchJob.schedule, fetchJob.name);
  await agenda.every(resolveJob.schedule, resolveJob.name);
};

const main = async () => {
  await mongoose.connect(config.MONGO_URI);
  await defineAgenda();

  api.listen(config.API_PORT, () => {
    console.log(`Server is started on port ${config.API_PORT}`);
  });
};

main();
