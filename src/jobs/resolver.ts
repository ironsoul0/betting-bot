import { web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { HLTV } from "hltv";

import { Match } from "../models";
import { solana } from "../solana";

const JOB_NAME = "MATCH_RESOLVER";
const SCHEDULE = "1 hour";

type BetAccount = {
  eventId: string;
  makerSide: number;
  maker: PublicKey;
  taker: PublicKey;
  betResolver: PublicKey;
};

const getQueryDates = () => {
  const today = new Date();
  const ytd = new Date();
  ytd.setDate(today.getDate() - 1);
  return {
    startDate: ytd.toISOString().substring(0, 10),
    endDate: today.toISOString().substring(0, 10),
  };
};

const resolveBet = async (
  betKey: PublicKey,
  account: BetAccount,
  result: number
) => {
  if (account.betResolver.toString() !== solana.resolverKey.toString()) {
    return;
  }

  console.log(
    `Trying to resolve bet for match id=${account.eventId} makerSide=${account.makerSide}`
  );

  await solana.program.methods
    .resolveBet(result)
    .accounts({
      betAccount: betKey,
      betResolver: account.betResolver,
      makerAccount: account.maker,
      takerAccount: account.taker,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([solana.resolverKeyPair])
    .rpc();

  solana.connection.onAccountChange(betKey, async () => {
    console.log(
      `Resolved bet for match id=${account.eventId} makerSide=${account.makerSide}`
    );
  });
};

const jobHandler = async () => {
  const bets = await solana.program.account.bet.all();
  const dates = getQueryDates();
  const results = await HLTV.getResults({ ...dates });

  results.forEach(async (result) => {
    const match = await Match.findOne({ matchID: result.id });
    if (!match || match.over) return;
    match.over = true;
    await match.save();
    const validBets = bets.filter(
      (bet) => bet.account.eventId === String(result.id)
    );
    const matchResult = result.result.team1 > result.result.team2 ? 0 : 1;
    validBets.forEach(async (bet) => {
      resolveBet(bet.publicKey, bet.account as BetAccount, matchResult);
    });
  });
};

export const resolveJob = {
  name: JOB_NAME,
  schedule: SCHEDULE,
  handler: jobHandler,
};
