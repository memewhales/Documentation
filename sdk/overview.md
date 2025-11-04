# 📦 SDK Overview

The Yoink SDK is the official TypeScript SDK for interacting with the Yoink bonding curve protocol on Solana. It provides developers with a comprehensive toolkit to buy, sell, and query tokens on custom bonding curves with built-in slippage protection.

## What is the Yoink SDK?

The Yoink SDK is a production-ready JavaScript/TypeScript library that allows developers to:

- **🔄 Buy & Sell Tokens**: Execute trades on custom bonding curves
- **💰 Price Quotes**: Get accurate quotes before trading
- **📊 Market Data**: Query bonding curve state and statistics
- **🛡️ Slippage Protection**: Built-in safeguards against price volatility
- **⚡ Priority Fees**: Support for transaction prioritization

## Key Features

### 🚀 Easy Integration
- Simple npm package installation: `npm install yoink-sdk`
- Full TypeScript support with detailed types
- Multi-platform support (Node.js and browser)

### 🔗 Blockchain Integration
- Built on Solana using Anchor framework
- Program ID: `HbiDw6U515iWwHQ4edjmceT24ST7akg7z5rhXRhBac4J`
- Supports both testnet (Eclipse) and mainnet

### 📊 Real-time Market Data
- Live bonding curve state tracking
- Market cap calculations in real-time
- Price per token with decimal precision
- Virtual and real reserve monitoring

### 🛡️ Security & Reliability
- Built-in slippage protection
- Comprehensive error handling
- Transaction success/failure tracking
- Type-safe API methods

## Architecture

The Yoink protocol uses a bonding curve mechanism where:

- **Virtual Reserves**: Used for price calculations
- **Real Reserves**: Actual tokens and SOL in the curve
- **Fee Structure**: Configurable basis points (e.g., 400 = 4%)
- **Complete State**: Tracks when bonding curves are finalized

## Use Cases

- **Trading Applications**: Build custom trading interfaces
- **Price Monitoring**: Track token prices and market caps
- **Portfolio Tools**: Monitor holdings and performance
- **Analytics Dashboards**: Display market statistics
- **Trading Bots**: Automate trading strategies with slippage protection

## Getting Started

Ready to start building? Check out our [Quick Start Guide](installation.md) to get up and running in minutes.