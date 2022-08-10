import { Program, web3 } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";

import { config } from "../config";

const connection = new web3.Connection(config.CONNECTION_URL);
const keypair = anchor.web3.Keypair.fromSecretKey(config.BOT_PRIVATE_KEY);
const wallet = new anchor.Wallet(keypair);
const provider = new anchor.AnchorProvider(
  connection,
  wallet,
  anchor.AnchorProvider.defaultOptions()
);

anchor.setProvider(provider);

const getProgram = () => {
  const pk = new web3.PublicKey(config.PROGRAM_ID);
  const program = new Program(config.IDL as any, pk, provider);
  return program;
};

export const solana = {
  resolverKeyPair: keypair,
  resolverKey: keypair.publicKey,
  program: getProgram(),
  connection,
};
