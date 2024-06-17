import { AnchorProvider, Program } from "@coral-xyz/anchor";
import idl from '../../../../target/idl/solana_click.json'
import { SolanaClick } from "../../../../target/types/solana_click";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { Keypair, PublicKey } from "@solana/web3.js";
import { FC, useEffect, useState } from "react";

// I find the procedure in getProgram redundant
function getProgram({ connection, wallet }: any) {
    const provider = new AnchorProvider(connection, wallet, {});
    return new Program<SolanaClick>(idl as any, provider);
}

export const AnchorCall: FC = () => {
    const { connection } = useConnection();
    // I do not understand WHY this works:
    const wallet = useAnchorWallet();
    const [counter, setCounter] = useState(0);
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {

        const fetchCounter = async () => {
            if(subscribed) return;
            if (!wallet) throw new WalletNotConnectedError();
            setSubscribed(true);
            const program = getProgram({ connection, wallet });

            const [dataAccount] = PublicKey.findProgramAddressSync(
                [wallet.publicKey.toBuffer()], // This is the seed -- just the string "counter"
                program.programId, // If we're interacting with the program, we know its ID
              );
            console.log("Watching: ", dataAccount.toBase58());
            const subscriptionId = connection.onAccountChange(dataAccount, async (info) => {
                console.log(info);
                try {
                    const account = await program.account.clicker.fetch(dataAccount);
                    setCounter(account.count.toNumber());
                }catch (error: any) {
                    console.log(error);
                }
            });
            try {
                const account = await program.account.clicker.fetch(dataAccount);
                setCounter(account.count.toNumber());
            }catch (error: any) {
                console.log(error);
            }
            console.log("Starting Websocket subscription, id: ", subscriptionId);
        };

        fetchCounter();
    }, [wallet, connection])

    useEffect(() => {

    }, [counter])

    const onInitializeButtonClicked = async () => {
        if (!wallet) throw new WalletNotConnectedError();
        const program = getProgram({ connection, wallet });

        const [dataAccount] = PublicKey.findProgramAddressSync(
            [wallet.publicKey.toBuffer()], // This is the seed -- just the string "counter"
            program.programId, // If we're interacting with the program, we know its ID
          );
        console.log(dataAccount.toBase58());;

        try {
            const initTx = await program.methods.initialize().accounts({clicker: dataAccount}).rpc();
            console.log(initTx);

        } catch (error: any) {
            console.log(error);
        }
    };

    const onIncreaseButtonClicked = async () => {
        if (!wallet) throw new WalletNotConnectedError();
        const program = getProgram({ connection, wallet });

        const [dataAccount] = PublicKey.findProgramAddressSync(
            [wallet.publicKey.toBuffer()], // This is the seed -- just the string "counter"
            program.programId, // If we're interacting with the program, we know its ID
          );
        console.log(dataAccount.toBase58());;

        try {
            const ret = await program.methods
                .increase()
                .accounts({
                    clicker: dataAccount
                })
                .rpc();
            console.log(ret);
        } catch (error: any) {
            console.log(error);
        }
    };

    return (
        <div>
            <button onClick={onInitializeButtonClicked} disabled={!wallet}>
                 Reset Counter
            </button>
            <br/>
            <button onClick={onIncreaseButtonClicked} disabled={!wallet}>
                Increment Counter
            </button>
            <br/>
            <b>
                Counter value: {counter}
            </b>
        </div>
    );
}