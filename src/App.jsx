import { useState } from "react";

const TOTAL_SUPPLY = "1,000,000,000";
const TOKEN_SYMBOL = "$LMAO";
const TOKEN_NAME = "LaughMyAssOff Coin";

// Fake tokenomics for display purposes
const TOKENOMICS = [
  { label: "Community Airdrop", pct: "40%", emoji: "🪂" },
  { label: "Liquidity Pool", pct: "30%", emoji: "💧" },
  { label: "Meme Treasury", pct: "20%", emoji: "🏦" },
  { label: "Dev Fund (trust us bro)", pct: "10%", emoji: "👨‍💻" },
];

const ROADMAP = [
  { phase: "Phase 1", title: "Launch", desc: "Deploy token. Make memes. Vibe." },
  { phase: "Phase 2", title: "Community", desc: "Airdrop to holders. Build the funniest DAO." },
  { phase: "Phase 3", title: "Moon", desc: "Number go up? Number go up." },
  { phase: "Phase 4", title: "???", desc: "Probably nothing. Definitely something." },
];

const App = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("0xLMAO...DeployYourOwnToGetARealAddress");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="landing">
      <div className="hero">
        <div className="logo-text">$LMAO</div>
        <h1>{TOKEN_NAME}</h1>
        <p className="tagline">
          The meme coin that doesn't take itself seriously — because why would it?
        </p>
        <p className="supply-info">
          Total Supply: <strong>{TOTAL_SUPPLY} {TOKEN_SYMBOL}</strong>
        </p>
        <div className="cta-row">
          <button onClick={handleCopy}>
            {copied ? "Copied!" : "Copy Contract Address"}
          </button>
        </div>
      </div>

      <section className="section">
        <h2>Tokenomics</h2>
        <div className="tokenomics-grid">
          {TOKENOMICS.map((t) => (
            <div className="card tokenomics-card" key={t.label}>
              <span className="tokenomics-emoji">{t.emoji}</span>
              <span className="tokenomics-pct">{t.pct}</span>
              <span className="tokenomics-label">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Roadmap</h2>
        <div className="roadmap">
          {ROADMAP.map((r) => (
            <div className="card roadmap-card" key={r.phase}>
              <span className="roadmap-phase">{r.phase}</span>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>How to Get {TOKEN_SYMBOL}</h2>
        <div className="how-to">
          <div className="card">
            <h3>1. Get a Wallet</h3>
            <p>Download MetaMask or any Ethereum-compatible wallet.</p>
          </div>
          <div className="card">
            <h3>2. Get Some ETH</h3>
            <p>You'll need ETH for gas fees. Use a testnet faucet for Goerli.</p>
          </div>
          <div className="card">
            <h3>3. Join the DAO</h3>
            <p>Mint the membership NFT and receive your {TOKEN_SYMBOL} airdrop!</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>
          Built with vibes and thirdweb. Not financial advice. DYOR. {TOKEN_SYMBOL} is for
          laughs only.
        </p>
      </footer>
    </div>
  );
};

export default App;
