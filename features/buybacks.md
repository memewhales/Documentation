---
icon: rotate
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

# Automatic Buybacks

Yoink's automatic buyback mechanism creates price support for every token by using accumulated trading fees to buy back tokens when prices drop.

## What are Buybacks?

Each token on Yoink has a **buyback treasury** that:

* Accumulates a percentage of trading fees
* Monitors token price against EMA (Exponential Moving Average)
* Automatically buys back tokens when price drops below EMA
* Burns the bought tokens, permanently reducing supply

{% hint style="success" %}
**Key Benefit**: Buybacks create a dynamic price floor that strengthens as trading volume increases!
{% endhint %}

## How It Works

### 1. Treasury Accumulation

```
Every Trade → Trading Fee → Buyback Treasury
```

* ~20% of each trade's fees go to buyback treasury
* Treasury accumulates SOL over time
* More trading = larger treasury = stronger buybacks

### 2. Price Monitoring

The system continuously monitors:

* **Current Price**: Real-time token price
* **EMA (Exponential Moving Average)**: Price trend indicator
* **Treasury Balance**: Available SOL for buybacks
* **Market Conditions**: Optimal buyback timing

### 3. Automatic Execution

When price drops below EMA:

1. **Trigger Detected**: Price < EMA for specified period
2. **Buyback Initiated**: Treasury executes buy order
3. **Tokens Purchased**: Market buy at current price
4. **Tokens Burned**: Bought tokens permanently removed
5. **Supply Reduced**: Total circulating supply decreases

### 4. Visual Indicators

On the TradingView chart, burn events appear as:

* 🔥 **Burn Marks**: Visual indicators on chart
* **Timestamp**: When buyback occurred
* **Amount**: SOL spent and tokens burned
* **Impact**: Price effect visible

## Benefits of Buybacks

### For Token Holders

* **Price Support**: Automatic buying pressure when price falls
* **Supply Reduction**: Each buyback reduces total supply
* **Confidence**: Know there's a safety mechanism
* **Long-term Value**: Deflationary pressure over time

### For Traders

* **Predictable Support**: Know buybacks trigger below EMA
* **Trading Strategy**: Can anticipate buyback levels
* **Risk Management**: Reduced downside risk
* **Volume Rewards**: More trading = larger treasury

### For Creators

* **Token Stability**: Less volatile price action
* **Holder Retention**: Holders more confident long-term
* **Reputation**: Shows platform cares about token health
* **Sustainable Growth**: Supports long-term appreciation

## The Buyback Flywheel

```
More Trading Volume
        ↓
Larger Buyback Treasury
        ↓
More Buying Pressure
        ↓
Price Support Stronger
        ↓
Holder Confidence Increases
        ↓
More Trading Activity
        ↓
(cycle repeats)
```

## EMA Explained

### What is EMA?

**Exponential Moving Average (EMA)** is a technical indicator that:

* Tracks average price over time
* Gives more weight to recent prices
* Smooths out price volatility
* Identifies price trends

### Why Use EMA?

* **Trend Indicator**: Shows if price is above or below trend
* **Support Level**: Acts as dynamic support line
* **Buyback Trigger**: Objective, automated trigger point
* **Market Standard**: Widely used in trading

### EMA Settings

Default settings for Yoink:

* **Period**: 20 (20-period EMA)
* **Timeframe**: 1-hour candles
* **Calculation**: Exponentially weighted average

## Buyback Scenarios

### Scenario 1: Gradual Decline

* Price slowly drops below EMA
* Small, frequent buybacks occur
* Provides consistent support
* Prevents further decline

### Scenario 2: Sharp Drop

* Price crashes below EMA
* Large buyback triggered
* Significant buying pressure
* Often creates bounce

### Scenario 3: Sideways Action

* Price oscillates around EMA
* Periodic small buybacks
* Maintains price range
* Accumulates position

## Treasury Management

### How Treasury Grows

| Activity | Treasury Impact |
|----------|----------------|
| **Buy Transaction** | +0.X% of trade |
| **Sell Transaction** | +0.X% of trade |
| **High Volume Day** | Significant growth |
| **Low Volume Day** | Minimal growth |

### Treasury Usage

Treasury SOL is ONLY used for:

* ✅ Buying back tokens below EMA
* ✅ Burning purchased tokens
* ❌ NOT used for anything else
* ❌ NOT withdrawable by anyone

### Viewing Treasury

Check treasury on token page:

* **Treasury Balance**: Current SOL available
* **Total Buybacks**: Lifetime buyback amount
* **Tokens Burned**: Total tokens removed
* **Last Buyback**: Most recent burn event

## Buyback History

### Tracking Buybacks

View historical buybacks:

* **Date & Time**: When buyback occurred
* **SOL Spent**: Amount used from treasury
* **Tokens Burned**: Quantity removed from supply
* **Price Impact**: Effect on token price
* **Transaction**: On-chain verification

### Chart Visualization

On TradingView charts:

* 🔥 Burn marks at buyback points
* Hover for details (amount, timestamp)
* Visual correlation with price movement
* Historical pattern analysis

## Strategic Implications

### For Buyers

**Buy Strategy**:
* Consider buying near EMA for safety
* Monitor treasury size for support strength
* Larger treasury = stronger floor
* Wait for buyback completion before entry

### For Sellers

**Sell Strategy**:
* Selling below EMA may trigger buyback
* Could see bounce after sell
* Consider selling above EMA
* Monitor treasury before large sells

### For Holders

**Hold Strategy**:
* Confidence in downside protection
* Each buyback strengthens position
* Long-term deflationary benefit
* Reduced supply = your % increases

## Comparison to Other Platforms

| Feature | Yoink | Traditional Launchpads |
|---------|-------|----------------------|
| **Buyback Treasury** | ✅ Yes, automatic | ❌ No |
| **Price Support** | ✅ Built-in | ❌ Market only |
| **Supply Reduction** | ✅ Burns tokens | ❌ Fixed supply |
| **Holder Protection** | ✅ Automated | ❌ None |

## Advanced Mechanics

### Buyback Timing

Buybacks don't trigger instantly:

* **Confirmation Period**: Price must stay below EMA
* **Prevents False Triggers**: Avoids noise
* **Optimal Execution**: Waits for best entry
* **Gas Efficiency**: Batches when possible

### Treasury Limits

* **Minimum Balance**: Small reserve always maintained
* **Maximum Per Buyback**: Limits single transaction size
* **Rate Limiting**: Prevents manipulation
* **Smart Execution**: Optimizes timing

## FAQs

### Can the treasury run out?

Technically yes, but it continuously refills from trading fees. High volume ensures large treasury.

### Who controls the buybacks?

Nobody! It's fully automated via smart contracts. No human intervention possible.

### Can buybacks be disabled?

No. They're permanent features of every token's smart contract.

### What happens after token graduates?

Buybacks continue even after token moves to Raydium DEX. Treasury persists and accumulates from DEX fees.

### Do buybacks guarantee price won't fall?

No. Buybacks provide support but can't prevent all price declines. They reduce downside, not eliminate it.

## Monitoring Buybacks

### Real-time Alerts

Set up notifications for:

* Buyback executions
* Treasury milestones
* Large burn events
* Price approaching EMA

### Analytics

Track buyback metrics:

* **Frequency**: How often buybacks occur
* **Average Size**: Typical buyback amount
* **Total Burned**: Cumulative tokens removed
* **Price Impact**: Effect on token value

## Next Steps

<table data-view="cards"><thead><tr><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>Trading Guide</strong></td><td>Use buyback knowledge in trading</td><td><a href="../traders/trading-guide.md">trading-guide.md</a></td></tr><tr><td><strong>Bonding Curve</strong></td><td>Understand token pricing mechanism</td><td><a href="bonding-curve.md">bonding-curve.md</a></td></tr><tr><td><strong>Fee Structure</strong></td><td>See how fees fund buybacks</td><td><a href="../tokenomics/fees.md">fees.md</a></td></tr></tbody></table>
