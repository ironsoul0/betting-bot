import * as anchor from "@project-serum/anchor";
import * as web3 from "@solana/web3.js";
import { HLTV, MatchFilter } from "hltv";

import { IMatch, Match } from "../models";
import { solana } from "../solana";

const LAMPORTS_PER_SOL = 1e9;
const TOP_MATCHES = 20;

const JOB_NAME = "MATCH_FETCHER";
const SCHEDULE = "1 hour";

const createBet = async (
  matchID: number,
  makerSide: number,
  betSize: number
) => {
  if (!Number.isFinite(betSize)) return;

  console.log(
    `Trying to create bet for match id=${matchID} makerSide=${makerSide} betSize=${betSize}`
  );

  const betSizeLamports = new anchor.BN((betSize * LAMPORTS_PER_SOL) / 10);
  const betAccount = anchor.web3.Keypair.generate();

  await solana.program.methods
    .createBet(String(matchID), makerSide, betSizeLamports)
    .accounts({
      initializer: solana.resolverKey,
      betAccount: betAccount.publicKey,
      betResolver: solana.resolverKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([betAccount])
    .rpc();

  solana.connection.onAccountChange(betAccount.publicKey, async () => {
    const bets = await solana.program.account.bet.all();
    console.log(
      `Created bet for match id=${matchID} makerSide=${makerSide} betSize=${betSize} totalBets=${bets.length}`
    );
  });
};

const jobHandler = async () => {
  const matches = await HLTV.getMatches({ filter: MatchFilter.TopTier });
  const validMatches = matches
    .filter((match) => match.team1?.name && match.team2?.name)
    .filter(
      (match) => match.team1?.name !== "TBD" && match.team2?.name !== "TBD"
    )
    .filter((match) => match.title || match.event?.name)
    .filter((match) => match.date)
    .slice(0, TOP_MATCHES);

  validMatches.forEach(async (match) => {
    const matchExists = await Match.findOne({ matchID: match.id });

    if (!matchExists) {
      const title = (match.title || match.event?.name) as string;
      const newMatch = new Match({
        matchID: match.id,
        date: match.date,
        title,
        team1: match.team1?.name,
        team2: match.team2?.name,
        over: false,
      } as IMatch);
      await newMatch.save();

      try {
        const matchInfo = await HLTV.getMatch({ id: match.id });
        const odds = matchInfo.odds;
        if (odds.length > 0) {
          createBet(match.id, 0, odds[0].team1);
          createBet(match.id, 1, odds[0].team2);
        }
      } catch (err) {
        console.log(`Hit HLTV rate limit: ${err}`);
      }
    }
  });
};

export const fetchJob = {
  name: JOB_NAME,
  schedule: SCHEDULE,
  handler: jobHandler,
};
