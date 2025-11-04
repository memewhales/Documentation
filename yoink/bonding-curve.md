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
  metadata:
    visible: true
---

# 📊 Bonding Curve

Understanding Yoink's bonding curve is essential for successful trading. This automated market-making system determines token prices, provides instant liquidity, and creates a fair launch mechanism for all creator tokens.

## What is a Bonding Curve?

A **bonding curve** is a mathematical formula that automatically determines token prices based on supply and demand. Unlike traditional markets where prices are set by order books, bonding curves use algorithmic pricing to ensure:

* **Instant liquidity** - Always able to buy or sell
* **Fair pricing** - Transparent, predictable price discovery
* **No rug pulls** - Liquidity can't be removed by creators
* **Automatic market making** - No need for manual liquidity provision

{% hint style="info" %}
**Simple explanation**: The more tokens that exist (higher supply), the higher the price becomes. It's like a vending machine that automatically adjusts prices based on how many items have been sold.
{% endhint %}

## The Mathematical Formula

Yoink uses a **constant product market maker (CPMM)** bonding curve with the following formula:

### Buy Price Formula
```
SOL Cost = (token_amount × virtual_sol_reserves) / (virtual_token_reserves - token_amount)
```

### Sell Price Formula  
```
SOL Output = (token_amount × virtual_sol_reserves) / (virtual_token_reserves + token_amount)
```

### Key Components

| Component | Description | Purpose |
|-----------|-------------|---------|
| **Virtual Token Reserves** | Theoretical token supply on the curve | Price calculation only |
| **Virtual SOL Reserves** | Theoretical SOL backing the curve | Price calculation only |
| **Real Token Reserves** | Actual tokens available for purchase | Physical inventory |
| **Real SOL Reserves** | Actual SOL backing the tokens | Real liquidity |

{% hint style="info" %}
**Important**: The "virtual" reserves are used purely for pricing calculations and follow the constant product formula. The "real" reserves represent the actual tokens and SOL available on the bonding curve.
{% endhint %}

## The Progress Bar System

Every token displays a **progress bar** showing how close it is to "graduation" (moving to a traditional DEX).

### Progress Calculation

Progress is based on **real token reserves depletion**, not market cap:

```
Progress % = (Initial Tokens - Current Real Token Reserves) / Initial Tokens × 100
```

**Graduation occurs when**: `real_token_reserves` reaches **0** (all tokens are sold from the curve)

{% hint style="success" %}
**Key Insight**: Unlike market cap-based systems, Yoink graduation happens when the bonding curve runs out of tokens to sell, ensuring maximum liquidity migration to the DEX.
{% endhint %}

## Graduation and DEX Integration

### When Graduation Occurs

A token automatically graduates when **all tokens are sold from the bonding curve** (`real_token_reserves` = 0). This triggers:

✅ **Automatic migration** to Raydium DEX  
✅ **Liquidity pool creation** with all accumulated SOL  
✅ **Standard SPL token** deployment  
✅ **Professional trading** features activation  
✅ **Ecosystem integration** with all Solana DEXs  

**Key difference**: Graduation is based on **token depletion**, not market cap targets, ensuring maximum community participation before DEX migration.  

### The Migration Process

**Step 1: Trigger Detection**
- Smart contract monitors market cap
- Graduation automatically triggered at threshold
- No manual intervention required

**Step 2: Liquidity Migration**
- All SOL from bonding curve → Raydium liquidity pool
- Token supply remains unchanged
- LP tokens locked permanently (no rug pulls)

**Step 3: Trading Transition**
- Bonding curve trading stops
- Raydium DEX trading begins
- Price discovery becomes market-driven
- All holders keep their tokens

**Step 4: Platform Integration**
- Token remains visible on Yoink
- Early Bird rewards continue
- Creator fees still collected
- All platform features maintained

### Benefits of Graduation

**For Token Holders:**
* **Permanent liquidity** that can't be removed
* **Professional trading** tools and features
* **Wider market access** across Solana ecosystem
* **Institutional participation** potential
* **Continued platform** benefits and rewards

**For Creators:**
* **Legitimacy milestone** - proven market demand
* **Revenue growth** - higher volume = more fees
* **Long-term sustainability** in DeFi ecosystem
* **Broader exposure** to Solana community
* **Success validation** for their brand

## Automatic Buyback System

Yoink features a sophisticated **automatic buyback mechanism** that creates price floors and supports token values:

### How Buybacks Work

1. **Fee Accumulation**: Trading fees accumulate in separate pools:
   - **Creator Fee Pool** - For creator rewards
   - **Treasury Fee Pool** - For buybacks and platform operations  
   - **Early Bird Pool** - For early supporter rewards
   - **Platform Fee** - Direct platform revenue

2. **Trigger Conditions**: Buybacks activate when:
   - Current market price falls below backing value thresholds
   - Treasury pool has sufficient funds
   - Price drops significantly from the EMA (exponential moving average)

3. **Buyback Execution**: 
   - Platform automatically buys tokens using treasury funds
   - Purchased tokens are **permanently burned** (destroyed)
   - Supply reduction increases scarcity and supports price

4. **Supply Reduction**: Each buyback permanently reduces the `circulating_supply`, making remaining tokens potentially more valuable.

### Buyback Benefits

**🛡️ Price Support**: Automatic buying pressure during downtrends  
**🔥 Supply Reduction**: Burned tokens create permanent scarcity  
**💰 Treasury Utilization**: Fee accumulation funds price protection  
**⚖️ Market Stability**: Reduces extreme volatility  
**🔄 Sustainable Mechanics**: Self-funding through trading activity  

{% hint style="warning" %}
**Burn Limits**: The system has built-in limits to prevent excessive burning (typically max 25% of total supply) to maintain healthy tokenomics.
{% endhint %}

## Early Bird Reward System

The **Early Bird mechanism** rewards the first supporters of new tokens:

### How Early Bird Works

1. **Entry Qualification**: First 20 buyers (configurable) who meet minimum purchase requirements become Early Birds
2. **Anti-Sybil Protection**: Minimum SOL purchase amount prevents gaming with multiple small wallets  
3. **Position Tracking**: Each buyer gets a permanent position number (1st, 2nd, 3rd, etc.)
4. **Permanent Status**: Early Bird status lasts as long as you hold tokens

### Early Bird Benefits

- **Fee Sharing**: Earn from **every trade** that happens on the token
- **Equal Distribution**: All Early Birds get exactly the same reward amount
- **Passive Income**: Rewards accumulate automatically from trading activity
- **Graduation Bonus**: Large reward distribution when token graduates to DEX

### Status Loss

**⚠️ Warning**: Selling **any amount** of tokens permanently revokes Early Bird status. There's no way to regain it, even if you buy back in.

### Claiming Rewards

- Early Bird rewards can only be claimed **after graduation** (when curve completes)
- Rewards are calculated as: `early_bird_pool ÷ valid_early_bird_count`
- Each Early Bird gets exactly the same amount regardless of purchase size or timing

## Fee Distribution System

### Understanding Price Impact

**Price impact** is how much your trade moves the token price:

```
Price Impact = (New Price - Old Price) / Old Price × 100
```

**Factors affecting price impact:**
* **Trade size** - Larger trades = higher impact
* **Current supply** - Lower supply = higher impact
* **Curve steepness** - Steeper curve = higher impact
* **Market cap** - Lower market cap = higher impact

### Slippage Tolerance

**Slippage** is the difference between expected and actual execution price:

**Recommended Settings:**
* **Small trades** (<1 SOL): 1-2% slippage
* **Medium trades** (1-10 SOL): 2-5% slippage
* **Large trades** (>10 SOL): 5-15% slippage
* **Low liquidity** tokens: 10-20% slippage

### Minimizing Trading Costs

**Strategies for better execution:**
* **Split large trades** into smaller chunks
* **Trade during high volume** periods
* **Monitor market cap** - higher = less impact
* **Use appropriate slippage** settings
* **Time your entries** around market activity

## Bonding Curve Advantages

### Compared to Traditional Liquidity Pools

| Feature | Bonding Curve | Traditional LP |
|---------|---------------|----------------|
| **Initial Liquidity** | ✅ Not required | ❌ Required |
| **Price Discovery** | ✅ Algorithmic | ⚡ Market-driven |
| **Rug Pull Risk** | ✅ Impossible | ⚠️ Possible |
| **Impermanent Loss** | ✅ None | ❌ Possible |
| **Complexity** | ✅ Simple | ❌ Complex |
| **Fair Launch** | ✅ Guaranteed | ⚠️ Depends |

### Key Benefits

**🛡️ Security**
- No liquidity that can be pulled
- Transparent, auditable pricing
- Smart contract guarantees

**⚖️ Fairness**
- Same curve for everyone
- No pre-sales or insider access
- Transparent price discovery

**💧 Liquidity**
- Always available for trading
- No need to find counterparties
- Instant execution

**🚀 Accessibility**
- No technical knowledge required
- Low barrier to entry
- Automated market making

## Advanced Concepts

### Curve Efficiency

**Measuring bonding curve health:**

```
Efficiency = Total Volume / Market Cap
```

**High efficiency indicators:**
* Steady trading volume
* Growing holder base
* Consistent price appreciation
* Active creator engagement

### Market Cap Calculation

**Real-time market cap:**

```
Market Cap = Current Supply × Current Price
```

**Market cap growth factors:**
* Net buying pressure
* Creator activity and content
* Community engagement
* Market sentiment
* Platform features (buybacks, etc.)

### Supply Dynamics

**Token supply changes:**
* **Buys** → Tokens minted → Supply increases
* **Sells** → Tokens burned → Supply decreases
* **Net effect** determines price direction
* **Graduation** → Supply becomes fixed

## Trading Strategies on Bonding Curves

### Early Entry Strategy

**Approach:**
- Enter at 0-25% progress
- Target Early Bird positions
- Hold through graduation
- Benefit from maximum price appreciation

**Risk/Reward:**
- **High risk** - unproven tokens
- **High reward** - maximum upside potential

### Momentum Trading

**Approach:**
- Enter during 25-75% progress
- Ride community momentum
- Exit before graduation or hold through
- Focus on volume and activity

**Risk/Reward:**
- **Medium risk** - some validation
- **Medium reward** - solid upside potential

### Pre-Graduation Accumulation

**Approach:**
- Enter at 75-95% progress
- Position for graduation event
- Benefit from liquidity migration
- Hold into DEX phase

**Risk/Reward:**
- **Lower risk** - graduation likely
- **Lower reward** - limited upside remaining

## Monitoring and Analytics

### Key Metrics to Track

**Price Metrics:**
* Current token price
* Market cap progression
* Price change (24h, 7d)
* All-time high/low

**Supply Metrics:**
* Current circulating supply
* Progress to graduation
* Token burn events
* Supply growth rate

**Trading Metrics:**
* Trading volume (24h)
* Number of transactions
* Unique traders
* Average trade size

**Community Metrics:**
* Total holders
* Holder growth rate
* Early Bird seats filled
* Creator activity level

### Using Analytics for Decisions

**Entry timing:**
- Low progress + high activity = opportunity
- Steady progress + volume = momentum
- High progress + volume = graduation play

**Exit timing:**
- Graduation approach = profit taking
- Volume decline = potential exit
- Community activity drop = concern

## Risk Management

### Common Risks

**⚠️ Early Stage Risk**
- Unproven creator/community
- High price volatility
- Low liquidity depth

**⚠️ Market Risk**
- General market conditions
- Solana ecosystem health
- Platform-specific risks

**⚠️ Execution Risk**
- High slippage on large trades
- Network congestion
- Smart contract risks

### Risk Mitigation

**🛡️ Diversification**
- Multiple tokens
- Different progress stages
- Various creator types

**🛡️ Position Sizing**
- Start small while learning
- Scale with experience
- Never risk more than you can afford

**🛡️ Research**
- Verify creator authenticity
- Check community engagement
- Monitor platform metrics

{% hint style="warning" %}
**Important**: Bonding curves are powerful but not risk-free. Always do your own research and only invest what you can afford to lose.
{% endhint %}

## Conclusion

Bonding curves represent a revolutionary approach to token launches and price discovery. By understanding how they work, you can:

* **Make informed trading decisions**
* **Identify opportunities** at different progress stages
* **Manage risk** through proper position sizing
* **Benefit from** the graduation process
* **Participate in** fair, transparent markets

The combination of algorithmic pricing, automatic liquidity, and graduation mechanics creates a unique trading environment that benefits creators, communities, and traders alike.

{% hint style="success" %}
**Ready to trade?** Now that you understand bonding curves, you're equipped to make smarter trading decisions on Yoink. Start small, learn the mechanics, and gradually increase your involvement as you gain experience.
{% endhint %}