import sdk from "./1-initialize-sdk.js";

// In order to deploy the new contract, we need our old friend the app module.
const app = sdk.getAppModule("YOUR_APP_ADDRESS");

(async () => {
  try {
    // Deploy a standard ERC-20 contract — our $LMAO meme coin!
    const tokenModule = await app.deployTokenModule({
      // The name of our meme coin
      name: "LaughMyAssOff Coin",
      // The ticker symbol
      symbol: "LMAO",
      // This will be in case we want to sell our token. We don't, so we set it to eth.
      primarySaleRecipientAddress: ethers.constants.AddressZero,
    });

    console.log(
      "✅ Successfully deployed $LMAO token module, address:",
      tokenModule.address
    );
  } catch (error) {
    console.error("Failed to deploy $LMAO token module", error);
  }
})();
