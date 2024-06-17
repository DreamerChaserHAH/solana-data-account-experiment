import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaClick } from "../target/types/solana_click";
import { expect } from "chai";

describe("solana-click", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaClick as Program<SolanaClick>;
  const counter = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().accounts({clicker: counter.publicKey}).signers([counter]).rpc();
    const account = await program.account.clicker.fetch(counter.publicKey);
    expect(account.count).to.eq(0);
    console.log("Your transaction signature", tx);
  });

  it("Is added!", async () => {
    const tx = await program.methods.increase().accounts({clicker: counter.publicKey, user: provider.wallet.publicKey}).rpc();
    const account = await program.account.clicker.fetch(counter.publicKey);
    expect(account.count).to.eq(1);
  });
});
