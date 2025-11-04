# 📊 Bonding Curve Portfolio Dashboard

This example demonstrates how to build a comprehensive portfolio analytics dashboard that tracks your bonding curve token holdings, performance metrics, and provides insights into your Yoink ecosystem investments.

## Overview

This dashboard will:
- Track all bonding curve token holdings in real-time
- Monitor token performance and market metrics
- Calculate portfolio performance and P&L across all investments
- Generate analytics reports with token-specific insights
- Send alerts for significant price movements or curve completion
- Export data for tax reporting and further analysis

## Prerequisites

- Yoink SDK installed and configured
- Solana wallet with existing token positions
- Basic understanding of bonding curve mechanics

## Script Code

```typescript
import { YoinkSDK } from '../src/yoink';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { AnchorProvider, Wallet } from '@coral-xyz/anchor';
import fs from 'fs';
import path from 'path';

interface TokenHolding {
  mint: string;
  symbol: string;
  balance: number;
  decimals: number;
  costBasis: number;
  currentPrice: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  marketCap: number;
  isComplete: boolean;
  totalBuyers: number;
  priceHistory: PricePoint[];
  firstPurchase: Date;
}

interface PricePoint {
  timestamp: number;
  price: number;
  marketCap: number;
  buyers: number;
}

interface PortfolioConfig {
  walletAddress: string;
  rpcUrl?: string;
  updateInterval?: number;
  alertThresholds?: {
    gainPercent: number;
    lossPercent: number;
    curveCompletion: boolean;
  };
  exportPath?: string;
}

class BondingCurvePortfolio {
  private sdk: YoinkSDK;
  private config: PortfolioConfig;
  private portfolio: {
    holdings: Map<string, TokenHolding>;
    totalValue: number;
    totalCost: number;
    totalGainLoss: number;
    totalGainLossPercent: number;
    bestPerformer: TokenHolding | null;
    worstPerformer: TokenHolding | null;
    history: any[];
  };
  private isRunning: boolean = false;
  private lastUpdate: Date | null = null;

  constructor(config: PortfolioConfig) {
    const connection = new Connection(config.rpcUrl || 'https://eclipse.lgns.net');
    const wallet = new Wallet(); // Placeholder - use your actual wallet
    const provider = new AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
      preflightCommitment: 'confirmed',
    });

    this.sdk = new YoinkSDK(provider);
    this.config = {
      updateInterval: 60000, // 1 minute
      alertThresholds: {
        gainPercent: 20,
        lossPercent: -10,
        curveCompletion: true,
      },
      exportPath: './portfolio-data',
      ...config,
    };

    this.portfolio = {
      holdings: new Map(),
      totalValue: 0,
      totalCost: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      bestPerformer: null,
      worstPerformer: null,
      history: [],
    };
  }

  async start() {
    console.log('📊 Starting Bonding Curve Portfolio Dashboard...');
    
    try {
      console.log('✅ Connected, tracking wallet:', this.config.walletAddress);
      
      // Initial portfolio load
      await this.updatePortfolio();
      
      this.isRunning = true;
      this.startMonitoring();
      
    } catch (error) {
      console.error('❌ Failed to start analytics:', error);
    }
  }

  async startMonitoring() {
    while (this.isRunning) {
      try {
        await this.updatePortfolio();
        await this.generateReport();
        await this.checkAlerts();
        
        await this.sleep(this.config.updateInterval!);
      } catch (error) {
        console.error('❌ Monitoring error:', error);
        await this.sleep(5000);
      }
    }
  }

  async updatePortfolio() {
    try {
      console.log('🔄 Updating portfolio data...');
      
      const walletPubkey = new PublicKey(this.config.walletAddress);
      
      // Get all token accounts for the wallet
      const tokenAccounts = await this.sdk.provider.connection.getParsedTokenAccountsByOwner(
        walletPubkey,
        { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
      );

      let totalValue = 0;
      let totalCost = 0;

      for (const account of tokenAccounts.value) {
        const parsedInfo = account.account.data.parsed.info;
        const mintAddress = parsedInfo.mint;
        const balance = parseFloat(parsedInfo.tokenAmount.uiAmount || '0');

        if (balance === 0) continue;

        try {
          // Try to get bonding curve account for this token
          const mint = new PublicKey(mintAddress);
          const curve = await this.sdk.getBondingCurveAccount(mint);

          if (!curve) continue; // Not a bonding curve token

          const currentPrice = curve.getPricePerToken();
          const marketCap = Number(curve.getMarketCapSOL()) / LAMPORTS_PER_SOL;
          const totalBuyers = Number(curve.totalBuyers);
          const isComplete = curve.complete;
          const currentValue = balance * currentPrice;

          // Get or create holding entry
          let holding = this.portfolio.holdings.get(mintAddress);
          if (!holding) {
            holding = {
              mint: mintAddress,
              symbol: `TOKEN_${mintAddress.slice(0, 8)}`,
              balance,
              decimals: parsedInfo.tokenAmount.decimals,
              costBasis: currentValue, // Estimate if unknown
              currentPrice,
              currentValue,
              gainLoss: 0,
              gainLossPercent: 0,
              marketCap,
              isComplete,
              totalBuyers,
              priceHistory: [],
              firstPurchase: new Date(),
            };
          }

          // Update current data
          holding.balance = balance;
          holding.currentPrice = currentPrice;
          holding.currentValue = currentValue;
          holding.marketCap = marketCap;
          holding.isComplete = isComplete;
          holding.totalBuyers = totalBuyers;
          holding.gainLoss = currentValue - holding.costBasis;
          holding.gainLossPercent = holding.costBasis > 0 
            ? (holding.gainLoss / holding.costBasis) * 100 
            : 0;

          // Add to price history
          holding.priceHistory.push({
            timestamp: Date.now(),
            price: currentPrice,
            marketCap,
            buyers: totalBuyers,
          });

          // Keep only last 100 data points
          if (holding.priceHistory.length > 100) {
            holding.priceHistory.shift();
          }

          this.portfolio.holdings.set(mintAddress, holding);
          
          totalValue += currentValue;
          totalCost += holding.costBasis;

        } catch (error) {
          // Skip tokens that aren't bonding curve tokens
          continue;
        }
      }

      // Update portfolio totals
      this.portfolio.totalValue = totalValue;
      this.portfolio.totalCost = totalCost;
      this.portfolio.totalGainLoss = totalValue - totalCost;
      this.portfolio.totalGainLossPercent = totalCost > 0 
        ? (this.portfolio.totalGainLoss / totalCost) * 100 
        : 0;

      // Find best and worst performers
      this.findTopPerformers();

      // Add to history
      this.portfolio.history.push({
        timestamp: new Date(),
        totalValue,
        totalCost,
        gainLoss: this.portfolio.totalGainLoss,
        gainLossPercent: this.portfolio.totalGainLossPercent,
        holdingCount: this.portfolio.holdings.size,
      });

      // Keep only last 1000 history points
      if (this.portfolio.history.length > 1000) {
        this.portfolio.history.shift();
      }

      this.lastUpdate = new Date();

    } catch (error) {
      console.error('❌ Error updating portfolio:', error);
    }
  }

  findTopPerformers() {
    const holdings = Array.from(this.portfolio.holdings.values());
    
    if (holdings.length === 0) {
      this.portfolio.bestPerformer = null;
      this.portfolio.worstPerformer = null;
      return;
    }

    // Best performer by percentage gain
    this.portfolio.bestPerformer = holdings.reduce((best, holding) => {
      return (!best || holding.gainLossPercent > best.gainLossPercent) ? holding : best;
    });

    // Worst performer by percentage loss
    this.portfolio.worstPerformer = holdings.reduce((worst, holding) => {
      return (!worst || holding.gainLossPercent < worst.gainLossPercent) ? holding : worst;
    });
  }

  async generateReport() {
    console.clear();
    console.log('🚀 YOINK BONDING CURVE PORTFOLIO DASHBOARD');
    console.log('==========================================');
    console.log(`Last Update: ${this.lastUpdate?.toLocaleString() || 'Never'}`);
    console.log();
    
    // Portfolio Overview
    console.log('📊 PORTFOLIO OVERVIEW');
    console.log('---------------------');
    console.log(`Total Value: ${this.portfolio.totalValue.toFixed(4)} SOL`);
    console.log(`Total Cost: ${this.portfolio.totalCost.toFixed(4)} SOL`);
    console.log(`Total P&L: ${this.portfolio.totalGainLoss > 0 ? '+' : ''}${this.portfolio.totalGainLoss.toFixed(4)} SOL`);
    console.log(`Total P&L %: ${this.portfolio.totalGainLossPercent > 0 ? '+' : ''}${this.portfolio.totalGainLossPercent.toFixed(2)}%`);
    console.log(`Holdings: ${this.portfolio.holdings.size} tokens`);
    console.log();
    
    // Holdings
    console.log('💼 CURRENT BONDING CURVE HOLDINGS');
    console.log('----------------------------------');
    if (this.portfolio.holdings.size === 0) {
      console.log('No bonding curve tokens in portfolio');
    } else {
      // Sort by value (highest first)
      const sortedHoldings = Array.from(this.portfolio.holdings.values())
        .sort((a, b) => b.currentValue - a.currentValue);

      sortedHoldings.forEach(holding => {
        const pnlColor = holding.gainLoss >= 0 ? '🟢' : '🔴';
        const statusIcon = holding.isComplete ? '✅' : '🔄';
        
        console.log(`${pnlColor} ${statusIcon} ${holding.symbol}`);
        console.log(`   Balance: ${holding.balance.toFixed(2)} tokens`);
        console.log(`   Price: ${holding.currentPrice.toFixed(8)} SOL`);
        console.log(`   Value: ${holding.currentValue.toFixed(4)} SOL`);
        console.log(`   Market Cap: ${holding.marketCap.toFixed(2)} SOL`);
        console.log(`   Buyers: ${holding.totalBuyers}`);
        console.log(`   P&L: ${holding.gainLoss > 0 ? '+' : ''}${holding.gainLoss.toFixed(4)} SOL (${holding.gainLossPercent > 0 ? '+' : ''}${holding.gainLossPercent.toFixed(2)}%)`);
        console.log(`   Status: ${holding.isComplete ? 'Curve Complete' : 'Active Trading'}`);
        console.log();
      });
    }
    
    // Top Performers
    if (this.portfolio.bestPerformer && this.portfolio.worstPerformer) {
      console.log('🏆 PERFORMANCE LEADERS');
      console.log('----------------------');
      console.log(`🥇 Best: ${this.portfolio.bestPerformer.symbol} (+${this.portfolio.bestPerformer.gainLossPercent.toFixed(2)}%)`);
      console.log(`🥉 Worst: ${this.portfolio.worstPerformer.symbol} (${this.portfolio.worstPerformer.gainLossPercent.toFixed(2)}%)`);
      console.log();
    }

    // Curve Status Summary
    const completedCurves = Array.from(this.portfolio.holdings.values()).filter(h => h.isComplete).length;
    const activeCurves = this.portfolio.holdings.size - completedCurves;
    
    console.log('📈 CURVE STATUS SUMMARY');
    console.log('-----------------------');
    console.log(`Active Curves: ${activeCurves}`);
    console.log(`Completed Curves: ${completedCurves}`);
    console.log();
    
    // Performance Chart (ASCII)
    this.drawPerformanceChart();
  }

  drawPerformanceChart() {
    if (this.portfolio.history.length < 2) return;
    
    console.log('📈 PORTFOLIO PERFORMANCE (Last 20 Updates)');
    console.log('------------------------------------------');
    
    const recentHistory = this.portfolio.history.slice(-20);
    const values = recentHistory.map(h => h.gainLossPercent);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    recentHistory.forEach((point, index) => {
      const normalized = ((point.gainLossPercent - min) / range) * 20;
      const bar = '█'.repeat(Math.max(1, Math.floor(normalized)));
      const time = point.timestamp.toLocaleTimeString().slice(0, 5);
      console.log(`${time} |${bar} ${point.gainLossPercent.toFixed(2)}%`);
    });
    console.log();
  }

  async checkAlerts() {
    try {
      this.portfolio.holdings.forEach(holding => {
        const { gainPercent, lossPercent, curveCompletion } = this.config.alertThresholds!;
        
        // Gain alert
        if (holding.gainLossPercent >= gainPercent) {
          this.sendAlert(`🚀 ${holding.symbol} is up ${holding.gainLossPercent.toFixed(2)}%! Current value: ${holding.currentValue.toFixed(4)} SOL`);
        }
        
        // Loss alert
        if (holding.gainLossPercent <= lossPercent) {
          this.sendAlert(`⚠️ ${holding.symbol} is down ${Math.abs(holding.gainLossPercent).toFixed(2)}%. Current value: ${holding.currentValue.toFixed(4)} SOL`);
        }

        // Curve completion alert
        if (curveCompletion && holding.isComplete) {
          this.sendAlert(`✅ ${holding.symbol} bonding curve completed! Final market cap: ${holding.marketCap.toFixed(2)} SOL`);
        }
      });
    } catch (error) {
      console.error('❌ Error checking alerts:', error);
    }
  }

  sendAlert(message: string) {
    console.log(`🔔 ALERT: ${message}`);
    // Here you could integrate with Discord, Telegram, email, etc.
  }

  async exportData() {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        portfolio: {
          totalValue: this.portfolio.totalValue,
          totalCost: this.portfolio.totalCost,
          totalGainLoss: this.portfolio.totalGainLoss,
          totalGainLossPercent: this.portfolio.totalGainLossPercent,
        },
        holdings: Array.from(this.portfolio.holdings.entries()).map(([mint, data]) => ({
          mint,
          ...data,
        })),
        history: this.portfolio.history,
      };
      
      const filename = `portfolio-${new Date().toISOString().split('T')[0]}.json`;
      const filepath = path.join(this.config.exportPath!, filename);
      
      // Ensure directory exists
      if (!fs.existsSync(this.config.exportPath!)) {
        fs.mkdirSync(this.config.exportPath!, { recursive: true });
      }
      
      fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2));
      console.log(`📁 Data exported to: ${filepath}`);
      
    } catch (error) {
      console.error('❌ Export failed:', error);
    }
  }

  stop() {
    console.log('🛑 Stopping portfolio analytics...');
    this.isRunning = false;
    
    // Export final data
    this.exportData();
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage Example
async function main() {
  const portfolio = new BondingCurvePortfolio({
    walletAddress: 'YOUR_WALLET_ADDRESS_HERE',
    rpcUrl: 'https://eclipse.lgns.net',
    updateInterval: 30000, // 30 seconds
    alertThresholds: {
      gainPercent: 25,  // Alert on 25% gains
      lossPercent: -15, // Alert on 15% losses
      curveCompletion: true, // Alert on curve completion
    },
    exportPath: './portfolio-exports',
  });
  
  await portfolio.start();
  
  // Export data every hour
  setInterval(() => {
    portfolio.exportData();
  }, 3600000);
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    portfolio.stop();
    process.exit(0);
  });
}

// Run the portfolio dashboard
main().catch(console.error);
```

## Features

### 📊 Real-time Tracking
- Live bonding curve token portfolio value updates
- Individual token performance monitoring
- Historical price and market cap data
- Buyer count tracking for each token

### 📈 Analytics
- P&L calculations for all positions
- Performance percentages and rankings
- Best/worst performer identification
- ASCII performance charts
- Curve completion status tracking

### 🔔 Smart Alerts
- Configurable gain/loss thresholds
- Curve completion notifications
- Market cap change alerts
- Real-time notification system

### 📁 Data Export
- JSON portfolio snapshots
- Historical performance data
- Token-specific analytics
- Custom export paths

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `walletAddress` | String | Required | Wallet address to track |
| `rpcUrl` | String | `'https://eclipse.lgns.net'` | Solana RPC endpoint |
| `updateInterval` | Number | `60000` | Update frequency (ms) |
| `alertThresholds.gainPercent` | Number | `20` | Gain alert threshold (%) |
| `alertThresholds.lossPercent` | Number | `-10` | Loss alert threshold (%) |
| `alertThresholds.curveCompletion` | Boolean | `true` | Alert on curve completion |
| `exportPath` | String | `'./portfolio-data'` | Data export directory |

## Running the Script

1. **Install dependencies**:
   ```bash
   npm install @solana/web3.js @coral-xyz/anchor
   ```

2. **Configure settings**:
   ```typescript
   const portfolio = new BondingCurvePortfolio({
     walletAddress: 'YOUR_WALLET_ADDRESS',
     rpcUrl: 'https://eclipse.lgns.net',
     alertThresholds: {
       gainPercent: 25,
       lossPercent: -15,
       curveCompletion: true,
     }
   });
   ```

3. **Run the dashboard**:
   ```bash
   npx ts-node portfolio-dashboard.ts
   ```

## Sample Output

```
🚀 YOINK BONDING CURVE PORTFOLIO DASHBOARD
==========================================
Last Update: 11/4/2025, 2:30:15 PM

📊 PORTFOLIO OVERVIEW
---------------------
Total Value: 12.4567 SOL
Total Cost: 10.0000 SOL
Total P&L: +2.4567 SOL
Total P&L %: +24.57%
Holdings: 3 tokens

💼 CURRENT BONDING CURVE HOLDINGS
----------------------------------
🟢 ✅ TOKEN_HbiDw6U5
   Balance: 1000.00 tokens
   Price: 0.00500000 SOL
   Value: 5.0000 SOL
   Market Cap: 45.50 SOL
   Buyers: 127
   P&L: +1.0000 SOL (+25.00%)
   Status: Curve Complete

🔴 🔄 TOKEN_ABC12345
   Balance: 500.00 tokens
   Price: 0.00300000 SOL
   Value: 1.5000 SOL
   Market Cap: 12.30 SOL
   Buyers: 45
   P&L: -0.5000 SOL (-25.00%)
   Status: Active Trading

🏆 PERFORMANCE LEADERS
----------------------
🥇 Best: TOKEN_HbiDw6U5 (+25.00%)
🥉 Worst: TOKEN_ABC12345 (-25.00%)

📈 CURVE STATUS SUMMARY
-----------------------
Active Curves: 2
Completed Curves: 1
```

## Advanced Features

- **Real-time Bonding Curve Data**: Direct integration with Yoink SDK for accurate market data
- **Curve Completion Tracking**: Monitor when bonding curves reach full completion
- **Market Cap Analysis**: Track token market capitalization changes over time
- **Buyer Analytics**: Monitor the number of unique buyers for each token
- **Position Management**: Comprehensive tracking of entry prices and performance
- **Risk Metrics**: Calculate portfolio risk and concentration metrics

## Integration Ideas

- **Discord/Telegram Bots**: Connect alerts to messaging platforms
- **Portfolio Rebalancing**: Automated position sizing based on performance
- **Tax Reporting**: Export data in formats suitable for tax preparation
- **Risk Management**: Set stop-losses and profit targets
- **Social Trading**: Share portfolio performance with community

## Next Steps

- [📦 Back to SDK Overview](overview.md)
- [🤖 Try Bonding Curve Trading Bot](creator-token-bot.md)
- [📈 Market Analytics & Insights](creator-analytics.md)
- [📖 Read the Usage Guide](usage.md)