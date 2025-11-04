# ⚡ Quick Start - Installation

Get up and running with the Yoink SDK in just a few minutes.

## Prerequisites

Before installing the Yoink SDK, make sure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- Basic knowledge of **JavaScript/TypeScript**
- **Solana wallet** for signing transactions

## Installation

### Using npm

```bash
npm install yoink-sdk
```

### Using yarn

```bash
yarn add yoink-sdk
```

### Using pnpm

```bash
pnpm add yoink-sdk
```

## Required Dependencies

The SDK requires these Solana dependencies (automatically installed):

```bash
npm install @solana/web3.js @solana/spl-token @coral-xyz/anchor
```

## Quick Setup

### 1. Import the SDK

```typescript
import { YoinkSDK } from 'yoink-sdk';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
```

### 2. Initialize Connection and Provider

```typescript
// For testnet (Eclipse)
const connection = new Connection("https://staging-rpc.dev2.eclipsenetwork.xyz");

// For Solana mainnet
// const connection = new Connection("https://api.mainnet-beta.solana.com");

const wallet = new NodeWallet(yourKeypair);
const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
```

### 3. Create SDK Instance

```typescript
const sdk = new YoinkSDK(provider);
```

## Environment Variables

Create a `.env` file with your RPC endpoint:

```bash
# For testnet (current default)
SOLANA_RPC_URL=https://staging-rpc.dev2.eclipsenetwork.xyz

# For Solana mainnet
# SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## Verification

Test your installation with a simple script:

```typescript
import { YoinkSDK } from "yoink-sdk";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

async function testInstallation() {
  const connection = new Connection(process.env.SOLANA_RPC_URL!);
  const wallet = new NodeWallet(Keypair.generate());
  const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
  
  const sdk = new YoinkSDK(provider);
  console.log("✅ SDK initialized successfully!");
  console.log("Program ID:", sdk.program.programId.toBase58());
  
  // Test global account fetch
  try {
    const global = await sdk.getGlobalAccount();
    console.log("✅ Connected to Yoink protocol");
    console.log("Fee basis points:", global.feeBasisPoints.toString());
  } catch (error) {
    console.error("❌ Connection failed:", error);
  }
}

testInstallation();
```

## Next Steps

- [📖 Read the Usage Guide](usage.md)
- [🎯 Try Example Script 1](example-1.md)
- [🛠️ Explore Example Script 2](example-2.md)

## Troubleshooting

### TypeError: Cannot read properties of undefined

Make sure you're using Node.js 16+ which has built-in support for BigInt.

### Module not found errors

Install all required dependencies:

```bash
npm install @solana/web3.js @solana/spl-token @coral-xyz/anchor bn.js
```

### TypeScript compilation errors

Update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

Need help? Visit our [GitHub repository](https://github.com/yoinknow/yoink-sdk) or check the [README](https://github.com/yoinknow/yoink-sdk/blob/main/README.md).