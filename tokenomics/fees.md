---
icon: percent
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

# Trading Fees

Comprehensive breakdown of Yoink's fee structure for creator token trading and platform operations.

## Fee Overview

**Standard Trading Fee: 5%**

Applied to all buy and sell transactions on Yoink's bonding curve platform.

{% hint style="info" %}
**Transparent Fees**: All fees clearly displayed before trade confirmation. No hidden costs.
{% endhint %}

## Fee Distribution

### When You Trade

Every trade's 5% fee is distributed:

```
5% Total Trading Fee
│
├── 40% → Creator (~2% of trade)
│   └── Token creator earnings
│
├── 40% → Early Birds (~2% of trade)
│   └── Split among 20 Early Bird holders
│   └── Each Early Bird gets ~0.1% of trade
│
└── 20% → Treasury (~1% of trade)
    ├── 50% → YOINK Buybacks
    │   └── Buy & burn platform token
    └── 50% → Platform Operations
        ├── Development
        ├── Infrastructure
        ├── Marketing
        └── Team
```

### Detailed Breakdown

**Example: 10 SOL Buy**

| Recipient | Percentage | Amount |
|-----------|------------|--------|
| **You Get** | 95% | 9.5 SOL worth of tokens |
| **Total Fee** | 5% | 0.5 SOL |
| ↳ Creator | 2% | 0.2 SOL |
| ↳ Early Birds (20 total)** | 2% | 0.2 SOL |
| ↳ Each Early Bird | 0.1% | 0.01 SOL |
| ↳ Treasury | 1% | 0.1 SOL |
| ↳↳ Buybacks | 0.5% | 0.05 SOL |
| ↳↳ Operations | 0.5% | 0.05 SOL |

## Fee Reductions

### YOINK Token Holders

Hold YOINK to reduce trading fees:

| YOINK Balance | Discount | Effective Fee |
|---------------|----------|---------------|
| **0** | 0% | 5.0% |
| **1,000** | 5% off | 4.75% |
| **10,000** | 10% off | 4.5% |
| **50,000** | 20% off | 4.0% |
| **100,000** | 30% off | 3.5% |
| **500,000** | 40% off | 3.0% |
| **1,000,000+** | 50% off | 2.5% |

**How Discount Works**:

```
Normal Fee: 5%
Discount: 50% (holding 1M+ YOINK)
Discounted Fee: 2.5%

Your 10 SOL trade:
- Without YOINK: Pay 0.5 SOL fee
- With 1M YOINK: Pay 0.25 SOL fee
- Savings: 0.25 SOL (50%)
```

{% hint style="success" %}
**Active Traders**: If you trade frequently, holding YOINK can save substantial fees!
{% endhint %}

[Learn more about YOINK token →](yoink-token.md)

### Volume Tiers (Coming Soon)

**Planned Feature**:

Monthly volume-based discounts:

| Monthly Volume | Additional Discount |
|----------------|---------------------|
| **100+ SOL** | -5% fee |
| **500+ SOL** | -10% fee |
| **1,000+ SOL** | -15% fee |
| **5,000+ SOL** | -20% fee |
| **10,000+ SOL** | -25% fee |

**Stacks with YOINK discount** (up to maximum 75% total reduction)

## Network Fees (Gas)

### Solana Transaction Fees

**Separate from trading fees**:

* **Standard**: ~0.000005 SOL (~$0.0001)
* **Priority**: 0.00001-0.0001 SOL
* **Used for**: Network validation

**Yoink doesn't collect gas fees** - goes to Solana validators.

### When You Pay Gas

* Every buy transaction
* Every sell transaction
* Claiming rewards
* Any blockchain interaction

{% hint style="info" %}
**Efficient**: Solana's low gas fees mean you can trade frequently without worrying about network costs!
{% endhint %}

## Fee Calculations

### Buy Transaction

**Scenario**: Buy with 10 SOL

```
Amount Spent: 10 SOL
Trading Fee (5%): 0.5 SOL
Goes to Trade: 9.5 SOL
Gas Fee: ~0.000005 SOL

Tokens Received: Based on 9.5 SOL
Total Cost: 10.000005 SOL
```

**Fee Recipients**:
```
Creator: 0.2 SOL
Early Birds (20): 0.2 SOL total (0.01 each)
Treasury: 0.1 SOL
  ↳ Buybacks: 0.05 SOL
  ↳ Operations: 0.05 SOL
```

### Sell Transaction

**Scenario**: Sell tokens worth 10 SOL

```
Token Value: 10 SOL
Trading Fee (5%): 0.5 SOL
You Receive: 9.5 SOL
Gas Fee: ~0.000005 SOL

Net Proceeds: 9.499995 SOL
```

**Same Distribution**:
* Creator: 0.2 SOL
* Early Birds: 0.2 SOL
* Treasury: 0.1 SOL

## Comparing Fees

### Yoink vs Other Platforms

| Platform | Trading Fee | Network Fee | Notes |
|----------|-------------|-------------|-------|
| **Yoink** | 5% | ~$0.0001 | Benefits creators & holders |
| **Pump.fun** | 1% | ~$0.0001 | Lower fee, no Early Birds |
| **Uniswap** | 0.3% | $5-50 | Ethereum gas expensive |
| **Raydium** | 0.25% | ~$0.0001 | Standard DEX |
| **Coinbase** | 1.5%+ | $0 | CEX, custodial |

**Why Yoink's Fee is Higher**:

* ✅ **Creators earn**: 40% goes directly to creators
* ✅ **Early Birds earn**: 40% rewards early supporters
* ✅ **Platform sustainability**: 20% funds operations & buybacks
* ✅ **Aligned incentives**: Everyone benefits from success
* ✅ **No rug pulls**: No liquidity to remove

### Value for Fee

**What You Get**:

* 🎯 Support creators directly
* 🏆 Early Bird rewards (if holder)
* 💰 Platform token buybacks
* 📊 Professional tools & charts
* 🔒 Secure bonding curve
* 📺 Stream integration
* 💬 Community features

## Fee Transparency

### Real-Time Display

Before every trade:

* **You Pay**: Total SOL needed
* **Trading Fee**: Exact amount
* **You Receive**: Tokens/SOL after fees
* **Price Impact**: From your trade size
* **Gas Fee**: Estimated network cost

### Transaction Receipt

After trade confirms:

* Total spent/received
* Fee breakdown
* Transaction hash
* Timestamp
* New balance

### Fee History

Track your fees:

* **Profile → History**: All trades
* **Fee Total**: Lifetime fees paid
* **Monthly Breakdown**: Fees per month
* **Per Token**: Fees per token traded
* **Export CSV**: Tax documentation

## Creator Fee Earnings

### How Much Creators Earn

**From Each Trade**:

* 40% of 5% fee = **2% of trade value**

**Example Monthly Earnings**:

```
Token Monthly Volume: 10,000 SOL
Total Fees Generated: 500 SOL (5%)
Creator Receives: 200 SOL (40% of fees)

Annual Projection: ~2,400 SOL
```

### Claiming Creator Fees

* Accumulated automatically
* Claim anytime (recommend weekly/monthly)
* Gas-efficient batch claiming
* Direct to wallet

[Learn more about creator earnings →](../creators/creator-guide.md)

## Early Bird Fee Earnings

### How Much Early Birds Earn

**From Each Trade**:

* 40% of 5% fee = **2% of trade value**
* Divided by 20 = **0.1% per Early Bird**

**Example Monthly Earnings**:

```
Token Monthly Volume: 10,000 SOL
Total Fees Generated: 500 SOL (5%)
Early Bird Pool: 200 SOL (40% of fees)
Per Early Bird: 10 SOL (1/20th of pool)

Annual Projection: ~120 SOL per seat
```

### Claiming Early Bird Rewards

* Earned continuously
* Claim when convenient
* Multiple tokens = multiple income streams
* Passive income for holding

[Learn more about Early Bird rewards →](../traders/early-bird-bonus.md)

## Treasury Use

### Platform Operations (50%)

**Funds Used For**:

* 💻 **Development**: New features, bug fixes
* 🖥️ **Infrastructure**: Servers, databases, CDN
* 📱 **Mobile Apps**: iOS & Android development
* 🔐 **Security**: Audits, monitoring, protection
* 👥 **Team**: Salaries, contractors
* 📢 **Marketing**: Growth, awareness, partnerships
* 🎓 **Education**: Tutorials, documentation, support

### YOINK Buybacks (50%)

**Deflationary Mechanism**:

* 50% of treasury buys YOINK from market
* Purchased tokens permanently burned
* Reduces total supply
* Benefits all YOINK holders
* Weekly buyback events

**Buyback Schedule**:

* **Weekly**: Small continuous burns
* **Monthly**: Larger coordinated events
* **Quarterly**: Major burn celebrations
* **Annual**: Mega burn events

[Learn more about buybacks →](buyback-burn.md)

## Fee Changes

### Governance

**YOINK holders vote on**:

* Fee percentage adjustments
* Distribution ratio changes
* Discount tier modifications
* New fee structures

**Current Rules**:

* Min 7-day voting period
* Quorum required
* Majority approval needed
* 14-day implementation delay

### Historical Fees

**Since Launch**:

* **Jan 2025 - Present**: 5% standard fee

**No changes planned**, but community can propose via governance.

## Tax Reporting

### Fee Documentation

**For Tax Purposes**:

* Trading fees are part of cost basis
* Reduces capital gains
* Keep detailed records
* Export CSV from platform

**Example**:

```
Buy 1000 tokens for 10 SOL
Trading Fee: 0.5 SOL
Total Cost Basis: 10.5 SOL

Later sell for 15 SOL
Trading Fee: 0.75 SOL
Net Proceeds: 14.25 SOL

Capital Gain: 14.25 - 10.5 = 3.75 SOL
```

{% hint style="warning" %}
**Tax Advice**: Consult a tax professional in your jurisdiction for proper reporting guidance.
{% endhint %}

## Frequently Asked Questions

### Can fees be waived?

**No individual waivers**. Reduce fees by:
* Holding YOINK tokens (up to 50% off)
* Future: High volume tiers

### Do Early Birds pay fees?

**Yes**, Early Birds pay the same trading fees when they buy. They earn from others' trades.

### What if I hold 0.1% of YOINK supply?

**Fee Discount**: Depends on total amount held, not percentage. See discount table above.

### Are fees charged on failed transactions?

**No trading fee** on failures. Only may lose gas fee (network cost, not to Yoink).

### Can creators set custom fees?

**No**, all tokens use standard 5% fee for fairness and platform consistency.

### Do graduated tokens still pay fees?

**On Yoink**: Yes, same 5%
**On DEX**: DEX fees apply (typically 0.25-0.3%)

## Next Steps

<table data-view="cards"><thead><tr><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>YOINK Token</strong></td><td>Get fee discounts with YOINK</td><td><a href="yoink-token.md">yoink-token.md</a></td></tr><tr><td><strong>Creator Guide</strong></td><td>Learn how to maximize fee earnings</td><td><a href="../creators/creator-guide.md">creator-guide.md</a></td></tr><tr><td><strong>Early Birds</strong></td><td>Earn passive income from fees</td><td><a href="../traders/early-bird-bonus.md">early-bird-bonus.md</a></td></tr></tbody></table>
