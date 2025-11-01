---
icon: bolt
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

# Real-Time Updates

Yoink leverages WebSocket technology to deliver lightning-fast, real-time updates across the platform.

## Overview

Real-time features powered by Socket.io:

* ⚡ **Instant Price Updates**: Sub-second price changes
* 📊 **Live Trading Feed**: Buys and sells as they happen
* 💬 **Live Chat**: Real-time community communication
* 📈 **Volume Counters**: Updating every transaction
* 🔥 **Buyback Alerts**: Instant burn notifications
* 👥 **Holder Counts**: Live holder tracking

{% hint style="success" %}
**Ultra-Low Latency**: Updates typically arrive within 100-300ms of on-chain confirmation!
{% endhint %}

## Architecture

### WebSocket Connections

**Technology Stack**:

* **Socket.io**: WebSocket library
* **Event-Driven**: Real-time event streaming
* **Persistent Connection**: Always connected
* **Auto-Reconnect**: Handles disconnections
* **Fallback**: Long-polling if WebSocket unavailable

### Connection Ports

Yoink uses multiple socket servers:

| Port | Purpose | Use Case |
|------|---------|----------|
| **3005** | Trading Events | Price, volume, trades |
| **3006** | Chat | Community messaging |
| **3000** | API | REST endpoints |

### Connection Status

**Status Indicators**:

* 🟢 **Connected**: Real-time updates active
* 🟡 **Connecting**: Establishing connection
* 🔴 **Disconnected**: No real-time (using cached data)
* 🔵 **Reconnecting**: Attempting to restore connection

## Real-Time Features

### Price Updates

**Live Price Streaming**:

* Updates every trade
* Sub-second latency
* Smooth animations
* Color-coded changes (green/red)
* Percentage change tracking

**Price Ticker**:
```
MOON: 0.00045 SOL (+12.5%) 🟢
```

### Trading Feed

**Live Buy/Sell Stream**:

**Displays**:
* Transaction type (Buy/Sell)
* Amount in SOL
* Tokens bought/sold
* Trader wallet (anonymized)
* Timestamp
* Transaction hash (click to view)

**Example Feed**:
```
🟢 0x1234...5678 bought 1,234 MOON for 0.5 SOL  (2s ago)
🔴 0xabcd...efgh sold 567 MOON for 0.3 SOL     (5s ago)
🟢 0x9876...4321 bought 2,890 MOON for 1.2 SOL (8s ago)
```

**Filtering**:
* All trades
* Buys only
* Sells only
* Large trades (whales)
* Minimum SOL amount

### Volume Tracking

**Real-Time Volume Counters**:

* **24h Volume**: Updates with each trade
* **7d Volume**: Rolling 7-day total
* **30d Volume**: Rolling 30-day total
* **All-Time Volume**: Cumulative total

**Visualization**:
* Animated numbers
* Progress bars
* Milestone celebrations
* Volume charts

### Holder Updates

**Live Holder Tracking**:

* **Total Holders**: Unique wallet count
* **New Holders Today**: Daily additions
* **Early Birds**: Filled seats (X/20)
* **Growth Rate**: Holders per hour/day

**Events**:
* New holder joins → +1 animation
* Holder sells all → -1 update
* Early Bird filled → 🎉 Celebration

### Market Cap

**Real-Time Valuation**:

* Recalculates with each trade
* Bonding curve based
* Supply × current price
* Animated changes
* Historical high markers

### Chart Updates

**Live Chart Data**:

* **Candlestick formation**: Real-time
* **Volume bars**: Updating
* **Indicator recalculation**: Instant
* **TradingView sync**: Fast refresh

**Update Frequency**:
* 1-second charts: Every trade
* 1-minute charts: Every second
* Higher timeframes: Every minute

## Chat System

### Token Chat

**Real-Time Messaging**:

* Instant message delivery
* Typing indicators
* Read receipts
* User presence (online/offline)
* Message history loading

**Features**:
* Emoji reactions
* Mentions (@user)
* Link previews
* Image sharing
* Markdown formatting

### Stream Chat

**During Live Streams**:

* **Twitch Chat**: Embedded Twitch chat
* **Holder Chat**: Yoink-specific chat
* **Dual Chat**: View both simultaneously
* **Chat Alerts**: Whale buys, Early Birds

### Chat Moderation

**Real-Time Actions**:

* Message deletion (instant)
* User muting (immediate)
* Spam filtering (automatic)
* Ban enforcement (instant)

## Notifications

### In-App Alerts

**Real-Time Notifications**:

* 🔔 New buy on your token
* 🔔 Large whale transaction
* 🔔 Early Bird seat filled
* 🔔 Price milestone reached
* 🔔 Creator goes live
* 🔔 Buyback executed
* 🔔 Reward accumulated

**Notification Center**:
* Unread counter
* Categorized alerts
* Click to navigate
* Dismissable
* History retention

### Price Alerts

**Custom Alerts**:

Set alerts for:
* Price reaches X
* Price increases Y%
* Price drops Z%
* Volume exceeds threshold
* New ATH reached

**Delivery**:
* In-app notification
* Browser push (if enabled)
* Email (optional)
* Discord webhook (optional)

## Event Streaming

### Trade Events

**Events Broadcasted**:

```javascript
// Buy Event
{
  type: 'buy',
  token: 'MOON',
  buyer: '0x1234...5678',
  solAmount: 0.5,
  tokenAmount: 1234,
  price: 0.000405,
  timestamp: 1234567890,
  txHash: 'abc123...'
}

// Sell Event
{
  type: 'sell',
  token: 'MOON',
  seller: '0xabcd...efgh',
  solAmount: 0.3,
  tokenAmount: 567,
  price: 0.000529,
  timestamp: 1234567895,
  txHash: 'def456...'
}
```

### Buyback Events

**Burn Notifications**:

```javascript
{
  type: 'buyback',
  token: 'MOON',
  solSpent: 5.2,
  tokensBurned: 12456,
  priceAtBuyback: 0.000417,
  emaValue: 0.000415,
  timestamp: 1234567900,
  txHash: 'ghi789...'
}
```

### Early Bird Events

**Seat Status Updates**:

```javascript
{
  type: 'early_bird',
  token: 'MOON',
  seatNumber: 15,
  holder: '0x9876...4321',
  seatsFilled: 15,
  seatsRemaining: 5,
  timestamp: 1234567905
}
```

### Creator Events

**Stream Status Changes**:

```javascript
{
  type: 'live_status',
  creator: '@Streamer',
  token: 'MOON',
  status: 'live', // or 'offline'
  viewers: 345,
  timestamp: 1234567910
}
```

## Performance Optimization

### Efficient Updates

**Optimization Techniques**:

* **Debouncing**: Limit update frequency
* **Throttling**: Prevent overload
* **Batching**: Group multiple updates
* **Lazy Loading**: Load on-demand
* **Virtual Scrolling**: Efficient list rendering

### Data Compression

**Reducing Bandwidth**:

* Gzip compression
* Binary protocols
* Delta updates (only changes)
* Message coalescing

### Caching Strategy

**Multi-Level Caching**:

1. **Memory**: Instant access
2. **Local Storage**: Persistence
3. **Redis**: Server-side cache
4. **Database**: Long-term storage

## Connection Management

### Auto-Reconnection

**Handling Disconnects**:

* Automatic retry
* Exponential backoff
* Maximum retry attempts
* Fallback to HTTP polling
* State restoration after reconnect

**Reconnection Strategy**:
```
Attempt 1: Wait 1 second
Attempt 2: Wait 2 seconds
Attempt 3: Wait 4 seconds
Attempt 4: Wait 8 seconds
Attempt 5: Wait 16 seconds
Max: Wait 30 seconds between attempts
```

### Connection Quality

**Network Monitoring**:

* Latency measurement
* Packet loss detection
* Bandwidth estimation
* Connection quality indicator

**Quality Indicators**:
* 🟢 **Excellent**: <100ms latency
* 🟡 **Good**: 100-300ms latency
* 🟠 **Fair**: 300-500ms latency
* 🔴 **Poor**: >500ms latency

## Mobile Optimization

### Native WebSocket

Mobile apps use native WebSocket:

* Lower battery usage
* Better connection stability
* Background updates (when allowed)
* Efficient data usage

### Push Notifications

**Mobile Alerts**:

* Native push notifications
* Even when app closed
* Configurable by user
* Rate limiting to save battery

## Developer Tools

### Socket Debugger

**Built-In Tools**:

* Event monitor
* Connection status
* Latency graph
* Message inspector
* Error logging

**Access**: Open browser console, type:
```javascript
window.socketDebug = true
```

### Event Subscription

**Custom Event Listeners**:

```javascript
// Subscribe to specific token
socket.on('token:MOON:trade', (data) => {
  console.log('Trade on MOON:', data);
});

// Subscribe to all buybacks
socket.on('buyback', (data) => {
  console.log('Buyback executed:', data);
});

// Subscribe to your holdings
socket.on('portfolio:update', (data) => {
  console.log('Portfolio changed:', data);
});
```

## Privacy & Security

### Data Protection

**What's Broadcast**:

* ✅ Price changes (public)
* ✅ Volume data (public)
* ✅ Holder counts (public)
* ✅ Transaction amounts (public)
* ✅ Wallet addresses (anonymized)

**What's Private**:

* ❌ Full wallet addresses (unless verified creator)
* ❌ Personal information
* ❌ Email addresses
* ❌ Private keys (never transmitted)

### Secure Connections

**Security Measures**:

* WSS (WebSocket Secure) in production
* TLS encryption
* Authentication tokens
* Rate limiting
* DDoS protection

## Troubleshooting

### Connection Issues

**Problem**: Can't establish connection

**Solutions**:

1. Check internet connection
2. Disable VPN temporarily
3. Whitelist yoink.now in firewall
4. Try different browser
5. Clear cache and cookies
6. Check browser console for errors

### Slow Updates

**Problem**: Delayed real-time updates

**Causes**:
* Network congestion
* Server load
* Too many subscriptions
* Client-side performance

**Solutions**:
* Refresh page
* Close unused tabs
* Check connection quality indicator
* Reduce active subscriptions
* Upgrade internet connection

### Missing Events

**Problem**: Not receiving some updates

**Check**:
* Socket connection status (🟢?)
* Browser tab is active
* Not in power-save mode
* JavaScript enabled
* No ad blockers interfering

## Best Practices

### For Traders

* Keep tab active for real-time updates
* Monitor connection status
* Set price alerts for important levels
* Use trading feed to gauge sentiment
* Watch whale transactions

### For Creators

* Monitor chat during streams
* Respond to real-time questions
* Celebrate milestones as they happen
* Watch trading feed for engagement
* Thank large buyers in real-time

## Future Enhancements

### Planned Features

* 🔮 **Predictive Alerts**: AI-powered predictions
* 🔔 **Smart Notifications**: Machine learning filtering
* 📊 **Enhanced Analytics**: Real-time deeper insights
* 🎮 **Gamification**: Live leaderboards during events
* 🌐 **Multi-Region**: Edge servers worldwide

## Next Steps

<table data-view="cards"><thead><tr><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>Charts</strong></td><td>Use real-time chart updates</td><td><a href="charts.md">charts.md</a></td></tr><tr><td><strong>Trading Guide</strong></td><td>Leverage real-time data for trading</td><td><a href="../traders/trading-guide.md">trading-guide.md</a></td></tr><tr><td><strong>Troubleshooting</strong></td><td>Fix connection issues</td><td><a href="../support/troubleshooting.md">troubleshooting.md</a></td></tr></tbody></table>
