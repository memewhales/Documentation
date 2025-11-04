# 🔍 Bonding Curve Monitor & Alert System

This example shows how to create a comprehensive bonding curve monitoring system that tracks new token launches, curve progressions, and market events in real-time.

## Overview

This system will:
- Monitor new bonding curve token launches on the Yoink protocol
- Track curve progression and completion events
- Send alerts for significant price movements and milestones
- Provide real-time market data and statistics
- Generate reports on market activity and trends

## Prerequisites

- Yoink SDK installed and configured
- Solana RPC endpoint access
- Basic understanding of bonding curve mechanics
- Optional: Notification services (Discord, Telegram, Email)

## Script Code

```typescript
import { YoinkSDK } from '../src/yoink';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { AnchorProvider, Wallet } from '@coral-xyz/anchor';

interface TokenEvent {
  type: 'launch' | 'trade' | 'completion' | 'milestone';
  timestamp: Date;
  mint: string;
  data: any;
}

interface MonitoredToken {
  mint: string;
  symbol: string;
  createdAt: Date;
  initialPrice: number;
  currentPrice: number;
  marketCap: number;
  totalBuyers: number;
  isComplete: boolean;
  curveProgress: number;
  lastUpdate: Date;
  priceHistory: { timestamp: number; price: number; marketCap: number }[];
  alerts: {
    priceChange: boolean;
    buyerMilestones: number[];
    completionAlert: boolean;
  };
}

interface MonitorConfig {
  rpcUrl?: string;
  scanInterval?: number;
  priceChangeThreshold?: number;
  buyerMilestones?: number[];
  enableCompletionAlerts?: boolean;
  maxTokensToTrack?: number;
  notifications?: {
    discord?: { webhookUrl: string };
    telegram?: { botToken: string; chatId: string };
    console?: boolean;
  };
}

class BondingCurveMonitor {
  private sdk: YoinkSDK;
  private config: MonitorConfig;
  private monitoredTokens: Map<string, MonitoredToken> = new Map();
  private eventHistory: TokenEvent[] = [];
  private isRunning: boolean = false;
  private lastScanTime: Date | null = null;

  constructor(config: MonitorConfig = {}) {
    const connection = new Connection(config.rpcUrl || 'https://eclipse.lgns.net');
    const wallet = new Wallet(); // Use your actual wallet
    const provider = new AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
      preflightCommitment: 'confirmed',
    });

    this.sdk = new YoinkSDK(provider);
    this.config = {
      scanInterval: 30000, // 30 seconds
      priceChangeThreshold: 15, // 15% price change
      buyerMilestones: [10, 25, 50, 100, 250, 500, 1000],
      enableCompletionAlerts: true,
      maxTokensToTrack: 100,
      notifications: {
        console: true,
      },
      ...config,
    };
  }

  async start() {
    console.log('🔍 Starting Bonding Curve Monitor...');
    
    try {
      console.log('✅ Connected to Eclipse network');
      
      // Initial scan for existing tokens
      await this.performInitialScan();
      
      this.isRunning = true;
      this.startMonitoring();
      
    } catch (error) {
      console.error('❌ Failed to start monitor:', error);
    }
  }

  async performInitialScan() {
    console.log('📊 Performing initial scan for existing tokens...');
    
    // In a real implementation, you would scan for all existing bonding curve tokens
    // For this example, we'll use known tokens
    const knownTokens = [
      'HbiDw6U515iWwHQ4edjmceT24ST7akg7z5rhXRhBac4J',
      // Add more known token mints here
    ];

    for (const mintStr of knownTokens) {
      try {
        await this.addTokenToMonitoring(new PublicKey(mintStr));
      } catch (error) {
        console.error(`Error scanning token ${mintStr}:`, error);
      }
    }

    console.log(`✅ Initial scan complete. Monitoring ${this.monitoredTokens.size} tokens`);
  }

  async addTokenToMonitoring(mint: PublicKey): Promise<boolean> {
    try {
      const curve = await this.sdk.getBondingCurveAccount(mint);
      if (!curve) return false;

      const mintStr = mint.toBase58();
      if (this.monitoredTokens.has(mintStr)) return true;

      const currentPrice = curve.getPricePerToken();
      const marketCap = Number(curve.getMarketCapSOL()) / LAMPORTS_PER_SOL;
      const totalBuyers = Number(curve.totalBuyers);
      const isComplete = curve.complete;

      const token: MonitoredToken = {
        mint: mintStr,
        symbol: `TOKEN_${mintStr.slice(0, 8)}`,
        createdAt: new Date(), // In real implementation, get from creation event
        initialPrice: currentPrice, // Estimate initial price
        currentPrice,
        marketCap,
        totalBuyers,
        isComplete,
        curveProgress: this.calculateCurveProgress(curve),
        lastUpdate: new Date(),
        priceHistory: [{
          timestamp: Date.now(),
          price: currentPrice,
          marketCap,
        }],
        alerts: {
          priceChange: false,
          buyerMilestones: [],
          completionAlert: false,
        },
      };

      this.monitoredTokens.set(mintStr, token);

      // Log new token discovery
      this.logEvent({
        type: 'launch',
        timestamp: new Date(),
        mint: mintStr,
        data: { currentPrice, marketCap, totalBuyers },
      });

      return true;

    } catch (error) {
      console.error(`Error adding token ${mint.toBase58()} to monitoring:`, error);
      return false;
    }
  }

  calculateCurveProgress(curve: any): number {
    if (curve.complete) return 100;
    
    const currentMarketCap = Number(curve.getMarketCapSOL()) / LAMPORTS_PER_SOL;
    const completionMarketCap = 85; // Assuming curves complete around 85 SOL
    
    return Math.min(100, (currentMarketCap / completionMarketCap) * 100);
  }

  async startMonitoring() {
    console.log('🔄 Starting continuous monitoring...');

    while (this.isRunning) {
      try {
        await this.scanForUpdates();
        await this.scanForNewTokens();
        this.displayStatus();
        
        await this.sleep(this.config.scanInterval!);
      } catch (error) {
        console.error('❌ Monitoring error:', error);
        await this.sleep(5000);
      }
    }
  }

  async scanForUpdates() {
    for (const [mintStr, token] of this.monitoredTokens.entries()) {
      try {
        const mint = new PublicKey(mintStr);
        const curve = await this.sdk.getBondingCurveAccount(mint);
        
        if (!curve) continue;

        const newPrice = curve.getPricePerToken();
        const newMarketCap = Number(curve.getMarketCapSOL()) / LAMPORTS_PER_SOL;
        const newBuyers = Number(curve.totalBuyers);
        const newIsComplete = curve.complete;
        const newProgress = this.calculateCurveProgress(curve);

        // Check for significant changes
        await this.checkForAlerts(token, {
          price: newPrice,
          marketCap: newMarketCap,
          buyers: newBuyers,
          isComplete: newIsComplete,
          progress: newProgress,
        });

        // Update token data
        token.currentPrice = newPrice;
        token.marketCap = newMarketCap;
        token.totalBuyers = newBuyers;
        token.isComplete = newIsComplete;
        token.curveProgress = newProgress;
        token.lastUpdate = new Date();

        // Add to price history
        token.priceHistory.push({
          timestamp: Date.now(),
          price: newPrice,
          marketCap: newMarketCap,
        });

        // Keep only last 100 price points
        if (token.priceHistory.length > 100) {
          token.priceHistory.shift();
        }

      } catch (error) {
        console.error(`Error updating token ${mintStr}:`, error);
      }
    }

    this.lastScanTime = new Date();
  }

  async checkForAlerts(token: MonitoredToken, newData: any) {
    // Price change alert
    const priceChange = ((newData.price - token.currentPrice) / token.currentPrice) * 100;
    if (Math.abs(priceChange) >= this.config.priceChangeThreshold!) {
      await this.sendAlert(`📈 ${token.symbol} price ${priceChange > 0 ? 'surged' : 'dropped'} by ${Math.abs(priceChange).toFixed(2)}%! 
        New price: ${newData.price.toFixed(8)} SOL
        Market cap: ${newData.marketCap.toFixed(2)} SOL`);

      this.logEvent({
        type: 'trade',
        timestamp: new Date(),
        mint: token.mint,
        data: { priceChange, newPrice: newData.price, newMarketCap: newData.marketCap },
      });
    }

    // Buyer milestone alerts
    for (const milestone of this.config.buyerMilestones!) {
      if (newData.buyers >= milestone && token.totalBuyers < milestone) {
        if (!token.alerts.buyerMilestones.includes(milestone)) {
          await this.sendAlert(`👥 ${token.symbol} reached ${milestone} buyers! 
            Current buyers: ${newData.buyers}
            Market cap: ${newData.marketCap.toFixed(2)} SOL
            Progress: ${newData.progress.toFixed(1)}%`);

          token.alerts.buyerMilestones.push(milestone);

          this.logEvent({
            type: 'milestone',
            timestamp: new Date(),
            mint: token.mint,
            data: { milestone, totalBuyers: newData.buyers },
          });
        }
      }
    }

    // Curve completion alert
    if (newData.isComplete && !token.isComplete && this.config.enableCompletionAlerts) {
      await this.sendAlert(`🎉 ${token.symbol} bonding curve completed! 
        Final market cap: ${newData.marketCap.toFixed(2)} SOL
        Total buyers: ${newData.buyers}
        Token is now trading on DEX!`);

      token.alerts.completionAlert = true;

      this.logEvent({
        type: 'completion',
        timestamp: new Date(),
        mint: token.mint,
        data: { finalMarketCap: newData.marketCap, totalBuyers: newData.buyers },
      });
    }
  }

  async scanForNewTokens() {
    // In a real implementation, you would listen for program events
    // or scan the blockchain for new bonding curve creations
    // For this example, we'll simulate this functionality
    
    // This could be implemented by:
    // 1. Listening to program logs
    // 2. Scanning recent transactions
    // 3. Using a webhook or websocket connection
    // 4. Periodically checking known program accounts
  }

  async sendAlert(message: string) {
    const timestamp = new Date().toLocaleString();
    
    // Console notification
    if (this.config.notifications?.console) {
      console.log(`🔔 [${timestamp}] ALERT: ${message}`);
    }

    // Discord webhook (if configured)
    if (this.config.notifications?.discord?.webhookUrl) {
      try {
        await fetch(this.config.notifications.discord.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `🔔 **Yoink Alert**\n${message}`,
          }),
        });
      } catch (error) {
        console.error('Failed to send Discord notification:', error);
      }
    }

    // Telegram bot (if configured)
    if (this.config.notifications?.telegram) {
      try {
        const { botToken, chatId } = this.config.notifications.telegram;
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: `🔔 Yoink Alert\n${message}`,
            parse_mode: 'HTML',
          }),
        });
      } catch (error) {
        console.error('Failed to send Telegram notification:', error);
      }
    }
  }

  logEvent(event: TokenEvent) {
    this.eventHistory.push(event);
    
    // Keep only last 1000 events
    if (this.eventHistory.length > 1000) {
      this.eventHistory.shift();
    }
  }

  displayStatus() {
    console.clear();
    console.log('🔍 YOINK BONDING CURVE MONITOR');
    console.log('==============================');
    console.log(`Last Scan: ${this.lastScanTime?.toLocaleString() || 'Never'}`);
    console.log(`Monitored Tokens: ${this.monitoredTokens.size}`);
    console.log(`Events Today: ${this.getTodayEventCount()}`);
    console.log();

    // Active tokens summary
    const activeTokens = Array.from(this.monitoredTokens.values()).filter(t => !t.isComplete);
    const completedTokens = Array.from(this.monitoredTokens.values()).filter(t => t.isComplete);

    console.log('📊 MARKET OVERVIEW');
    console.log('------------------');
    console.log(`Active Curves: ${activeTokens.length}`);
    console.log(`Completed Curves: ${completedTokens.length}`);
    console.log(`Total Market Cap: ${Array.from(this.monitoredTokens.values()).reduce((sum, t) => sum + t.marketCap, 0).toFixed(2)} SOL`);
    console.log();

    // Recent events
    const recentEvents = this.eventHistory.slice(-5).reverse();
    if (recentEvents.length > 0) {
      console.log('🕐 RECENT EVENTS');
      console.log('----------------');
      recentEvents.forEach(event => {
        const time = event.timestamp.toLocaleTimeString();
        const tokenSymbol = this.monitoredTokens.get(event.mint)?.symbol || 'UNKNOWN';
        
        switch (event.type) {
          case 'launch':
            console.log(`${time} 🚀 ${tokenSymbol} launched`);
            break;
          case 'trade':
            console.log(`${time} 📈 ${tokenSymbol} price changed by ${event.data.priceChange.toFixed(2)}%`);
            break;
          case 'completion':
            console.log(`${time} 🎉 ${tokenSymbol} curve completed`);
            break;
          case 'milestone':
            console.log(`${time} 👥 ${tokenSymbol} reached ${event.data.milestone} buyers`);
            break;
        }
      });
      console.log();
    }

    // Top performers
    const sortedTokens = Array.from(this.monitoredTokens.values())
      .sort((a, b) => b.marketCap - a.marketCap)
      .slice(0, 5);

    if (sortedTokens.length > 0) {
      console.log('🏆 TOP TOKENS BY MARKET CAP');
      console.log('----------------------------');
      sortedTokens.forEach((token, index) => {
        const status = token.isComplete ? '✅' : '🔄';
        console.log(`${index + 1}. ${status} ${token.symbol}`);
        console.log(`   Market Cap: ${token.marketCap.toFixed(2)} SOL`);
        console.log(`   Buyers: ${token.totalBuyers}`);
        console.log(`   Progress: ${token.curveProgress.toFixed(1)}%`);
        console.log();
      });
    }
  }

  getTodayEventCount(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.eventHistory.filter(event => event.timestamp >= today).length;
  }

  exportData() {
    const exportData = {
      timestamp: new Date().toISOString(),
      monitoredTokens: Array.from(this.monitoredTokens.values()),
      eventHistory: this.eventHistory,
      config: this.config,
    };

    const filename = `bonding-curve-monitor-${new Date().toISOString().split('T')[0]}.json`;
    console.log(`📁 Export data available as: ${filename}`);
    return exportData;
  }

  stop() {
    console.log('🛑 Stopping bonding curve monitor...');
    this.isRunning = false;
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage Example
async function main() {
  const monitor = new BondingCurveMonitor({
    rpcUrl: 'https://eclipse.lgns.net',
    scanInterval: 30000, // 30 seconds
    priceChangeThreshold: 20, // 20% price change alerts
    buyerMilestones: [5, 10, 25, 50, 100, 250, 500],
    enableCompletionAlerts: true,
    maxTokensToTrack: 50,
    
    notifications: {
      console: true,
      // Uncomment and configure for external notifications
      // discord: {
      //   webhookUrl: 'YOUR_DISCORD_WEBHOOK_URL'
      // },
      // telegram: {
      //   botToken: 'YOUR_BOT_TOKEN',
      //   chatId: 'YOUR_CHAT_ID'
      // }
    },
  });
  
  await monitor.start();
  
  // Export data every hour
  setInterval(() => {
    monitor.exportData();
  }, 3600000);
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    monitor.stop();
    process.exit(0);
  });
}

// Run the monitor
main().catch(console.error);
```

## Features

### 🔍 Real-time Monitoring
- Continuous bonding curve token scanning
- Price and market cap tracking
- Buyer count monitoring
- Curve progression analysis

### � Smart Alerts
- Configurable price change thresholds
- Buyer milestone notifications
- Curve completion alerts
- Multi-platform notification support (Discord, Telegram)

### 📊 Market Intelligence
- Token launch detection
- Performance tracking
- Event history logging
- Market overview dashboard

### 📈 Analytics & Reporting
- Historical data collection
- Market trends analysis
- Performance metrics
- Data export capabilities

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rpcUrl` | String | `'https://eclipse.lgns.net'` | Solana RPC endpoint |
| `scanInterval` | Number | `30000` | Scan frequency (ms) |
| `priceChangeThreshold` | Number | `15` | Price change alert (%) |
| `buyerMilestones` | Array | `[10,25,50,100,250,500,1000]` | Buyer count alerts |
| `enableCompletionAlerts` | Boolean | `true` | Alert on curve completion |
| `maxTokensToTrack` | Number | `100` | Maximum tokens to monitor |

## Notification Setup

### Discord Webhook
```typescript
notifications: {
  discord: {
    webhookUrl: 'https://discord.com/api/webhooks/YOUR_WEBHOOK_URL'
  }
}
```

### Telegram Bot
```typescript
notifications: {
  telegram: {
    botToken: 'YOUR_BOT_TOKEN',
    chatId: 'YOUR_CHAT_ID'
  }
}
```

## Running the Monitor

1. **Install dependencies**:
   ```bash
   npm install @solana/web3.js @coral-xyz/anchor
   ```

2. **Configure monitoring**:
   ```typescript
   const monitor = new BondingCurveMonitor({
     scanInterval: 30000, // 30 seconds
     priceChangeThreshold: 25, // 25% price changes
     buyerMilestones: [10, 50, 100, 500],
     notifications: {
       console: true,
       discord: { webhookUrl: 'YOUR_WEBHOOK' }
     }
   });
   ```

3. **Start monitoring**:
   ```bash
   npx ts-node bonding-curve-monitor.ts
   ```

## Sample Output

```
🔍 YOINK BONDING CURVE MONITOR
==============================
Last Scan: 11/4/2025, 3:45:30 PM
Monitored Tokens: 15
Events Today: 47

📊 MARKET OVERVIEW
------------------
Active Curves: 12
Completed Curves: 3
Total Market Cap: 1,234.56 SOL

🕐 RECENT EVENTS
----------------
3:45:20 PM 🚀 TOKEN_ABC12345 launched
3:44:15 PM 📈 TOKEN_HbiDw6U5 price changed by +23.45%
3:43:08 PM 👥 TOKEN_DEF67890 reached 100 buyers
3:42:30 PM 🎉 TOKEN_GHI01234 curve completed

🏆 TOP TOKENS BY MARKET CAP
----------------------------
1. ✅ TOKEN_HbiDw6U5
   Market Cap: 85.00 SOL
   Buyers: 234
   Progress: 100.0%

2. 🔄 TOKEN_ABC12345  
   Market Cap: 67.89 SOL
   Buyers: 156
   Progress: 79.9%
```

## Alert Examples

### Price Change Alert
```
🔔 [3:45:30 PM] ALERT: 📈 TOKEN_HbiDw6U5 price surged by 25.67%! 
New price: 0.00456789 SOL
Market cap: 78.90 SOL
```

### Milestone Alert
```
🔔 [3:44:15 PM] ALERT: 👥 TOKEN_ABC12345 reached 100 buyers! 
Current buyers: 103
Market cap: 45.67 SOL
Progress: 53.7%
```

### Completion Alert
```
🔔 [3:43:08 PM] ALERT: 🎉 TOKEN_DEF67890 bonding curve completed! 
Final market cap: 85.00 SOL
Total buyers: 267
Token is now trading on DEX!
```

## Advanced Features

- **Event Logging**: Comprehensive history of all market events
- **Data Export**: JSON exports for further analysis
- **Performance Tracking**: Monitor token performance over time
- **Custom Filters**: Set specific criteria for monitoring
- **Real-time Updates**: Live market data with configurable refresh rates

## Integration Ideas

- **Trading Bots**: Connect alerts to automated trading systems
- **Portfolio Management**: Integrate with portfolio tracking tools
- **Research Tools**: Export data for market analysis
- **Community Alerts**: Share insights with trading communities

## Next Steps

- [📦 Back to SDK Overview](overview.md)
- [🤖 Try Bonding Curve Trading Bot](creator-token-bot.md)
- [📊 Portfolio Dashboard](portfolio-dashboard.md)
- [📈 Market Analytics](creator-analytics.md)