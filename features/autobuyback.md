# 🔄 Auto Buyback

Yoink features an **algorithmic buyback mechanism** for all coins created on the platform.  
When market conditions are favorable, the system automatically purchases and burns tokens using the **treasury pool**, helping to stabilize prices and reduce circulating supply.  

This mechanism supports long-term **token health and sustainability**, ensuring a more stable experience for traders.  
**Treasury pools grow over time** through the fees accumulated from trading volume.


## 🎯 How Autobuyback Works

<figure><img src="../.gitbook/assets/burnandbuyback.png" alt=""><figcaption></figcaption></figure>

### Simplified Trigger Logic

{% hint style="success" %}
**🎯 Single Clear Condition:**

Buyback triggers when **current token price drops 10% below the EMA trend line**.

That's it! No complex backing calculations or multiple conditions to track.

- ✅ **Easy to Predict**: Just watch the EMA line on charts
- ✅ **Fast Response**: 50% EMA alpha responds quickly to recent prices  
- ✅ **Reliable Support**: Automatic buying pressure at predictable level
- ✅ **No Ambiguity**: Single metric makes system transparent
{% endhint %}

### How the System Works

{% hint style="info" %}
**📊 Step-by-Step Process:**

1. **EMA Tracking**: System calculates Exponential Moving Average on every trade (50% alpha for fast response)
2. **Price Monitoring**: Compares current price to EMA after each transaction
3. **Trigger Detection**: When price falls to 90% of EMA (10% drop), buyback activates
4. **Budget Allocation**: System allocates 60% of treasury SOL for buyback
5. **Token Calculation**: Converts SOL to token amount via bonding curve math
6. **Supply Cap**: Limits purchase to 40% of on-curve supply per buyback
7. **Internal Transfer**: SOL moves from treasury vault → liquidity vault (internal only)
8. **Burn Execution**: Purchased tokens permanently burned from circulation
9. **Event Logging**: Transaction recorded, visible on Buybacks tab
{% endhint %}

### Trigger Conditions

{% hint style="warning" %}
**📊 Simplified Buyback Trigger:**
- The current price drops **10% below the EMA** (90% of the moving average)
- **AND** sufficient **treasury funds** are available
- **AND** the **total burn limit** hasn't been reached (25% of total supply)

**Note:** The backing multiplier check is effectively disabled (set to 0.01%) to rely solely on EMA-based price support for cleaner, more predictable triggers.
{% endhint %}



## ⚙️ Technical Implementation
### Dynamic Parameters

| Parameter | Production Value | Purpose |
|-----------|-----------------|---------|
| **Backing Multiplier** | 0.01% (1 bps) | Effectively disabled - EMA-only trigger |
| **EMA Drop Threshold** | 90% (9,000 bps) | **Primary trigger**: 10% price drop from EMA |
| **EMA Response Speed** | 50% (5,000 bps) | Fast EMA response to recent price changes |
| **Treasury Spend** | 60% (6,000 bps) | Uses 60% of treasury per buyback |
| **Max Supply Per Buyback** | 40% (4,000 bps) | Caps single buyback to 40% of on-curve supply |
| **Min Backing Check** | 1 lamport | Effectively disabled - always passes |
| **Max Burn Total** | 25% (2,500 bps) | Lifetime burn limit relative to total supply |

{% hint style="info" %}
**💡 Simplified Design Philosophy:**  
The buyback system now uses a **single, clear trigger**: when price drops 10% below the EMA trend line.

- **EMA-Only Triggering**: By effectively disabling the backing multiplier check (0.01%) and minimum backing requirement (1 lamport), buybacks trigger cleanly based on price action alone
- **Fast EMA Response**: 50% alpha means the EMA responds quickly to recent price movements, providing timely support
- **Aggressive Support**: 60% treasury spend and 40% supply cap ensure meaningful buyback impact when triggered
- **Moderate Sensitivity**: 90% EMA threshold (10% drop) balances between frequent support and avoiding excessive triggers during normal volatility
- **Sustainable Limits**: 25% lifetime burn cap prevents over-deflation while allowing significant supply reduction over time

**Result:** A predictable, EMA-based price support system that's easy to understand and monitor on charts.
{% endhint %}



## ⚙️ Technical Implementation
### Dynamic Parameters

| Parameter | Value | Purpose |
|-----------|--------|---------|
| **Backing Multiplier** | 250% (25,000 bps) | Price threshold above backing value |
| **EMA Drop Threshold** | 90% (9,000 bps) | Trigger level for moving average deviation |
| **EMA Response Speed** | 50% (5,000 bps) | Weight factor in price trend calculation |
| **Treasury Spend** | 60% (6,000 bps) | Portion of treasury used per buyback |
| **Max Burn Total** | 25% (2,500 bps) | Lifetime burn limit relative to total supply |

{% hint style="info" %}
**💡 Parameter Balance:**  
These parameters are designed to maintain **long-term sustainability** by blending conservative trigger thresholds (250% backing, 90% EMA) with decisive response actions (60% treasury spend, 40% supply cap).  
The elevated backing multiplier minimizes unnecessary activations during normal volatility, while the treasury’s significant allocation ensures **meaningful buyback impact** when market conditions warrant.  
Finally, the **25% lifetime burn cap** prevents over-deflation while still allowing a healthy reduction in circulating supply over time.
{% endhint %}


## 💰 Benefits for Token Holders

{% hint style="success" %}
**📈 Price Stabilization**
- **Automatic support** during price drops
- **Reduces volatility** through algorithmic intervention  
- **Creates price floor** based on treasury backing
{% endhint %}

{% hint style="info" %}
**🔥 Supply Reduction**
- **Permanently burns** purchased tokens
- **Reduces circulating supply** over time
- **Increases scarcity** for remaining holders
{% endhint %}

{% hint style="warning" %}
**⚡ Treasury Efficiency**
- **Utilizes accumulated fees** productively
- **Provides value** back to token community
- **No manual intervention** required
{% endhint %}

## 📊 Monitoring & Transparency

### Buyback Activity Tab


<figure><img src="../.gitbook/assets/b2.png" alt=""><figcaption></figcaption></figure>

{% hint style="info" %}
**📈 Track Buybacks on Token Pages:**
- Each coin page includes a dedicated **"Buybacks" tab**
- View complete history of all buyback events
- See exact timing, amounts, and transaction links
- Monitor treasury utilization and burn statistics

**🔗 Transaction Visibility:**
- **Burn transactions** are fully visible on Solana blockchain
- **Buy operations** happen internally within the program
- Only the burn will show as an external transaction
- The buyback "purchase" is actually an internal ledger update
{% endhint %}

### Internal Mechanics Explained

{% hint style="warning" %}
**🔄 How the "Buyback" Works Internally — and Why There’s No Visible SOL Inflow on Solana Explorer:**
- SOL moves internally from the **treasury vault** to the **bonding curve liquidity pool**  
- The token quotation updates to reflect the increased SOL reserves  
- **No actual SOL leaves the bonding curve** — it’s simply an internal transfer between vaults (treasury → AMM vault)  
- **Result:** Treasury balance decreases, curve liquidity increases, and tokens are burned  

**💡 Why You Only See Burns on Solan Explorer:**
- The “purchase” is recorded as an internal AMM ledger adjustment  
- Only the final **burn transaction** appears on-chain, since SOL never leaves the bonding curve account — it’s just reallocated between internal vaults
{% endhint %}


**🔥 Autobuyback is enabled by default** for all tokens and operates automatically without any user intervention required.


