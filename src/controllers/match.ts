import { RequestHandler, Response } from "express";

import { Match } from "../models";

export const matchController: RequestHandler = async (
  _,
  response: Response
) => {
  const matches = await Match.find({ over: false });
  return response.status(200).json(matches);
};
