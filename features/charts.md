---
icon: chart-line
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

# Charts & Analytics

Yoink provides powerful TradingView-based charts and comprehensive analytics for informed trading decisions.

## Overview

Every token on Yoink features:

* 📊 **TradingView Charts**: Professional-grade charting
* 📈 **Real-Time Data**: Live price and volume updates
* 🔥 **Buyback Markers**: Burn events highlighted
* 📉 **Technical Indicators**: Full indicator library
* 📊 **Multiple Timeframes**: Second to monthly views

## TradingView Integration

### Chart Features

**Full TradingView Functionality**:

* ✅ Professional charting library
* ✅ All standard indicators
* ✅ Drawing tools
* ✅ Multiple chart types
* ✅ Save layouts
* ✅ Custom studies

### Accessing Charts

Charts available everywhere:

* **Token Pages**: Main chart display
* **Trading Widget**: Mini chart
* **Portfolio**: Your holdings charts
* **Leaderboards**: Quick chart views
* **Mobile**: Fully responsive

## Chart Types

### Candlestick Charts

**Default View**: Most popular for trading

**Shows**:
* **Open**: Price at period start
* **High**: Highest price in period
* **Low**: Lowest price in period
* **Close**: Price at period end
* **Green**: Close > Open (bullish)
* **Red**: Close < Open (bearish)

### Line Charts

**Simple View**: Price trend only

**Best For**:
* Quick overview
* Identifying major trends
* Cleaner appearance
* Beginners

### Area Charts

**Filled Line Chart**: Price with colored area

**Use Cases**:
* Presentations
* Visual appeal
* Volume correlation
* Support/resistance identification

### Bar Charts

**OHLC Bars**: Traditional bar display

**Traders Who Prefer**:
* Professional traders
* Those used to traditional trading
* High information density

### Heikin Ashi

**Smoothed Candles**: Noise reduction

**Advantages**:
* Clearer trend identification
* Reduced false signals
* Trend continuation emphasis
* Momentum visualization

## Timeframes

### Available Intervals

| Timeframe | Best For |
|-----------|----------|
| **1 Second** | Scalping, watching executions |
| **5 Seconds** | Ultra-short-term trading |
| **1 Minute** | Day trading, quick moves |
| **5 Minutes** | Intraday trading |
| **15 Minutes** | Short-term trends |
| **1 Hour** | Swing trading |
| **4 Hours** | Medium-term analysis |
| **1 Day** | Long-term trends |
| **1 Week** | Big picture view |

### Multi-Timeframe Analysis

**Recommended Approach**:

1. **Daily**: Identify overall trend
2. **4H**: Find swing points
3. **1H**: Pinpoint entry zones
4. **15M**: Time exact entry
5. **1M**: Execute trade

## Technical Indicators

### Trend Indicators

#### Moving Averages (MA/EMA)

**Purpose**: Identify trend direction

**Common Settings**:
* **EMA 20**: Short-term trend (used for buybacks!)
* **EMA 50**: Medium-term trend
* **EMA 200**: Long-term trend
* **SMA 50**: Slower-moving average

**Trading Signals**:
* Price above MA: Bullish
* Price below MA: Bearish
* MA crossovers: Trend changes

{% hint style="info" %}
**Yoink Special**: EMA 20 is crucial - automatic buybacks trigger when price crosses below it!
{% endhint %}

#### MACD (Moving Average Convergence Divergence)

**Components**:
* **MACD Line**: 12 EMA - 26 EMA
* **Signal Line**: 9 EMA of MACD
* **Histogram**: Difference between lines

**Signals**:
* MACD crosses above Signal: Bullish
* MACD crosses below Signal: Bearish
* Histogram growing: Momentum increasing

### Momentum Indicators

#### RSI (Relative Strength Index)

**Range**: 0-100

**Interpretation**:
* **>70**: Overbought (potential sell)
* **30-70**: Neutral
* **<30**: Oversold (potential buy)

**Advanced Use**:
* Divergences predict reversals
* Hidden divergences confirm trends
* Multiple timeframe analysis

#### Stochastic Oscillator

**Components**: %K and %D lines

**Signals**:
* **>80**: Overbought
* **<20**: Oversold
* Crossovers: Entry/exit points

### Volume Indicators

#### Volume Profile

**Shows**: Volume at each price level

**Trading Use**:
* High volume areas: Support/resistance
* Low volume areas: Quick price movement
* Point of Control: Most traded price

#### OBV (On-Balance Volume)

**Purpose**: Confirm price trends

**Signals**:
* OBV rising + price rising: Healthy uptrend
* OBV falling + price falling: Confirmed downtrend
* Divergences: Potential reversal warning

### Volatility Indicators

#### Bollinger Bands

**Components**:
* **Middle**: 20 SMA
* **Upper**: Middle + 2 standard deviations
* **Lower**: Middle - 2 standard deviations

**Trading Signals**:
* Price at upper band: Overbought
* Price at lower band: Oversold
* Band squeeze: Breakout coming
* Band expansion: High volatility

#### ATR (Average True Range)

**Purpose**: Measure volatility

**Use Cases**:
* Position sizing
* Stop loss placement
* Volatility comparison
* Breakout confirmation

## Drawing Tools

### Trend Lines

**How to Draw**:
1. Click Trend Line tool
2. Connect swing lows (uptrend)
3. Connect swing highs (downtrend)
4. Extend line forward

**Trading Use**:
* Support/resistance
* Breakout/breakdown signals
* Trend continuation confirmation

### Horizontal Lines

**Support and Resistance**:

* Mark important price levels
* Previous highs/lows
* Psychological levels (round numbers)
* Volume nodes

### Fibonacci Retracement

**Key Levels**:
* **23.6%**: Shallow retracement
* **38.2%**: Common retracement
* **50%**: Psychological midpoint
* **61.8%**: Deep retracement (golden ratio)
* **78.6%**: Last chance retracement

**How to Use**:
1. Draw from swing low to swing high (uptrend)
2. Watch for bounces at retracement levels
3. Use for entry planning
4. Confirm with other indicators

### Rectangle Patterns

**Identify**:
* Consolidation zones
* Trading ranges
* Accumulation/distribution areas

**Breakout Trading**:
* Wait for price to break rectangle
* Confirm with volume
* Measure target: Rectangle height projected

## Yoink-Specific Features

### Buyback Markers

**🔥 Fire Icons on Chart**:

* Automatically placed when buyback occurs
* Click marker for buyback details:
  * Amount bought
  * Price at buyback
  * Timestamp
  * Transaction hash

**Trading Strategy**:
* Watch for price bounces after buybacks
* Multiple buybacks = strong support
* Anticipate buybacks at EMA 20

### Early Bird Indicators

**Visual Markers**:
* Shows when Early Bird seats fill
* Indicates seat #1-20 milestones
* Useful for understanding demand

### Live Stream Periods

**Highlighted Zones**:
* Chart shows when creator was live
* Often correlates with volume spikes
* Helps plan trading around streams

### Holder Milestones

**Event Markers**:
* 50, 100, 500, 1000 holder marks
* Shows community growth
* Correlate with price action

## Advanced Chart Strategies

### Multi-Chart Layout

**Set Up Multiple Charts**:

1. Open chart layout settings
2. Choose 2x2 or 3x3 grid
3. Different tokens or timeframes
4. Synchronized crosshair
5. Save as template

### Compare Tokens

**Overlay Multiple Tokens**:

* Compare performance
* Find correlations
* Sector rotation analysis
* Relative strength

### Custom Studies

**Create Your Own Indicators**:

* Pine Script support
* Custom calculations
* Personalized strategies
* Share with community

## Mobile Charting

### Touch Gestures

* **Pinch**: Zoom in/out
* **Swipe**: Pan left/right
* **Double Tap**: Reset zoom
* **Long Press**: Crosshair tool
* **Two Finger Tap**: Menu

### Mobile-Optimized

* Responsive design
* Essential indicators
* Simplified controls
* Fast loading
* Offline cache

## Analytics Dashboard

### Token Analytics

**Key Metrics**:

* **Price**: Current, 24h change, ATH
* **Market Cap**: Current valuation
* **Volume**: 24h, 7d, 30d, all-time
* **Holders**: Count, growth rate
* **Early Birds**: Filled seats, status
* **Liquidity**: Available in bonding curve
* **Transactions**: Buy/sell count

### Historical Data

**Time Series**:

* Price history (all time)
* Volume trends
* Holder growth
* Transaction frequency
* Creator revenue
* Early Bird rewards

### Comparative Analytics

**Benchmarking**:

* vs other tokens
* vs platform average
* vs top performers
* Category comparison

## Export & Sharing

### Share Charts

**Options**:

* **Screenshot**: PNG image
* **Link**: Direct URL with settings
* **Embed**: iFrame code
* **Social**: Twitter/Discord ready

### Export Data

**Download**:

* CSV format
* OHLCV data
* Custom date ranges
* All timeframes
* Transaction history

## Next Steps

<table data-view="cards"><thead><tr><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>Trading Guide</strong></td><td>Use charts for trading strategies</td><td><a href="../traders/trading-guide.md">trading-guide.md</a></td></tr><tr><td><strong>Buybacks</strong></td><td>Understand buyback chart markers</td><td><a href="buybacks.md">buybacks.md</a></td></tr><tr><td><strong>Real-Time Updates</strong></td><td>Learn about live data streaming</td><td><a href="real-time.md">real-time.md</a></td></tr></tbody></table>
