# 🎯 Usage Guide

Learn how to use the Yoink SDK to interact with bonding curve tokens on Solana.

## Basic Usage

### Initializing the SDK

```typescript
import { YoinkSDK } from "yoink-sdk";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

// Setup connection and provider
const connection = new Connection("RPC_URL_LINK");
const wallet = new NodeWallet(yourKeypair);
const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });

// Initialize SDK
const sdk = new YoinkSDK(provider);
```

## Core Features

### 💰 Trading Operations

#### Buy Tokens

```typescript
// Basic buy with SOL
const buyResult = await sdk.buy(
  userKeypair,                              // Your funded keypair
  new PublicKey("MINT_ADDRESS"),            // Token mint address
  BigInt(0.1 * LAMPORTS_PER_SOL),          // 0.1 SOL to spend
  BigInt(500),                             // 5% slippage (500 basis points)
  {                                        // Optional priority fees
    unitLimit: 400000,
    unitPrice: 100000
  }
);

if (buyResult.success) {
  console.log("✅ Buy successful! Signature:", buyResult.signature);
} else {
  console.error("❌ Buy failed:", buyResult.error);
}
```

#### Sell Tokens

```typescript
// Sell tokens for SOL
const tokenAmount = BigInt(1000000 * Math.pow(10, 6)); // 1M tokens (6 decimals)

const sellResult = await sdk.sell(
  userKeypair,                    // Your keypair with tokens
  new PublicKey("MINT_ADDRESS"),  // Token mint address
  tokenAmount,                    // Amount to sell
  BigInt(500)                     // 5% slippage
);

if (sellResult.success) {
  console.log("✅ Sell successful! Signature:", sellResult.signature);
}
```

#### Get Price Quotes

```typescript
// Get buy quote before purchasing
const buyQuote = await sdk.getBuyQuote(
  new PublicKey("MINT_ADDRESS"),
  BigInt(0.1 * LAMPORTS_PER_SOL),
  BigInt(500) // 5% slippage
);

console.log("You will receive:", buyQuote.tokenAmount, "tokens");
console.log("Price per token:", buyQuote.pricePerToken, "SOL");
console.log("Price impact:", buyQuote.priceImpact.toFixed(2), "%");

// Get sell quote
const sellQuote = await sdk.getSellQuote(
  new PublicKey("MINT_ADDRESS"),
  BigInt(1000000 * Math.pow(10, 6)), // 1M tokens
  BigInt(500)
);

console.log("You will receive:", Number(sellQuote.solAmount) / LAMPORTS_PER_SOL, "SOL");
console.log("Price impact:", sellQuote.priceImpact.toFixed(2), "%");
```

### 📊 Market Data & Analytics

#### Get Bonding Curve Information

```typescript
const bondingCurve = await sdk.getBondingCurveAccount(new PublicKey("MINT_ADDRESS"));

if (bondingCurve) {
  console.log("Market Cap:", Number(bondingCurve.getMarketCapSOL()) / LAMPORTS_PER_SOL, "SOL");
  console.log("Price per Token:", bondingCurve.getPricePerToken(), "SOL");
  console.log("Total Supply:", bondingCurve.tokenTotalSupply.toString());
  console.log("Virtual SOL Reserves:", bondingCurve.virtualSolReserves.toString());
  console.log("Virtual Token Reserves:", bondingCurve.virtualTokenReserves.toString());
  console.log("Real SOL Reserves:", bondingCurve.realSolReserves.toString());
  console.log("Real Token Reserves:", bondingCurve.realTokenReserves.toString());
  console.log("Is Complete:", bondingCurve.complete);
  console.log("Total Buyers:", bondingCurve.totalBuyers.toString());
}
```

#### Get Protocol Information

```typescript
const globalAccount = await sdk.getGlobalAccount();

console.log("Protocol initialized:", globalAccount.initialized);
console.log("Fee basis points:", globalAccount.feeBasisPoints.toString(), "(", Number(globalAccount.feeBasisPoints) / 100, "%)");
console.log("Fee recipient:", globalAccount.feeRecipient.toBase58());
console.log("Authority:", globalAccount.authority.toBase58());
console.log("Initial virtual SOL reserves:", globalAccount.initialVirtualSolReserves.toString());
console.log("Initial virtual token reserves:", globalAccount.initialVirtualTokenReserves.toString());
console.log("Buybacks enabled:", globalAccount.buybacksEnabled);
console.log("Early bird enabled:", globalAccount.earlyBirdEnabled);
```

## Advanced Features

### 🔄 Price Monitoring

```typescript
async function monitorPrice(mintAddress: PublicKey, intervalMs: number = 10000) {
  console.log(`🔍 Monitoring price for ${mintAddress.toBase58()}`);
  
  setInterval(async () => {
    try {
      const curve = await sdk.getBondingCurveAccount(mintAddress);
      if (curve) {
        const marketCap = Number(curve.getMarketCapSOL()) / LAMPORTS_PER_SOL;
        const pricePerToken = curve.getPricePerToken();
        
        console.log(`💰 Market Cap: ${marketCap.toFixed(4)} SOL`);
        console.log(`📈 Price: ${pricePerToken} SOL per token`);
        console.log(`👥 Total Buyers: ${curve.totalBuyers.toString()}`);
        console.log("---");
      }
    } catch (error) {
      console.error("❌ Error fetching price:", error);
    }
  }, intervalMs);
}

// Monitor every 10 seconds
monitorPrice(new PublicKey("MINT_ADDRESS"));
```

### 🎯 Smart Trading with Price Checks

```typescript
async function smartBuy(
  mintAddress: PublicKey,
  solAmount: bigint,
  maxPriceImpact: number = 5,
  maxSlippage: number = 500
): Promise<boolean> {
  try {
    // First get a quote to check price impact
    const quote = await sdk.getBuyQuote(mintAddress, solAmount, BigInt(maxSlippage));
    
    console.log(`💡 Quote: ${quote.tokenAmount} tokens for ${Number(solAmount) / LAMPORTS_PER_SOL} SOL`);
    console.log(`📊 Price impact: ${quote.priceImpact.toFixed(2)}%`);
    
    if (quote.priceImpact > maxPriceImpact) {
      console.log(`⚠️ Price impact too high (${quote.priceImpact.toFixed(2)}% > ${maxPriceImpact}%)`);
      return false;
    }
    
    // Execute the buy if price impact is acceptable
    const result = await sdk.buy(
      userKeypair,
      mintAddress,
      solAmount,
      BigInt(maxSlippage)
    );
    
    if (result.success) {
      console.log("✅ Smart buy executed successfully!");
      console.log("🔗 Signature:", result.signature);
      return true;
    } else {
      console.error("❌ Smart buy failed:", result.error);
      return false;
    }
  } catch (error) {
    console.error("❌ Smart buy error:", error);
    return false;
  }
}
```

## Error Handling

### Common Error Patterns

```typescript
async function safeTrade() {
  try {
    const result = await sdk.buy(
      userKeypair,
      mintAddress,
      BigInt(0.1 * LAMPORTS_PER_SOL),
      BigInt(500)
    );
    
    if (!result.success) {
      if (result.error instanceof Error) {
        const errorMessage = result.error.message.toLowerCase();
        
        if (errorMessage.includes("insufficient funds")) {
          console.log("❌ Not enough SOL in wallet");
        } else if (errorMessage.includes("slippage")) {
          console.log("❌ Price moved too much, try increasing slippage");
        } else if (errorMessage.includes("account not found")) {
          console.log("❌ Token or bonding curve not found");
        } else {
          console.log("❌ Transaction failed:", result.error.message);
        }
      }
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}
```

## Constants & Utilities

### Available Constants

```typescript
import { 
  GLOBAL_ACCOUNT_SEED,    // "global"
  BONDING_CURVE_SEED,     // "bonding-curve"
  HOLDER_STATS_SEED,      // "holder-stats"
  DEFAULT_DECIMALS        // 6
} from "yoink-sdk";
```

### Helper Functions

```typescript
// Get Program Derived Addresses (PDAs)
const bondingCurvePDA = sdk.getBondingCurvePDA(mintAddress);
const globalPDA = sdk.getGlobalPDA();
const holderStatsPDA = sdk.getHolderStatsPDA(mintAddress, userPublicKey);

console.log("Bonding Curve PDA:", bondingCurvePDA.toBase58());
console.log("Global PDA:", globalPDA.toBase58());
console.log("Holder Stats PDA:", holderStatsPDA.toBase58());
```

## Best Practices

### 🔐 Security

- Always validate mint addresses before trading
- Use appropriate slippage settings for market conditions
- Implement proper error handling for all operations
- Never expose private keys in code

### ⚡ Performance

- Cache bonding curve data when monitoring multiple tokens
- Use batch requests when possible
- Implement proper rate limiting to avoid RPC throttling
- Handle network timeouts gracefully

## Next Steps

- [📝 See Example Script 1 in action](example-1.md)
- [🛠️ Try Example Script 2](example-2.md)
- [🤖 Build a Trading Bot](creator-token-bot.md)