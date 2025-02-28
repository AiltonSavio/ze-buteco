# 🍺 Zé Buteco - Web3 Craft Beer AI & NFT System  

## 🏗 Project Overview  

**Zé Buteco** is an AI-driven, Web3-powered craft beer rating system that utilizes **Stylus smart contracts, NFTs, and AI agents**. The project allows users to mint NFTs representing craft beers, rate them on multiple attributes, and interact with an AI beer expert for insights and recommendations.  

🔹 **Built with:**  
- **Stylus (Arbitrum Stylus)** → For efficient, WASM-based smart contract execution  
- **Next.js + Scaffold-ETH 2** → For a seamless Web3 frontend experience  
- **PNPM Monorepo** → Managing multiple workspaces (Frontend, AI agent, Stylus contracts)  
- **ElizaOS AI Agents** → To enable interactions with Zé Buteco, the AI beer sommelier  

---

## 🚀 Features  

✔️ **Mint NFTs for Craft Beers** → Tokenize beer reviews & store metadata on-chain  
✔️ **Rate Beers on Multiple Attributes** → Taste, Aroma, Texture, Smoothness  
✔️ **Leaderboard & Stats** → View the highest-rated beers in Belo Horizonte  
✔️ **AI Beer Expert (Zé Buteco)** → Ask questions about beers, bars, and recommendations  
✔️ **Launchpad Tokenization** → Tokenized onboarding system for bars  

---

## ⚙️ Installation & Setup  

### 1️⃣ Install Dependencies  
Ensure you have [Node.js](https://nodejs.org/en/download/) (v20+), [PNPM](https://pnpm.io/installation), and [Rust](https://rustup.rs/) installed.  
Then, run the following in the root directory:  
```sh
pnpm i
```

### 2️⃣ Compile the Stylus Smart Contracts  
Navigate to the Stylus package and check the contract for errors:
```sh
cd packages/stylus
cargo stylus check
```
### 3️⃣ Deploy the Smart Contract  
Deploy to an Arbitrum Stylus-compatible RPC with your private key:
```
cargo stylus deploy --endpoint=<rpc_endpoint> --private-key <private_key>
```
⚠️ After deployment, copy the contract address!

### 4️⃣ Update the Frontend with the Contract Address  
 - Open `packages/nextjs/contracts/externalContracts.ts`
 - Update `421_614.CervejaNFT.address` with the deployed contract address
  
### 5️⃣ Start the Frontend 
Go back to the project root and start the Next.js app:
```sh
pnpm start
```
Check it on: http://localhost:3000

### 6️⃣ Update Environment Variables
Update these environment variables in the `.env` file on packages/eliza:
```sh
OPENAI_API_KEY=sk-*
TELEGRAM_BOT_TOKEN=
```


### 7️⃣ Run the AI Agent
To start Zé Buteco's AI system, run:
```sh
pnpm start:agent
```
This Enables chat and AI-driven beer recommendations.


---

## 📖 Usage Guide
 - **Mint NFTs** → Users can mint NFTs representing different craft beers.
 - **Rate Beers** → Ratings are stored on-chain and displayed on the leaderboard.
 - **Interact with AI** → Ask Zé Buteco for beer recommendations, bar locations, and more.

---

## 📜 Smart Contract Details
- Chain: Arbitrum Sepolia (421_614)
 - Contract Name: CervejaNFT
 - Functions:

    - `mint(address to, string name, uint8 taste, uint8 texture,  uint8 aroma, uint8 smoothness)`
    - `tokenURI(uint256 tokenId)` → Returns beer metadata
    - `ownerOf(uint256 tokenId)` → Fetches beer owner

--- 

## 🤝 Contributing

We welcome contributions! Feel free to submit PRs or open issues.

  1. Fork the repository
  2. Create a new branch (git checkout -b feature-new-feature)
  3. Commit changes (git commit -m "Add new feature")
  4. Push to the branch (git push origin feature-new-feature)
  5. Open a pull request

For more details, check out CONTRIBUTING.md

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE.md file for details