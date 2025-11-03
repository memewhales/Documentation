# Fee Distribution

## Overview

Understanding how fees are collected, distributed, and utilized is crucial to grasping Yoink's economic model. This page breaks down the complete fee system and where your trading fees go.

## Fee Structure

### Trading Fees

Every trade on Yoink incurs a small fee:

```
📊 Standard Trading Fee: 1% per transaction

Example Trade:
Buy 1000 tokens with 10 SOL
├─ Trade Amount: 10 SOL
├─ Platform Fee: 0.1 SOL (1%)
└─ You Receive: Tokens worth 9.9 SOL
```

### Fee Breakdown

The 1% trading fee is distributed as follows:

```
100% Trading Fee Distribution:

├─ 60% → Creator Rewards 💰
│   └─ Goes to token creator (if verified)
│
├─ 20% → Platform Treasury 🏦
│   └─ Used for $YOINK buybacks and burns
│
├─ 10% → Early Bird Pool 🐦
│   └─ Distributed among top 20 holders
│
└─ 10% → Liquidity & Development 🔧
    └─ Platform operations and improvements
```

## Fee Recipients

### 1. Creator Rewards (60%)

**Who Gets It:**
* The verified creator whose token is being traded
* If creator is unverified, held in escrow until verification

**How It Works:**
* Accumulates with every trade
* Creator can claim anytime after verification
* Paid out in SOL
* No minimum claim amount
* Instant withdrawal

**Example:**
```
Daily Volume: 1000 SOL
Total Fees: 10 SOL
Creator Share: 6 SOL

Monthly Volume: 30,000 SOL
Monthly Creator Earnings: 180 SOL
```

### 2. Platform Treasury (20%)

**Purpose:**
* Fund $YOINK buybacks
* Constant burn mechanism
* Platform sustainability
* Future development

**Allocation:**
```
Platform Treasury Usage:

├─ 70% → $YOINK Buyback & Burn 🔥
│   └─ Buy from market and burn permanently
│
├─ 20% → Development Fund 💻
│   └─ Engineering, design, features
│
└─ 10% → Marketing & Growth 📈
    └─ User acquisition, partnerships
```

**Transparency:**
* All buybacks are on-chain
* Burns are publicly verifiable
* Treasury wallet address is public
* Regular financial reports

### 3. Early Bird Pool (10%)

**Who Gets It:**
* First 20 buyers of each token
* Must still hold tokens (no selling)
* Distributed proportionally to holdings

**Distribution Method:**
```
Early Bird Rewards Distribution:

Total Pool: 10% of trading fees
20 Active Seats

Each holder receives share based on:
├─ Holding amount (% of total held by Early Birds)
├─ Time held (longer = better)
└─ Seat position (#1 gets slight bonus)
```

**Example:**
```
Token Daily Volume: 100 SOL
Early Bird Pool: 1 SOL (10% of 10 SOL fees)

Early Bird #1 (holds 10% of all EB tokens): 0.12 SOL
Early Bird #5 (holds 5% of all EB tokens): 0.06 SOL
...and so on for all 20 seats
```

### 4. Liquidity & Development (10%)

**Usage:**
* Platform maintenance
* Server infrastructure
* Customer support
* Security audits
* Bug fixes
* Feature development

**Accountability:**
* Quarterly reports on usage
* Community transparency
* Efficient spending
* Reinvested in platform

## Fee Collection

### When Fees Are Charged

Fees apply to:
* ✅ Buy transactions
* ✅ Sell transactions
* ✅ Both bonding curve trades
* ✅ Post-graduation Raydium trades (partial)

Fees DO NOT apply to:
* ❌ Wallet-to-wallet transfers
* ❌ Holding tokens
* ❌ Viewing content
* ❌ Creating tokens (separate fee)

### Fee Calculation

**On Bonding Curve:**
```
Buy Order: 10 SOL
├─ Base Cost: 10 SOL
├─ Trading Fee: 0.1 SOL (1%)
└─ Total Cost: 10.1 SOL

Sell Order: 1000 tokens worth 10 SOL
├─ Base Value: 10 SOL
├─ Trading Fee: 0.1 SOL (1%)
└─ You Receive: 9.9 SOL
```

**Post-Graduation:**
```
On Raydium trades, Yoink still collects:
├─ 0.25% platform fee (reduced)
├─ Plus Raydium's standard 0.25% LP fee
└─ Total: 0.5% (much lower than bonding curve)
```

## Real-Time Tracking

### Where Fees Go

You can track fee distribution:

**On Platform:**
* Creator dashboard shows accumulated fees
* Early Bird page shows pool size
* Treasury page shows buyback activity
* Burn page shows total burned

**On-Chain:**
* All fee transactions are public
* View on Solana Explorer
* Verify distributions
* Track treasury wallet

## Creator Fee Claims

### How Creators Get Paid

**Step 1: Accumulation**
* Fees collect automatically
* Tracked per token
* Real-time updates

**Step 2: Verification**
* Creator verifies account
* Proves ownership
* Links token to profile

**Step 3: Claiming**
* Login to creator dashboard
* View accumulated fees
* Click "Claim Rewards"
* Instant withdrawal to wallet

### Claim Process

```
Creator Dashboard:

Your Tokens:
├─ Token ABC
│   ├─ Accumulated Fees: 45.3 SOL
│   ├─ Last Claim: 5 days ago
│   └─ [Claim Now] button
│
└─ Token XYZ
    ├─ Accumulated Fees: 12.8 SOL
    ├─ Last Claim: Never
    └─ [Claim Now] button

Total Claimable: 58.1 SOL
[Claim All] button
```

## Fee Transparency

### Public Data

All fee information is transparent:

* **Live Dashboard**: yoink.gg/fees
* **Creator Earnings**: Public leaderboard
* **Early Bird Pools**: Real-time balances
* **Treasury Activity**: All buybacks visible
* **Burn Records**: Complete burn history

### Monthly Reports

Published monthly:
* Total fees collected
* Distribution breakdown
* Creator payments made
* Tokens burned
* Treasury health

## Fee Optimization

### For Traders

**Reducing Fee Impact:**
* Trade larger amounts less often
* Wait for high liquidity (lower slippage)
* Use limit orders (coming soon)
* Monitor gas prices

**Understanding Value:**
* Fees support creators directly
* Buybacks benefit all $YOINK holders
* Early Bird rewards for early believers
* Platform improvements benefit everyone

### For Creators

**Maximizing Earnings:**
* Promote your token
* Stream regularly
* Engage community
* Grow trading volume
* Verify early to start claiming

## Comparison to Other Platforms

### Fee Comparison

| Platform | Trading Fee | Creator Share | Transparency |
|----------|------------|---------------|--------------|
| **Yoink** | 1.0% | 60% | Full on-chain |
| Platform A | 2.0% | 0% | Limited |
| Platform B | 1.5% | 30% | Partial |
| Platform C | 0.5% | 0% | None |

### Why Our Fee Structure?

**Balanced Approach:**
* Not the lowest (but sustainable)
* High creator share (60%)
* Benefits token holders (burns)
* Rewards early supporters (Early Birds)
* Funds development (10%)

## Future Fee Adjustments

### Governance Plans

Eventually, fees may be adjusted by:
* Community governance votes
* Data-driven analysis
* Market conditions
* Competitive landscape
* Platform sustainability needs

### Potential Changes

Could see in future:
* Volume-based fee tiers
* Loyalty discounts for $YOINK holders
* Creator performance bonuses
* Dynamic fee rates
* Cross-chain fee optimization

## Fee FAQs

### Common Questions

**Q: Can fees be waived?**
A: No, fees ensure platform sustainability and creator rewards.

**Q: Why 1%?**
A: Balanced to be competitive while properly rewarding creators.

**Q: Do creators always get 60%?**
A: Yes, it's hardcoded into the smart contract.

**Q: Can I see where my fees went?**
A: Yes, all distributions are on-chain and verifiable.

**Q: Will fees ever increase?**
A: Only through community governance (not planned).

**Q: Are fees different post-graduation?**
A: Yes, reduced to 0.25% on Raydium trades.

---

## Fee Distribution Flow

### Complete Journey

```
You Trade 10 SOL
    ↓
Fee Collected: 0.1 SOL
    ↓
Split into 4 parts:
    ↓
├─ 0.06 SOL → Creator 💰
│   └─ Held until claimed
│
├─ 0.02 SOL → Treasury 🏦
│   └─ Buys $YOINK → Burns 🔥
│
├─ 0.01 SOL → Early Birds 🐦
│   └─ Distributed to top 20 holders
│
└─ 0.01 SOL → Development 💻
    └─ Platform improvements
```

---

> 💡 Understanding fee distribution helps you see how your trades support creators, benefit long-term holders, and fund platform growth. It's a win-win-win ecosystem!

## Learn More

* [Fee Structure](fees.md) - Detailed fee breakdown
* [Creator Rewards](../creators/claim-rewards.md) - How to claim
* [Early Birds](../features/early-birds.md) - Early holder rewards
* [Constant Burn](../features/constant-burn.md) - Token burns explained
