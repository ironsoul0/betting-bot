import { model, Schema } from "mongoose";

export interface IMatch {
  matchID: number;
  date: number;
  title: string;
  team1: string;
  team2: string;
  over: boolean;
  winner?: string;
}

const matchSchema = new Schema<IMatch>({
  matchID: { type: Number, required: true, unique: true },
  date: { type: Number, required: true },
  title: { type: String, required: true },
  team1: { type: String, required: true },
  team2: { type: String, required: true },
  over: { type: Boolean, required: true },
  winner: { type: String, required: false },
});

export const Match = model<IMatch>("Match", matchSchema);
