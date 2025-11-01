---
icon: dollar-sign
layout:
  width: default
  title:
    visible: true
  description:
    visible: true
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
---

# Understanding Fees

Learn about the fee structure on Yoink and where your trading fees go.

## Trading Fees

Every trade on Yoink incurs a small fee that is distributed across multiple mechanisms to create a sustainable ecosystem.

### Fee Breakdown

When you buy or sell a token, the trading fee is split as follows:

| Recipient | Percentage | Purpose |
|-----------|-----------|---------|
| **Creator Rewards** | ~40% | Goes to the token creator |
| **Early Bird Pool** | ~30% | Distributed among Early Bird holders |
| **Buyback Treasury** | ~20% | Used for automatic token buybacks |
| **Platform Fee** | ~10% | Used for Yoink token buyback & burn |

{% hint style="info" %}
**Note**: Exact percentages may vary slightly depending on market conditions and token stage. Check individual token pages for specific fee structures.
{% endhint %}

## Creator Rewards

A significant portion of trading fees goes directly to the creator whose token is being traded. This creates a direct monetization channel for creators based on speculation and trading activity around their brand.

### How Creators Claim Rewards

1. Creator verifies their account (links Twitch/social media)
2. Trading fees accumulate in the creator's reward pool
3. Creator can claim rewards at any time through the dashboard

[Learn more about creator rewards →](../creators/claim-rewards.md)

## Early Bird Pool

The Early Bird mechanism rewards the first 20 holders who haven't sold their tokens. Trading fees accumulate in this pool and are distributed proportionally among eligible Early Birds.

### Eligibility Rules

* Must be one of the first 20 buyers
* Cannot have sold any tokens
* Pool distributed periodically based on holdings

[Learn more about Early Bird rewards →](../traders/early-bird-bonus.md)

## Buyback Treasury

Each token has its own buyback treasury that accumulates trading fees. When the token price drops below the EMA (Exponential Moving Average), the treasury automatically buys back tokens, creating price support.

### How Buybacks Work

1. Trading fees accumulate in the buyback treasury
2. Price monitoring system tracks EMA
3. When price drops below EMA, automatic buyback is triggered
4. Bought tokens are burned, reducing supply

[Learn more about automatic buybacks →](../features/buybacks.md)

## Platform Fees & Yoink Token

A small percentage of all trading fees is used to buyback and burn the Yoink platform token. This creates a **deflationary flywheel** where increased platform activity directly benefits Yoink token holders.

### The Flywheel Effect

```
More Trading Volume
        ↓
More Platform Fees
        ↓
More Yoink Buybacks
        ↓
Reduced Yoink Supply
        ↓
Increased Yoink Value
        ↓
More Platform Adoption
        ↓
(cycle repeats)
```

[Learn more about Yoink tokenomics →](../tokenomics/yoink-token.md)

## Transaction Fees

In addition to trading fees, all Solana transactions require a small network fee (gas):

* **Standard transaction**: ~0.000005 SOL
* **Complex transactions**: ~0.00001 - 0.0001 SOL

{% hint style="success" %}
**Tip**: Always keep at least 0.01 SOL in your wallet to cover transaction fees.
{% endhint %}

## Slippage

When trading, you may encounter slippage - the difference between expected and actual execution price:

* **Low Volume Tokens**: Higher slippage possible
* **High Volume Tokens**: Lower slippage
* **Large Trades**: More slippage impact

You can set maximum slippage tolerance in the trading interface (default: 1-5%).

## Fee Transparency

All fees are transparent and displayed:

* **Before trade execution**: See exact fees in trade preview
* **After trade**: View fee breakdown in transaction history
* **Token page**: Check fee distribution structure

## Bonded Tokens

When a token reaches its bonding curve target and "graduates" to Raydium:

* Trading fees structure may change
* Liquidity is locked and migrated
* Token continues on DEX with standard AMM mechanics

[Learn more about bonding curves →](../features/bonding-curve.md)
