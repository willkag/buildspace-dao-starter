import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// This is the address of our ERC-20 $LMAO token contract.
const tokenModule = sdk.getTokenModule("YOUR_TOKEN_MODULE_ADDRESS");

(async () => {
  try {
    // What's the max supply we want? 1,000,000,000 $LMAO — a billion meme coins!
    const amount = 1_000_000_000;
    // We use the util function from "ethers" to convert the amount
    // to the correct format (wei).
    const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);
    await tokenModule.mint(amountWith18Decimals);
    const totalSupply = await tokenModule.totalSupply();

    console.log(
      "✅ There now are",
      ethers.utils.formatUnits(totalSupply, 18),
      "$LMAO in circulation"
    );
  } catch (error) {
    console.error("Failed to print $LMAO money", error);
  }
})();
