import { Request, RequestHandler, Response } from "express";

import { Match } from "../models";

export const matchController: RequestHandler = async (
  request: Request,
  response: Response
) => {
  const over = !!request.params.over;
  const matches = await (over ? Match.find({ over: false }) : Match.find());
  return response.status(200).json(matches);
};
