---
icon: fire-flame-curved
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

# Buyback & Burn

Yoink's deflationary mechanism that uses platform revenue to buy and permanently burn YOINK tokens, reducing supply and supporting price.

## Overview

**Automatic Buyback System**: 50% of platform treasury continuously buys YOINK from the market and burns it forever.

### Key Features

* 🔥 **Permanent Burns**: Tokens removed from circulation
* 📊 **Transparent**: All burns visible on-chain
* ⚡ **Automatic**: Weekly scheduled buybacks
* 💰 **Revenue-Funded**: From trading fee treasury
* 📈 **Deflationary**: Decreasing supply over time

## How It Works

### Revenue Collection

```
Trading Fees → 20% to Treasury
├── 50% → YOINK Buybacks
└── 50% → Platform Operations
```

### Buyback Process

1. **Accumulate SOL**: From trading fees (10% of all fees)
2. **Weekly Schedule**: Every Monday at 12:00 UTC
3. **Market Buy**: Purchase YOINK from Raydium DEX
4. **Burn Address**: Send to null address
5. **Announce**: Tweet burn amount & transaction hash
6. **Update Metrics**: Supply counters updated

### Burn Schedule

| Frequency | Typical Amount | Purpose |
|-----------|----------------|---------|
| **Weekly** | 10K-50K YOINK | Consistent deflation |
| **Monthly** | 100K-500K YOINK | Major events |
| **Quarterly** | 500K-2M YOINK | Celebrations |
| **Annual** | 5M-20M YOINK | Anniversary mega-burn |

## Token Lifecycle

### Supply Reduction

```
Initial Supply: 1,000,000,000 YOINK
- Month 1 Burn: -2,500,000
- Month 2 Burn: -3,200,000
- Month 3 Burn: -4,100,000
...
Circulating Supply: Decreasing forever
```

### Long-Term Impact

**5-Year Projection**:
* Estimated burns: 15-30% of supply
* Remaining supply: 700M-850M YOINK
* Per-token value: Theoretically increases
* Holder benefits: Increased scarcity

## Economic Benefits

### For YOINK Holders

* ✅ **Reduced Supply**: Increased scarcity
* ✅ **Deflationary Pressure**: Supports price
* ✅ **Value Accrual**: Platform success → more burns
* ✅ **Long-term Alignment**: Encourages holding

### For Platform

* ✅ **Sustainable Tokenomics**: No inflation
* ✅ **Aligned Incentives**: Growth benefits all
* ✅ **Community Confidence**: Transparent burns
* ✅ **Competitive Edge**: Better than inflationary models

## Transparency

### Real-Time Tracking

**Burn Dashboard**: yoink.now/burns

View:
* Total burned (all-time)
* Recent burn events
* Next scheduled buyback
* Burn calendar
* Transaction hashes

### On-Chain Verification

Every burn verifiable:
* Solscan transaction links
* Burn wallet address
* Amount and timestamp
* Source of funds

### Statistics

Track metrics:
* **Burn Rate**: Tokens/day
* **% Burned**: Of total supply
* **SOL Spent**: On buybacks
* **Avg Price**: Of burned tokens
* **Projections**: Future burns

## Comparison to Other Models

| Model | YOINK | BNB | UNI | CAKE |
|-------|-------|-----|-----|------|
| **Burn Mechanism** | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **Regular Schedule** | ✅ Weekly | ✅ Quarterly | - | ✅ Weekly |
| **Revenue-Funded** | ✅ Yes | ✅ Yes | - | ✅ Yes |
| **Transparent** | ✅ On-chain | ✅ On-chain | - | ✅ On-chain |

## Creator Token Buybacks

**Separate System**: Creator tokens also have automatic buybacks

* Triggered by EMA crossover
* Uses treasury from token fees
* Burns creator tokens (not YOINK)
* Supports token price
* Visible on charts (🔥 markers)

[Learn more about creator token buybacks →](../features/buybacks.md)

## Future Enhancements

**Roadmap**:

* 📊 Enhanced burn analytics
* 🗳️ Community vote on burn schedule
* 🎁 Burn event celebrations
* 🔥 NFT commemorating major burns
* 📈 Dynamic burn amounts based on metrics

## Next Steps

<table data-view="cards"><thead><tr><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>YOINK Token</strong></td><td>Understand platform token</td><td><a href="yoink-token.md">yoink-token.md</a></td></tr><tr><td><strong>Creator Buybacks</strong></td><td>Automatic token buybacks</td><td><a href="../features/buybacks.md">buybacks.md</a></td></tr><tr><td><strong>Fees</strong></td><td>How buybacks are funded</td><td><a href="fees.md">fees.md</a></td></tr></tbody></table>
