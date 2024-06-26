import React, { FC, ReactChildren, ReactElement, ReactNode, useMemo } from "react";
import { Children } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  WalletProviderProps,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "../App.css";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

interface WalletContextProviderProps {
    children: ReactNode;
}

export const WalletContextProvider = (props: {children: ReactElement<WalletProviderProps>}) => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            // if desired, manually define specific/custom wallets here (normally not required)
            // otherwise, the wallet-adapter will auto detect the wallets a user's browser has available
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <WalletMultiButton />
                    <WalletDisconnectButton />
                    {props.children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default WalletContextProvider;