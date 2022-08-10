import cors from "cors";
import express, { Router } from "express";

import { matchController } from "./match";

const app = express();

app.use(cors());

const withControllers = (app: Router): express.Application => {
  app.get("/matches", matchController);

  return app as express.Application;
};

export const api = withControllers(app);
