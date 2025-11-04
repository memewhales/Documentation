# 📈 Bonding Curve Market Analytics

This example demonstrates how to build a comprehensive analytics tool for tracking bonding curve token performance, market metrics, and generating insights for data-driven investment decisions in the Yoink ecosystem.

## Overview

This tool provides:
- Deep analytics on bonding curve token performance and market trends
- Token price analysis and curve progression tracking
- Market ranking and comparison tools
- Investment recommendation engine based on bonding curve metrics
- Real-time alerts for curve completion and price milestones
- Comprehensive reporting and data export for market research

## Prerequisites

- Yoink SDK installed and configured
- Access to bonding curve data
- Basic understanding of bonding curve mechanics
- Optional: Data visualization libraries for advanced charts

## Script Code

```typescript
import { YoinkSDK } from '../src/yoink';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { AnchorProvider, Wallet } from '@coral-xyz/anchor';
import fs from 'fs';
import path from 'path';

interface TokenAnalytics {
  mint: string;
  symbol: string;
  currentPrice: number;
  marketCap: number;
  totalBuyers: number;
  isComplete: boolean;
  
  // Performance Metrics
  performance: {
    return24h: number;
    return7d: number;
    return30d: number;
    direction: 'up' | 'down' | 'flat';
  };
  
  // Market Metrics
  volatility: number;
  momentum: number;
  liquidityScore: number;
  buyerGrowthRate: number;
  
  // Curve Metrics
  curveProgress: number; // Percentage to completion
  timeToCompletion: number; // Estimated hours
  averageBuySize: number;
  priceGrowthRate: number;
  
  // Risk Assessment
  riskScore: number;
  stabilityIndex: number;
  
  // Historical Data
  priceHistory: PricePoint[];
  buyerHistory: BuyerPoint[];
  
  // Timestamps
  createdAt: Date;
  lastUpdated: Date;
  curveAge: number; // Hours since creation
}

interface PricePoint {
  timestamp: number;
  price: number;
  marketCap: number;
  buyers: number;
}

interface BuyerPoint {
  timestamp: number;
  totalBuyers: number;
  newBuyers: number;
}

interface MarketConfig {
  rpcUrl?: string;
  updateInterval?: number;
  trackingPeriod?: number;
  alerts?: {
    priceChange: number;
    curveCompletion: boolean;
    volumeSpike: number;
    buyerMilestone: number;
  };
  exportPath?: string;
  autoExport?: boolean;
}

class BondingCurveAnalytics {
  private sdk: YoinkSDK;
  private config: MarketConfig;
  private analytics: {
    tokens: Map<string, TokenAnalytics>;
    rankings: {
      byPerformance: TokenAnalytics[];
      byMarketCap: TokenAnalytics[];
      byGrowth: TokenAnalytics[];
      byVolume: TokenAnalytics[];
      byRisk: TokenAnalytics[];
    };
    marketSummary: {
      totalTokens: number;
      totalMarketCap: number;
      avgPerformance: number;
      completedCurves: number;
      activeCurves: number;
      avgTimeToCompletion: number;
    };
    insights: any[];
  };
  private isRunning: boolean = false;
  private lastUpdate: Date | null = null;

  constructor(config: MarketConfig = {}) {
    const connection = new Connection(config.rpcUrl || 'https://eclipse.lgns.net');
    const wallet = new Wallet(); // Use your actual wallet
    const provider = new AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
      preflightCommitment: 'confirmed',
    });

    this.sdk = new YoinkSDK(provider);
    this.config = {
      updateInterval: 60000, // 1 minute
      trackingPeriod: 168, // 7 days in hours
      alerts: {
        priceChange: 25,
        curveCompletion: true,
        volumeSpike: 300,
        buyerMilestone: 100,
      },
      exportPath: './market-analytics',
      autoExport: true,
      ...config,
    };

    this.analytics = {
      tokens: new Map(),
      rankings: {
        byPerformance: [],
        byMarketCap: [],
        byGrowth: [],
        byVolume: [],
        byRisk: [],
      },
      marketSummary: {
        totalTokens: 0,
        totalMarketCap: 0,
        avgPerformance: 0,
        completedCurves: 0,
        activeCurves: 0,
        avgTimeToCompletion: 0,
      },
      insights: [],
    };
  }

  async start() {
    console.log('📈 Starting Bonding Curve Market Analytics...');
    
    try {
      console.log('✅ Connected to Eclipse network');
      
      // Initial data load
      await this.loadMarketData();
      await this.performAnalysis();
      
      this.isRunning = true;
      this.startContinuousAnalysis();
      
      if (this.config.autoExport) {
        this.startAutoExport();
      }
      
    } catch (error) {
      console.error('❌ Failed to start analytics:', error);
    }
  }

  async loadMarketData() {
    console.log('📊 Loading bonding curve market data...');
    
    try {
      // In a real implementation, you would scan for all bonding curve tokens
      // For now, we'll use a sample of known tokens
      const knownTokens = [
        'HbiDw6U515iWwHQ4edjmceT24ST7akg7z5rhXRhBac4J',
        // Add more known token mints here
      ];

      for (const mintStr of knownTokens) {
        try {
          await this.analyzeToken(new PublicKey(mintStr));
        } catch (error) {
          console.error(`Error analyzing token ${mintStr}:`, error);
        }
      }
      
      console.log(`✅ Loaded data for ${this.analytics.tokens.size} tokens`);
      
    } catch (error) {
      console.error('❌ Error loading market data:', error);
    }
  }

  async analyzeToken(mint: PublicKey) {
    try {
      const curve = await this.sdk.getBondingCurveAccount(mint);
      if (!curve) return;

      const mintStr = mint.toBase58();
      const currentPrice = curve.getPricePerToken();
      const marketCap = Number(curve.getMarketCapSOL()) / LAMPORTS_PER_SOL;
      const totalBuyers = Number(curve.totalBuyers);
      const isComplete = curve.complete;

      // Get or create existing analytics
      let existing = this.analytics.tokens.get(mintStr);
      const createdAt = existing?.createdAt || new Date();
      const curveAge = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60); // Hours

      // Calculate performance metrics
      const performance = this.calculatePerformance(existing, currentPrice);
      const volatility = this.calculateVolatility(existing);
      const momentum = this.calculateMomentum(existing, currentPrice);
      const liquidityScore = this.calculateLiquidityScore(curve);
      const buyerGrowthRate = this.calculateBuyerGrowthRate(existing, totalBuyers);
      
      // Curve-specific metrics
      const curveProgress = this.calculateCurveProgress(curve);
      const timeToCompletion = this.estimateTimeToCompletion(curve, existing);
      const averageBuySize = this.calculateAverageBuySize(curve);
      const priceGrowthRate = this.calculatePriceGrowthRate(existing, currentPrice);
      
      // Risk assessment
      const riskScore = this.calculateRiskScore(curve, existing);
      const stabilityIndex = this.calculateStabilityIndex(existing);

      // Update price and buyer history
      const priceHistory = existing?.priceHistory || [];
      const buyerHistory = existing?.buyerHistory || [];

      priceHistory.push({
        timestamp: Date.now(),
        price: currentPrice,
        marketCap,
        buyers: totalBuyers,
      });

      buyerHistory.push({
        timestamp: Date.now(),
        totalBuyers,
        newBuyers: existing ? Math.max(0, totalBuyers - existing.totalBuyers) : 0,
      });

      // Keep only recent history (last 7 days)
      const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000);
      const recentPriceHistory = priceHistory.filter(p => p.timestamp > cutoff);
      const recentBuyerHistory = buyerHistory.filter(b => b.timestamp > cutoff);

      const analytics: TokenAnalytics = {
        mint: mintStr,
        symbol: `TOKEN_${mintStr.slice(0, 8)}`,
        currentPrice,
        marketCap,
        totalBuyers,
        isComplete,
        
        performance,
        volatility,
        momentum,
        liquidityScore,
        buyerGrowthRate,
        
        curveProgress,
        timeToCompletion,
        averageBuySize,
        priceGrowthRate,
        
        riskScore,
        stabilityIndex,
        
        priceHistory: recentPriceHistory,
        buyerHistory: recentBuyerHistory,
        
        createdAt,
        lastUpdated: new Date(),
        curveAge,
      };

      this.analytics.tokens.set(mintStr, analytics);

    } catch (error) {
      console.error(`❌ Error analyzing token ${mint.toBase58()}:`, error);
    }
  }

  calculatePerformance(existing: TokenAnalytics | undefined, currentPrice: number) {
    if (!existing || existing.priceHistory.length === 0) {
      return { return24h: 0, return7d: 0, return30d: 0, direction: 'flat' as const };
    }

    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    
    // Find prices at different intervals
    const price24h = this.findPriceAtTime(existing.priceHistory, now - day);
    const price7d = this.findPriceAtTime(existing.priceHistory, now - (7 * day));
    const price30d = this.findPriceAtTime(existing.priceHistory, now - (30 * day));

    const return24h = price24h ? ((currentPrice - price24h) / price24h) * 100 : 0;
    const return7d = price7d ? ((currentPrice - price7d) / price7d) * 100 : 0;
    const return30d = price30d ? ((currentPrice - price30d) / price30d) * 100 : 0;

    const direction = return24h > 1 ? 'up' : return24h < -1 ? 'down' : 'flat';

    return { return24h, return7d, return30d, direction };
  }

  findPriceAtTime(history: PricePoint[], targetTime: number): number | null {
    const closest = history.reduce((prev, curr) => 
      Math.abs(curr.timestamp - targetTime) < Math.abs(prev.timestamp - targetTime) ? curr : prev
    );
    
    return Math.abs(closest.timestamp - targetTime) < (2 * 60 * 60 * 1000) ? closest.price : null;
  }

  calculateVolatility(existing: TokenAnalytics | undefined): number {
    if (!existing || existing.priceHistory.length < 2) return 0;

    const prices = existing.priceHistory.slice(-24); // Last 24 data points
    if (prices.length < 2) return 0;

    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      const dailyReturn = (prices[i].price - prices[i-1].price) / prices[i-1].price;
      returns.push(dailyReturn);
    }

    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;

    return Math.sqrt(variance) * 100;
  }

  calculateMomentum(existing: TokenAnalytics | undefined, currentPrice: number): number {
    if (!existing || existing.priceHistory.length < 10) return 0;

    const recent = existing.priceHistory.slice(-5);
    const older = existing.priceHistory.slice(-10, -5);

    const recentAvg = recent.reduce((sum, p) => sum + p.price, 0) / recent.length;
    const olderAvg = older.reduce((sum, p) => sum + p.price, 0) / older.length;

    return ((recentAvg - olderAvg) / olderAvg) * 100;
  }

  calculateLiquidityScore(curve: any): number {
    const marketCap = Number(curve.getMarketCapSOL()) / LAMPORTS_PER_SOL;
    const totalBuyers = Number(curve.totalBuyers);
    
    // Score based on market cap and buyer diversity
    const marketCapScore = Math.min(100, marketCap * 2); // Higher market cap = better liquidity
    const buyerScore = Math.min(100, totalBuyers / 5); // More buyers = better liquidity
    
    return (marketCapScore + buyerScore) / 2;
  }

  calculateBuyerGrowthRate(existing: TokenAnalytics | undefined, currentBuyers: number): number {
    if (!existing || existing.buyerHistory.length < 2) return 0;

    const hourAgo = Date.now() - (60 * 60 * 1000);
    const previousBuyers = this.findBuyersAtTime(existing.buyerHistory, hourAgo);
    
    if (!previousBuyers) return 0;
    
    return previousBuyers > 0 ? ((currentBuyers - previousBuyers) / previousBuyers) * 100 : 0;
  }

  findBuyersAtTime(history: BuyerPoint[], targetTime: number): number | null {
    const closest = history.reduce((prev, curr) => 
      Math.abs(curr.timestamp - targetTime) < Math.abs(prev.timestamp - targetTime) ? curr : prev
    );
    
    return Math.abs(closest.timestamp - targetTime) < (2 * 60 * 60 * 1000) ? closest.totalBuyers : null;
  }

  calculateCurveProgress(curve: any): number {
    if (curve.complete) return 100;
    
    const currentMarketCap = Number(curve.getMarketCapSOL()) / LAMPORTS_PER_SOL;
    // Assuming curves complete around 85-90 SOL market cap
    const completionMarketCap = 85;
    
    return Math.min(100, (currentMarketCap / completionMarketCap) * 100);
  }

  estimateTimeToCompletion(curve: any, existing: TokenAnalytics | undefined): number {
    if (curve.complete) return 0;
    if (!existing || existing.priceHistory.length < 5) return -1; // Not enough data

    const currentProgress = this.calculateCurveProgress(curve);
    const remainingProgress = 100 - currentProgress;
    
    // Calculate average progress per hour
    const hoursOfData = Math.min(24, existing.priceHistory.length);
    const progressGained = this.calculateProgressGained(existing, hoursOfData);
    const avgProgressPerHour = progressGained / hoursOfData;
    
    return avgProgressPerHour > 0 ? remainingProgress / avgProgressPerHour : -1;
  }

  calculateProgressGained(existing: TokenAnalytics, hours: number): number {
    if (existing.priceHistory.length < 2) return 0;
    
    const recent = existing.priceHistory[existing.priceHistory.length - 1];
    const past = existing.priceHistory[Math.max(0, existing.priceHistory.length - hours)];
    
    const recentProgress = this.calculateProgressFromMarketCap(recent.marketCap);
    const pastProgress = this.calculateProgressFromMarketCap(past.marketCap);
    
    return recentProgress - pastProgress;
  }

  calculateProgressFromMarketCap(marketCap: number): number {
    const completionMarketCap = 85;
    return Math.min(100, (marketCap / completionMarketCap) * 100);
  }

  calculateAverageBuySize(curve: any): number {
    const totalBuyers = Number(curve.totalBuyers);
    const marketCap = Number(curve.getMarketCapSOL()) / LAMPORTS_PER_SOL;
    
    return totalBuyers > 0 ? marketCap / totalBuyers : 0;
  }

  calculatePriceGrowthRate(existing: TokenAnalytics | undefined, currentPrice: number): number {
    if (!existing || existing.priceHistory.length < 2) return 0;

    const hourAgo = Date.now() - (60 * 60 * 1000);
    const previousPrice = this.findPriceAtTime(existing.priceHistory, hourAgo);
    
    if (!previousPrice) return 0;
    
    return ((currentPrice - previousPrice) / previousPrice) * 100;
  }

  calculateRiskScore(curve: any, existing: TokenAnalytics | undefined): number {
    let riskScore = 0;
    
    const totalBuyers = Number(curve.totalBuyers);
    const marketCap = Number(curve.getMarketCapSOL()) / LAMPORTS_PER_SOL;
    
    // Low buyer count increases risk
    if (totalBuyers < 10) riskScore += 40;
    else if (totalBuyers < 25) riskScore += 20;
    else if (totalBuyers < 50) riskScore += 10;
    
    // Low market cap increases risk
    if (marketCap < 1) riskScore += 30;
    else if (marketCap < 5) riskScore += 15;
    
    // High volatility increases risk
    if (existing) {
      if (existing.volatility > 50) riskScore += 20;
      else if (existing.volatility > 25) riskScore += 10;
    }
    
    // Age factor - very new tokens are riskier
    if (existing && existing.curveAge < 1) riskScore += 15;
    else if (existing && existing.curveAge < 6) riskScore += 8;
    
    return Math.min(100, riskScore);
  }

  calculateStabilityIndex(existing: TokenAnalytics | undefined): number {
    if (!existing) return 0;
    
    const volatilityScore = Math.max(0, 100 - existing.volatility * 2);
    const ageScore = Math.min(100, existing.curveAge * 4); // More stable as it ages
    const buyerScore = Math.min(100, existing.totalBuyers * 2);
    
    return (volatilityScore + ageScore + buyerScore) / 3;
  }

  async performAnalysis() {
    console.log('🔍 Performing comprehensive market analysis...');
    
    // Generate rankings
    this.generateRankings();
    
    // Generate market insights
    this.generateInsights();
    
    // Update market summary
    this.updateMarketSummary();
    
    this.lastUpdate = new Date();
    console.log('✅ Analysis complete');
  }

  generateRankings() {
    const tokens = Array.from(this.analytics.tokens.values());
    
    // Performance ranking (24h returns)
    this.analytics.rankings.byPerformance = tokens
      .sort((a, b) => b.performance.return24h - a.performance.return24h)
      .slice(0, 20);
    
    // Market cap ranking
    this.analytics.rankings.byMarketCap = tokens
      .sort((a, b) => b.marketCap - a.marketCap)
      .slice(0, 20);
    
    // Growth ranking (buyer growth rate)
    this.analytics.rankings.byGrowth = tokens
      .sort((a, b) => b.buyerGrowthRate - a.buyerGrowthRate)
      .slice(0, 20);
    
    // Risk ranking (lowest risk first)
    this.analytics.rankings.byRisk = tokens
      .sort((a, b) => a.riskScore - b.riskScore)
      .slice(0, 20);
  }

  generateInsights() {
    const tokens = Array.from(this.analytics.tokens.values());
    this.analytics.insights = [];
    
    // Market trends
    const avgPerformance = tokens.reduce((sum, t) => sum + t.performance.return24h, 0) / tokens.length;
    this.analytics.insights.push({
      type: 'market_trend',
      title: 'Market Performance',
      message: `Average 24h return: ${avgPerformance.toFixed(2)}%`,
      sentiment: avgPerformance > 0 ? 'positive' : 'negative',
    });
    
    // Top performers
    const topPerformer = this.analytics.rankings.byPerformance[0];
    if (topPerformer) {
      this.analytics.insights.push({
        type: 'top_performer',
        title: 'Best Performing Token',
        message: `${topPerformer.symbol} leading with ${topPerformer.performance.return24h.toFixed(2)}% return`,
        token: topPerformer.mint,
        sentiment: 'positive',
      });
    }
    
    // Curve completion alerts
    const nearCompletion = tokens.filter(t => t.curveProgress > 80 && !t.isComplete);
    if (nearCompletion.length > 0) {
      this.analytics.insights.push({
        type: 'completion_alert',
        title: 'Curves Near Completion',
        message: `${nearCompletion.length} tokens approaching curve completion`,
        sentiment: 'neutral',
      });
    }
    
    // High risk warnings
    const highRiskTokens = tokens.filter(t => t.riskScore > 70);
    if (highRiskTokens.length > 0) {
      this.analytics.insights.push({
        type: 'risk_warning',
        title: 'High Risk Alert',
        message: `${highRiskTokens.length} tokens showing high risk indicators`,
        sentiment: 'negative',
      });
    }
    
    // Momentum analysis
    const strongMomentum = tokens.filter(t => Math.abs(t.momentum) > 15);
    if (strongMomentum.length > 0) {
      this.analytics.insights.push({
        type: 'momentum_alert',
        title: 'Strong Momentum Detected',
        message: `${strongMomentum.length} tokens showing significant momentum shifts`,
        sentiment: 'neutral',
      });
    }
  }

  updateMarketSummary() {
    const tokens = Array.from(this.analytics.tokens.values());
    
    this.analytics.marketSummary = {
      totalTokens: tokens.length,
      totalMarketCap: tokens.reduce((sum, t) => sum + t.marketCap, 0),
      avgPerformance: tokens.reduce((sum, t) => sum + t.performance.return24h, 0) / tokens.length,
      completedCurves: tokens.filter(t => t.isComplete).length,
      activeCurves: tokens.filter(t => !t.isComplete).length,
      avgTimeToCompletion: this.calculateAvgTimeToCompletion(tokens),
    };
  }

  calculateAvgTimeToCompletion(tokens: TokenAnalytics[]): number {
    const activeTokens = tokens.filter(t => !t.isComplete && t.timeToCompletion > 0);
    if (activeTokens.length === 0) return 0;
    
    return activeTokens.reduce((sum, t) => sum + t.timeToCompletion, 0) / activeTokens.length;
  }

  async startContinuousAnalysis() {
    while (this.isRunning) {
      try {
        await this.loadMarketData();
        await this.performAnalysis();
        this.displayDashboard();
        await this.checkAlerts();
        
        await this.sleep(this.config.updateInterval!);
      } catch (error) {
        console.error('❌ Analysis error:', error);
        await this.sleep(30000);
      }
    }
  }

  startAutoExport() {
    setInterval(() => {
      this.exportAnalytics();
    }, 3600000); // Export every hour
  }

  async checkAlerts() {
    const tokens = Array.from(this.analytics.tokens.values());
    
    tokens.forEach(token => {
      const { priceChange, curveCompletion, buyerMilestone } = this.config.alerts!;
      
      // Price change alerts
      if (Math.abs(token.performance.return24h) >= priceChange) {
        const direction = token.performance.return24h > 0 ? 'gained' : 'lost';
        this.sendAlert(`🚨 ${token.symbol} has ${direction} ${Math.abs(token.performance.return24h).toFixed(2)}% in 24h`);
      }
      
      // Curve completion alerts
      if (curveCompletion && token.isComplete) {
        this.sendAlert(`✅ ${token.symbol} bonding curve completed! Final market cap: ${token.marketCap.toFixed(2)} SOL`);
      }
      
      // Buyer milestone alerts
      if (token.totalBuyers >= buyerMilestone && token.totalBuyers < buyerMilestone + 10) {
        this.sendAlert(`👥 ${token.symbol} reached ${token.totalBuyers} buyers milestone!`);
      }
    });
  }

  sendAlert(message: string) {
    console.log(`🔔 ALERT: ${message}`);
    // Here you could integrate with Discord, Telegram, email, etc.
  }

  displayDashboard() {
    console.clear();
    console.log('📈 YOINK BONDING CURVE MARKET ANALYTICS');
    console.log('======================================');
    console.log(`Last Update: ${this.lastUpdate?.toLocaleString()}`);
    console.log(`Tracking ${this.analytics.tokens.size} bonding curve tokens`);
    console.log();
    
    // Market summary
    console.log('📊 MARKET SUMMARY');
    console.log('-----------------');
    console.log(`Total Market Cap: ${this.analytics.marketSummary.totalMarketCap.toFixed(2)} SOL`);
    console.log(`Average Performance: ${this.analytics.marketSummary.avgPerformance > 0 ? '+' : ''}${this.analytics.marketSummary.avgPerformance.toFixed(2)}%`);
    console.log(`Active Curves: ${this.analytics.marketSummary.activeCurves}`);
    console.log(`Completed Curves: ${this.analytics.marketSummary.completedCurves}`);
    if (this.analytics.marketSummary.avgTimeToCompletion > 0) {
      console.log(`Avg Time to Completion: ${this.analytics.marketSummary.avgTimeToCompletion.toFixed(1)}h`);
    }
    console.log();
    
    // Top performers
    console.log('🏆 TOP PERFORMERS (24H)');
    console.log('------------------------');
    this.analytics.rankings.byPerformance.slice(0, 5).forEach((token, index) => {
      const trend = token.performance.direction === 'up' ? '📈' : 
                   token.performance.direction === 'down' ? '📉' : '➡️';
      const status = token.isComplete ? '✅' : '🔄';
      
      console.log(`${index + 1}. ${trend} ${status} ${token.symbol}`);
      console.log(`   24h: ${token.performance.return24h > 0 ? '+' : ''}${token.performance.return24h.toFixed(2)}%`);
      console.log(`   Market Cap: ${token.marketCap.toFixed(2)} SOL`);
      console.log(`   Progress: ${token.curveProgress.toFixed(1)}%`);
      console.log(`   Buyers: ${token.totalBuyers}`);
      console.log(`   Risk: ${token.riskScore.toFixed(0)}/100`);
      console.log();
    });
    
    // Key insights
    console.log('💡 KEY INSIGHTS');
    console.log('---------------');
    this.analytics.insights.slice(0, 4).forEach(insight => {
      const emoji = insight.sentiment === 'positive' ? '✅' : 
                   insight.sentiment === 'negative' ? '⚠️' : 'ℹ️';
      console.log(`${emoji} ${insight.title}: ${insight.message}`);
    });
    console.log();
    
    // Curve status breakdown
    const tokens = Array.from(this.analytics.tokens.values());
    const progressRanges = [
      { range: '0-25%', count: tokens.filter(t => t.curveProgress < 25).length },
      { range: '25-50%', count: tokens.filter(t => t.curveProgress >= 25 && t.curveProgress < 50).length },
      { range: '50-75%', count: tokens.filter(t => t.curveProgress >= 50 && t.curveProgress < 75).length },
      { range: '75-99%', count: tokens.filter(t => t.curveProgress >= 75 && t.curveProgress < 100).length },
      { range: 'Complete', count: tokens.filter(t => t.isComplete).length },
    ];
    
    console.log('📈 CURVE PROGRESS DISTRIBUTION');
    console.log('------------------------------');
    progressRanges.forEach(({ range, count }) => {
      if (count > 0) {
        console.log(`${range}: ${count} tokens`);
      }
    });
  }

  async exportAnalytics() {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        marketSummary: this.analytics.marketSummary,
        tokens: Array.from(this.analytics.tokens.values()),
        rankings: this.analytics.rankings,
        insights: this.analytics.insights,
        config: {
          updateInterval: this.config.updateInterval,
          trackingPeriod: this.config.trackingPeriod,
        }
      };
      
      const filename = `bonding-curve-analytics-${new Date().toISOString().split('T')[0]}.json`;
      const filepath = path.join(this.config.exportPath!, filename);
      
      if (!fs.existsSync(this.config.exportPath!)) {
        fs.mkdirSync(this.config.exportPath!, { recursive: true });
      }
      
      fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2));
      console.log(`📁 Analytics exported to: ${filepath}`);
      
    } catch (error) {
      console.error('❌ Export failed:', error);
    }
  }

  stop() {
    console.log('🛑 Stopping bonding curve analytics...');
    this.isRunning = false;
    this.exportAnalytics(); // Final export
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage Example
async function main() {
  const analytics = new BondingCurveAnalytics({
    rpcUrl: 'https://eclipse.lgns.net',
    updateInterval: 120000, // 2 minutes
    trackingPeriod: 168, // 7 days
    
    alerts: {
      priceChange: 30, // Alert on 30% price changes
      curveCompletion: true, // Alert on curve completion
      volumeSpike: 500, // Alert on 500% volume spikes
      buyerMilestone: 100, // Alert every 100 buyers
    },
    
    exportPath: './market-analytics',
    autoExport: true,
  });
  
  await analytics.start();
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    analytics.stop();
    process.exit(0);
  });
}

// Run the market analytics dashboard
main().catch(console.error);
```

## Features

### 📊 Comprehensive Market Analytics
- Real-time bonding curve token performance tracking
- Market cap and price analysis
- Buyer growth and momentum metrics
- Curve progression and completion tracking

### 🏆 Rankings & Comparisons
- Performance leaderboards by 24h returns
- Market cap rankings
- Growth rate comparisons
- Risk assessment rankings

### 🔮 Predictive Insights
- Momentum analysis and trend detection
- Time-to-completion estimates for active curves
- Risk scoring and stability analysis
- Market sentiment indicators

### 📈 Advanced Bonding Curve Metrics
- Curve progress percentage tracking
- Average buy size analysis
- Price growth rate calculations
- Buyer acquisition rate monitoring

### 📁 Data Export & Alerts
- JSON data exports with full analytics
- Real-time alerts for price changes and milestones
- Historical data tracking
- Automated reporting

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rpcUrl` | String | `'https://eclipse.lgns.net'` | Solana RPC endpoint |
| `updateInterval` | Number | `60000` | Update frequency (ms) |
| `trackingPeriod` | Number | `168` | Hours of historical data |
| `alerts.priceChange` | Number | `25` | Price change alert (%) |
| `alerts.curveCompletion` | Boolean | `true` | Alert on curve completion |
| `alerts.buyerMilestone` | Number | `100` | Buyer milestone alerts |
| `exportPath` | String | `'./market-analytics'` | Export directory |
| `autoExport` | Boolean | `true` | Enable auto exports |

## Running the Script

1. **Install dependencies**:
   ```bash
   npm install @solana/web3.js @coral-xyz/anchor
   ```

2. **Configure analytics**:
   ```typescript
   const analytics = new BondingCurveAnalytics({
     updateInterval: 60000, // 1 minute updates
     alerts: { 
       priceChange: 25,
       curveCompletion: true 
     }
   });
   ```

3. **Start the dashboard**:
   ```bash
   npx ts-node bonding-curve-analytics.ts
   ```

## Sample Output

```
📈 YOINK BONDING CURVE MARKET ANALYTICS
======================================
Last Update: 11/4/2025, 3:15:45 PM
Tracking 45 bonding curve tokens

📊 MARKET SUMMARY
-----------------
Total Market Cap: 1,247.89 SOL
Average Performance: +12.34%
Active Curves: 32
Completed Curves: 13
Avg Time to Completion: 18.5h

🏆 TOP PERFORMERS (24H)
------------------------
1. 📈 🔄 TOKEN_HbiDw6U5
   24h: +45.67%
   Market Cap: 78.90 SOL
   Progress: 87.3%
   Buyers: 156
   Risk: 25/100

2. 📈 ✅ TOKEN_ABC12345
   24h: +23.45%
   Market Cap: 85.00 SOL
   Progress: 100.0%
   Buyers: 234
   Risk: 15/100

💡 KEY INSIGHTS
---------------
✅ Market Performance: Average 24h return: +12.34%
✅ Best Performing Token: TOKEN_HbiDw6U5 leading with +45.67%
ℹ️ Curves Near Completion: 8 tokens approaching completion
⚠️ High Risk Alert: 5 tokens showing high risk indicators

📈 CURVE PROGRESS DISTRIBUTION
------------------------------
0-25%: 12 tokens
25-50%: 8 tokens  
50-75%: 7 tokens
75-99%: 5 tokens
Complete: 13 tokens
```

## Advanced Analytics Features

- **Technical Indicators**: Volatility analysis, momentum calculations
- **Risk Assessment**: Multi-factor risk scoring for informed decisions
- **Market Timing**: Curve completion prediction models
- **Buyer Behavior**: Growth rate analysis and acquisition patterns
- **Performance Tracking**: Historical returns and trend analysis

## Integration Ideas

- **Discord/Telegram Bots**: Real-time market alerts and updates
- **Trading Automation**: Connect with trading bots for signal generation
- **Portfolio Optimization**: Risk-adjusted position sizing recommendations
- **Research Tools**: Export data for further analysis and backtesting

## Next Steps

- [📦 Back to SDK Overview](overview.md)
- [🤖 Try Bonding Curve Trading Bot](creator-token-bot.md)
- [📊 Portfolio Dashboard](portfolio-dashboard.md)
- [📖 Read the Usage Guide](usage.md)