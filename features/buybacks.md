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

* A percentage of each trade's fees go to buyback treasury
* Treasury accumulates SOL over time
* More trading = larger treasury = stronger buybacks

### 2. Price Monitoring with EMA

The system continuously monitors:

* **Current Price**: Real-time token price from bonding curve
* **EMA (Exponential Moving Average)**: Fast-responding price trend (50% alpha)
* **Price Drop Detection**: Triggers when price falls 10% below EMA
* **Treasury Balance**: Available SOL for buybacks

**Simplified Trigger Logic:**
- ✅ Single, clear condition: Price drops 10% below EMA
- ✅ Fast EMA response (50% alpha) for timely support
- ✅ No complex backing calculations - purely EMA-based
- ✅ Easy to visualize and predict on charts

### 3. Automatic Execution

When price drops 10% below EMA:

1. **Trigger Detected**: Price < 90% of EMA
2. **Budget Calculated**: 60% of treasury allocated for buyback
3. **Buyback Executed**: Internal purchase from bonding curve
4. **SOL Moved**: Treasury SOL → Curve liquidity (internal transfer)
5. **Tokens Burned**: Purchased tokens permanently removed from supply
6. **Event Logged**: Burn visible on-chain, buyback recorded in logs

**Note:** The "buy" happens internally - SOL moves from treasury vault to curve liquidity vault within the same account. Only the final burn transaction appears on Solana Explorer.

### 4. Visual Indicators

On the TradingView chart, burn events appear as:

* 🔥 **Burn Marks**: Visual indicators at buyback points
* **Timestamp**: When buyback occurred
* **Amount**: SOL spent and tokens burned
* **Impact**: Price effect visible
* **EMA Line**: Shows the 90% threshold where buybacks trigger

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
* Gives more weight to recent prices (50% on Yoink)
* Smooths out short-term price volatility
* Identifies price trends and support levels

### Why Use EMA?

* **Trend Indicator**: Shows if price is trending above or below average
* **Dynamic Support**: Acts as a moving support line that adapts to market
* **Clear Trigger**: Objective, automated trigger point (90% of EMA)
* **Fast Response**: 50% alpha means quick adaptation to recent price action
* **Market Standard**: Widely used and understood by traders

### EMA Settings on Yoink

Production settings:

* **Alpha (Smoothing)**: 50% (5,000 bps) - Fast response to recent prices
* **Trigger Threshold**: 90% of EMA (10% price drop triggers buyback)
* **Calculation**: Exponentially weighted, updated on every trade
* **Visualization**: Visible on TradingView charts as trend line

### How to Use EMA

**For Buyers:**
- EMA shows the trending price level
- Price near EMA = potential entry with buyback support below
- 10% below EMA = buyback zone (automatic support kicks in)

**For Sellers:**
- Selling below EMA may trigger immediate buyback
- Consider waiting for price to recover above EMA
- Monitor EMA distance to predict buyback timing

**For Holders:**
- EMA acts as dynamic support level
- 10% drop from EMA = buyback protection activates
- Confidence that downside has automated defense

## Buyback Scenarios

### Scenario 1: Gradual Decline

* Price slowly trends down toward EMA
* When price hits 90% of EMA, buyback triggers
* Treasury spends 60% of available SOL
* Buys up to 40% of on-curve token supply
* Burns all purchased tokens
* Creates immediate buying pressure and support

### Scenario 2: Sharp Drop

* Price crashes significantly below EMA
* Buyback triggers immediately at 90% EMA threshold
* Large treasury allocation (60%) provides strong support
* Significant buying pressure from single buyback
* Often creates price bounce due to supply reduction
* EMA continues tracking, may trigger again if needed

### Scenario 3: EMA Testing

* Price oscillates around EMA line
* Dips below 90% EMA periodically
* Multiple smaller buybacks occur over time
* Each buyback reduces circulating supply
* Creates stronger support at EMA level
* Establishes EMA as reliable floor

### Scenario 4: Strong Uptrend

* Price stays well above EMA
* No buybacks trigger
* Treasury continues accumulating from trading fees
* Larger treasury builds up for future support
* When correction comes, stronger buyback available

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

### Buyback Execution Details

**Internal Transaction Flow:**
1. **Price Check**: System detects price < 90% of EMA
2. **Budget Calculation**: 60% of treasury allocated
3. **Token Calculation**: Converts SOL budget to token amount via bonding curve
4. **Supply Cap**: Limits purchase to 40% of on-curve tokens
5. **Internal Transfer**: SOL moves from treasury vault → curve liquidity vault
6. **State Update**: Curve reserves updated (virtual + real)
7. **Burn Execution**: Tokens burned from curve's token account
8. **Event Emission**: TradeEvent logged with buyback flags

**Why No "Buy" Transaction on Explorer:**
- The purchase is internal accounting within the program
- SOL never leaves the bonding curve account
- Only moves between internal vaults (treasury → AMM)
- Result: Treasury down, liquidity up, tokens burned
- On-chain, you only see the burn transaction

### Technical Parameters

**Current Production Settings:**
```javascript
buyback_params: {
    backingMultBps: 1,        // 0.01% - Effectively disabled
    emaDropBps: 9000,         // 90% - 10% drop triggers buyback
    emaAlphaBps: 5000,        // 50% - Fast EMA response
    spendBps: 6000,           // 60% - Treasury usage per buyback
    maxSupplyBps: 4000,       // 40% - Max of curve supply per buyback
    minBackingLamports: 1,    // Effectively 0 - always passes
    maxBurnPercentageBps: 2500, // 25% - Lifetime total burn limit
}
```

### Safety Mechanisms

* **Burn Limit**: Maximum 25% of total supply can ever be burned
* **Supply Cap**: Single buyback limited to 40% of on-curve tokens
* **Treasury Reserve**: Always maintains minimum balance
* **Balance Check**: Verifies sufficient tokens in curve before burn
* **Overflow Protection**: All arithmetic uses safe math operations
* **State Validation**: Ensures reserves stay consistent

## FAQs

### Can the treasury run out?

Technically yes, but it continuously refills from trading fees. More trading = larger treasury = stronger future buybacks.

### Who controls the buybacks?

Nobody! It's fully automated via smart contracts based on EMA. No human intervention possible or needed.

### Can buybacks be disabled?

No. They're permanent features built into every token's smart contract on creation.

### What happens after token graduates to Raydium?

Buybacks continue! Treasury persists and can still accumulate and execute buybacks even after DEX graduation.

### Do buybacks guarantee price won't fall?

No. Buybacks provide support at 10% below EMA but can't prevent all price declines. They reduce downside risk, not eliminate it.

### How often do buybacks trigger?

Only when price drops 10% below EMA. Could be frequent during bear markets, rare during bull trends. Depends entirely on price action.

### What if treasury is empty when buyback should trigger?

Buyback won't execute. Treasury needs sufficient funds. It will accumulate from future trades and trigger when refilled.

### Can I see buybacks happening in real-time?

You'll see the burn transaction on Solana Explorer. The internal SOL movement won't show as a separate transaction. Check the token's Buybacks tab for full history.

### Why use 90% EMA instead of 100%?

10% buffer prevents excessive triggers from normal volatility while still providing meaningful support on real drops.

### How is EMA calculated on Yoink?

Uses 50% alpha (fast response). Formula: `new_EMA = (current_price * 0.5) + (old_EMA * 0.5)`. Updates on every trade.

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
