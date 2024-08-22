import { PushAPI, CONSTANTS } from '@pushprotocol/restapi'
import { ethers } from 'ethers'
import dotenv from "dotenv"

dotenv.config()

const PKEY = `0x${process.env.CHANNEL_PRIVATE_KEY}`;
const signer = new ethers.Wallet(PKEY);

const pushChannelAdress = "0x41070EfeD9Ead91380AAE5e164DAC1001F64C991";

const senderWallet = await PushAPI.initialize(signer, {
  env: CONSTANTS.ENV.STAGING,
});
await senderWallet.notification.subscribe(
  `eip155:11155111:${pushChannelAdress}` // channel address in CAIP format
);


async function sendPush(target, content) {
  try {
    const response = await senderWallet.channel.send([target], {
      notification: {
        title: "Cartesi DApp Notification",
        body: content,
      },
    })
    
  } catch (error) {
    console.log(error)
  }
}

export {
  sendPush
}