---
icon: chart-simple
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

# Bonding Curve

Understand Yoink's bonding curve mechanism that determines token pricing and provides instant liquidity.

## What is a Bonding Curve?

A **bonding curve** is an automated market maker (AMM) that uses a mathematical formula to price tokens based on supply and demand.

### Key Concepts

* 📈 **Algorithmic Pricing**: Price determined by formula
* 💧 **Instant Liquidity**: Always able to buy/sell
* 📊 **Predictable**: Price path is deterministic
* 🔄 **No Impermanent Loss**: Single-asset pool
* ⚖️ **Self-Balancing**: Supply and demand equilibrium

{% hint style="info" %}
**Simple Explanation**: As more people buy, the price increases according to a curve. When people sell, the price decreases. No traditional liquidity pools needed!
{% endhint %}

## How It Works

### The Formula

Yoink uses a **linear bonding curve**:

```
Price = Base Price + (Supply × Slope)
```

**Variables**:
* **Base Price**: Starting price (very low)
* **Supply**: Current circulating tokens
* **Slope**: Rate of price increase

### Visual Representation

```
Price
  │
  │                            ╱
  │                        ╱
  │                    ╱
  │                ╱
  │            ╱
  │        ╱
  │    ╱
  │╱
  └────────────────────────────── Supply
```

**Key Insight**: Price rises smoothly as supply increases.

### Example Pricing

**Hypothetical Token Launch**:

| Supply | Price per Token | Market Cap |
|--------|-----------------|------------|
| 0 | 0.000001 SOL | 0 SOL |
| 100K | 0.000010 SOL | 1 SOL |
| 500K | 0.000050 SOL | 25 SOL |
| 1M | 0.000100 SOL | 100 SOL |
| 5M | 0.000500 SOL | 2,500 SOL |
| 10M | 0.001000 SOL | 10,000 SOL |

{% hint style="success" %}
**Graduated**: At ~10M market cap, token migrates to Raydium DEX with deeper liquidity!
{% endhint %}

## Buying on the Curve

### Buy Mechanics

When you buy tokens:

1. **Specify SOL Amount**: Choose how much to spend
2. **Calculate Tokens**: Formula determines tokens received
3. **Price Impact**: Your buy moves price up
4. **SOL Locked**: Your SOL enters bonding curve contract
5. **Tokens Minted**: New tokens created and sent to you

### Price Impact

**Large Buy Example**:

```
Before Buy:
Current Price: 0.000100 SOL
Market Cap: 100 SOL

Your Buy: 10 SOL

After Buy:
New Price: 0.000120 SOL (+20%)
Market Cap: 110 SOL
Price Impact: ~16.7%
```

**Why Price Impact Occurs**:
* You're buying multiple tokens
* Each token costs more than previous
* Price rises along the curve
* Average entry price is calculated

### Optimal Buy Size

**Minimizing Impact**:

* Smaller buys = less slippage
* Multiple buys = better average price
* Wait for sells to lower price
* DCA (Dollar Cost Average) strategy

## Selling on the Curve

### Sell Mechanics

When you sell tokens:

1. **Specify Token Amount**: Choose how many to sell
2. **Calculate SOL**: Formula determines SOL received
3. **Price Impact**: Your sell moves price down
4. **Tokens Burned**: Your tokens are destroyed
5. **SOL Released**: SOL sent from contract to you

### Negative Price Impact

**Large Sell Example**:

```
Before Sell:
Current Price: 0.000120 SOL
Market Cap: 120 SOL

Your Sell: 100K tokens

After Sell:
New Price: 0.000100 SOL (-16.7%)
Market Cap: 110 SOL
Price Impact: ~16.7%
```

### Exit Liquidity

**Always Available**:

* No need for buyers
* Contract always has SOL
* Instant execution
* Predictable exit price

{% hint style="warning" %}
**Early Bird Reminder**: Selling ANY amount forfeits your Early Bird seat permanently!
{% endhint %}

## Supply Dynamics

### Circulating Supply

**Changes With Trading**:

* **Buys**: Increase supply (tokens minted)
* **Sells**: Decrease supply (tokens burned)
* **Net Buys**: Supply grows, price rises
* **Net Sells**: Supply shrinks, price falls

### Maximum Supply

**Graduation Target**:

* Each token has max supply
* Typically ~1 billion tokens
* Reaching max triggers DEX migration
* Bonding curve "graduates" to Raydium

### Supply Tracking

**Real-Time Metrics**:

* Current circulating supply
* % of max supply reached
* Tokens until graduation
* Average token age

## Market Cap Calculation

### Formula

```
Market Cap = Current Supply × Current Price
```

### Growth Path

**Typical Journey**:

```
Launch:     ~1 SOL market cap
Early:      1-10 SOL
Growing:    10-100 SOL
Momentum:   100-1,000 SOL
Trending:   1,000-10,000 SOL
Graduate:   ~10,000 SOL → Raydium
```

### Price Discovery

**Organic Growth**:

* Community buying = price increases
* Selling pressure = price decreases
* Equilibrium found naturally
* No manipulation via LP

## Graduation to DEX

### Trigger Conditions

Token graduates when:

* ✅ Market cap reaches ~10,000 SOL
* ✅ Sufficient holder distribution
* ✅ Trading volume threshold met
* ✅ Time requirements satisfied

### Migration Process

**Automatic Steps**:

1. **Liquidity Pool Created**: On Raydium
2. **Curve SOL Transferred**: Seeded to LP
3. **Token Standard**: SPL token deployed
4. **Trading Continues**: Now on DEX
5. **Yoink Integration**: Still visible on platform

### Post-Graduation

**What Changes**:

* **More Liquidity**: Deeper pools
* **Traditional AMM**: XY=K formula
* **LP Tokens**: Liquidity providers
* **External Trading**: Any DEX can list
* **Still Track on Yoink**: Full integration maintained

**What Stays Same**:

* Early Bird rewards continue
* Creator fees still collected
* Buybacks still occur
* Community intact
* Yoink features work

## Bonding Curve Advantages

### For Traders

* ✅ **Instant Liquidity**: Always can trade
* ✅ **Fair Launch**: Everyone same curve
* ✅ **Predictable Pricing**: Transparent formula
* ✅ **No Rug Pulls**: No LP to remove
* ✅ **Early Opportunity**: Low initial prices

### For Creators

* ✅ **No Initial Liquidity**: Don't need SOL to start
* ✅ **Automatic Market Making**: Set it and forget it
* ✅ **Fair Distribution**: Can't pre-buy unfairly
* ✅ **Revenue from All Trades**: Fees on every tx
* ✅ **Simple**: No complex DeFi knowledge needed

### vs Traditional Liquidity Pools

| Feature | Bonding Curve | Traditional LP |
|---------|---------------|----------------|
| **Initial Liquidity** | Not required | Required |
| **Price Discovery** | Algorithmic | Market-driven |
| **Liquidity** | Always available | Can be removed |
| **Impermanent Loss** | None | Possible |
| **Complexity** | Low | High |
| **Fairness** | High | Varies |

## Trading Strategies

### Early Entry

**Advantages**:

* Lowest prices
* Potential Early Bird seat
* Maximum upside
* First mover advantage

**Risks**:

* Unproven token
* Low liquidity
* High volatility
* Creator uncertainty

### Riding the Curve

**Strategy**:

* Buy during dips
* Sell during pumps
* Follow the curve shape
* Understand support/resistance

**Tools**:

* Chart analysis
* Volume tracking
* Holder growth
* Creator activity

### Pre-Graduation Accumulation

**Concept**:

* Accumulate before DEX migration
* Lower prices on curve
* Position for graduate liquidity
* Exit on DEX if desired

## Understanding Slippage

### What is Slippage?

**Definition**: Difference between expected and actual price

**Causes**:
* Your trade size
* Curve steepness
* Network delays
* Other simultaneous trades

### Calculating Slippage

**Example**:

```
Expected Price: 0.000100 SOL
Actual Price: 0.000105 SOL
Slippage: 5%
```

### Setting Slippage Tolerance

**Recommendations**:

* **Small Trades**: 0.5-1%
* **Medium Trades**: 1-3%
* **Large Trades**: 3-10%
* **Low Liquidity**: 5-15%
* **Urgent**: 10-20%

{% hint style="info" %}
**Auto-Adjust**: Yoink suggests optimal slippage based on trade size and current liquidity.
{% endhint %}

## Curve Parameters

### Customization

Creators can adjust:

* **Base Price**: Starting price point
* **Curve Steepness**: How fast price rises
* **Max Supply**: Total tokens at graduation
* **Fee Structure**: Trading fee percentage

**Recommended Defaults**:
* Used by most successful tokens
* Balanced growth
* Fair for all participants
* Proven track record

### Curve Types

**Available Curves**:

* **Linear**: Steady price increase (standard)
* **Exponential**: Accelerating price (aggressive)
* **Logarithmic**: Decelerating price (conservative)
* **Custom**: Advanced creator options

## Monitoring the Curve

### Dashboard Metrics

Track bonding curve health:

* **Current Price**: Real-time
* **Market Cap Progress**: % to graduation
* **Supply Utilization**: Tokens issued
* **Curve Efficiency**: Buy/sell ratio
* **Liquidity Depth**: SOL in contract

### Health Indicators

**Healthy Curve**:
* ✅ Steady upward price trend
* ✅ Growing holder base
* ✅ Balanced buy/sell ratio
* ✅ Increasing volume
* ✅ Active creator

**Warning Signs**:
* ⚠️ Price stagnation
* ⚠️ Decreasing holders
* ⚠️ Heavy sell pressure
* ⚠️ Declining volume
* ⚠️ Inactive creator

## Advanced Concepts

### Curve Arbitrage

**Opportunity**:

* Price differences between Yoink and other venues
* MEV (Maximal Extractable Value) opportunities
* Statistical arbitrage strategies

**Risks**:

* Gas fees
* Execution risk
* Competition
* Slippage

### Bonding Curve Simulations

**What-If Analysis**:

* Predict price at supply level
* Calculate market cap targets
* Estimate slippage for trade size
* Model growth scenarios

**Tools**:
* Yoink calculator
* Spreadsheet models
* Custom scripts

## Next Steps

<table data-view="cards"><thead><tr><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>How to Buy</strong></td><td>Execute trades on the bonding curve</td><td><a href="../traders/how-to-buy.md">how-to-buy.md</a></td></tr><tr><td><strong>Trading Guide</strong></td><td>Strategies for curve trading</td><td><a href="../traders/trading-guide.md">trading-guide.md</a></td></tr><tr><td><strong>Create Token</strong></td><td>Launch your bonding curve token</td><td><a href="../creators/create-token.md">create-token.md</a></td></tr></tbody></table>
