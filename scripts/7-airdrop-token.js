import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// This is the address of our ERC-20 $LMAO token contract.
const tokenModule = sdk.getTokenModule("YOUR_TOKEN_MODULE_ADDRESS");

// This is the address of our ERC-1155 membership NFT contract.
const bundleDropModule = sdk.getBundleDropModule("YOUR_BUNDLE_DROP_ADDRESS");

(async () => {
  try {
    // Grab all the addresses of people who own our membership NFT,
    // which has a tokenId of 0.
    const walletAddresses = await bundleDropModule.getAllClaimerAddresses("0");

    if (walletAddresses.length === 0) {
      console.log(
        "No NFT holders found, did you deploy a membership NFT first?"
      );
      process.exit(0);
    }

    // Loop through the array of addresses and airdrop $LMAO tokens.
    const airdropTargets = walletAddresses.map((address) => {
      // Pick a random amount of $LMAO tokens between 1,000 and 10,000.
      const randomAmount = Math.floor(
        Math.random() * (10000 - 1000 + 1) + 1000
      );
      console.log("✅ Going to airdrop", randomAmount, "$LMAO to", address);

      // Set up the target.
      const airdropTarget = {
        address,
        amount: ethers.utils.parseUnits(randomAmount.toString(), 18),
      };

      return airdropTarget;
    });

    // Call transferBatch on all our airdrop targets.
    console.log("🌈 Starting airdrop...");
    await tokenModule.transferBatch(airdropTargets);
    console.log(
      "✅ Successfully airdropped $LMAO tokens to all NFT holders!"
    );
  } catch (err) {
    console.error("Failed to airdrop $LMAO tokens", err);
  }
})();
