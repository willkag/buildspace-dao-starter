import { ThirdwebSDK } from "@3rdweb/sdk";
import ethers from "ethers";

// Importing and configuring our .env file that we use to securely store our
// environment variables.
import dotenv from "dotenv";
dotenv.config();

// Some quick checks to make sure our .env is working.
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
  console.log("🛑 Private key not found.");
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === "") {
  console.log("🛑 Alchemy API URL not found.");
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
  console.log("🛑 Wallet Address not found.");
}

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    // Your wallet private key. ALWAYS KEEP THIS PRIVATE.
    process.env.PRIVATE_KEY,
    // RPC URL — using Alchemy for Goerli testnet.
    ethers.getDefaultProvider(process.env.ALCHEMY_API_URL)
  )
);

const getApp = async () => {
  try {
    const apps = await sdk.getApps();
    console.log("Your app address is:", apps[0].address);
    return apps[0];
  } catch (err) {
    console.error("Failed to get apps from the sdk", err);
    process.exit(1);
  }
};

const app = await getApp();

// We are exporting the initialized thirdweb SDK so other scripts can use it.
export default sdk;
export { app };
