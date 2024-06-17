import * as web3 from '@solana/web3.js';
import * as splToken from '@solana/spl-token';

// load up the first 32 bytes of the 64 byte array that was in our keyfile.json
// Only need the first 32 bytes so I use slice() just to make sure it's the correct length
let firstWinPrivKey = [111,102,135,113,2,120,231,196,50,225,193,87,230,144,148,13,56,173,188,251,34,117,1,255,97,30,222,220,51,99,102,139,89,202,230,12,147,31,240,150,64,18,137,86,2,36,39,76,108,30,9,21,175,45,122,173,132,227,14,17,68,8,210,139]
    .slice(0,32);
  // print the length of the array so we know it is correct
  // the fromSeed() method requires 32 bytes

 console.log(firstWinPrivKey.length);
  let firstWinWallet = web3.Keypair.fromSeed(Uint8Array.from(firstWinPrivKey));
  console.log(firstWinWallet.secretKey.);
  console.log(firstWinWallet.publicKey.toString());