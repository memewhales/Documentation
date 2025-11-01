---
icon: wrench
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

# Troubleshooting

Common issues and solutions for using the Yoink platform.

## Connection Issues

### Wallet Won't Connect

**Symptoms**: Wallet popup doesn't appear or connection fails

**Solutions**:

1. **Check wallet extension**
   * Ensure wallet is installed
   * Update to latest version
   * Make sure wallet is unlocked
   
2. **Browser issues**
   * Disable pop-up blocker for yoink.now
   * Clear browser cache and cookies
   * Try incognito/private mode
   * Try different browser
   
3. **Network selection**
   * Verify wallet is on Solana network
   * Not Ethereum or other chains
   
4. **Permissions**
   * Check wallet hasn't blocked yoink.now
   * Revoke and reconnect
   * Grant necessary permissions

### WebSocket Not Connecting

**Symptoms**: 🔴 Red dot, "Disconnected", delayed updates

**Solutions**:

1. **Refresh page** - Simplest fix
2. **Check firewall** - Whitelist yoink.now
3. **Disable VPN** - May block WebSocket
4. **Try different network** - Switch to mobile hotspot
5. **Browser extensions** - Disable ad blockers temporarily

### Slow Loading

**Symptoms**: Pages load slowly, images delayed

**Solutions**:

* Clear browser cache
* Check internet speed
* Close unnecessary tabs
* Restart browser
* Try CDN-based loading

## Transaction Issues

### Transaction Failed

**Error**: "Transaction failed" or "Simulation failed"

**Common Causes & Fixes**:

1. **Insufficient SOL**
   * Need SOL for both trade AND gas
   * Add 0.01-0.1 SOL extra for fees
   
2. **Slippage exceeded**
   * Increase slippage tolerance
   * Try smaller trade size
   * Wait for price stability
   
3. **Network congestion**
   * Wait a few minutes
   * Use priority fee
   * Try during off-peak hours
   
4. **Stale blockhash**
   * Refresh page
   * Retry transaction

### Pending Transaction Stuck

**Symptoms**: Transaction shows pending for >5 minutes

**Solutions**:

1. **Check on Solscan**
   * Copy transaction hash
   * View on solscan.io
   * See actual status
   
2. **If truly stuck**
   * Don't retry immediately
   * Wait 10 minutes
   * Refresh page
   * Try transaction again
   
3. **Contact support** if stuck >1 hour

### Wrong Amount Received

**Symptoms**: Received fewer tokens than expected

**Check**:

* Price impact - large trades move price
* Slippage - actual vs expected price
* Fees - 5% trading fee applied
* Gas - small network fee

**If still wrong**:
* Screenshot transaction
* Note expected vs actual
* Contact support with TX hash

## Trading Issues

### Can't Buy/Sell

**Buy button disabled**:
* Check you have enough SOL
* Verify wallet is connected
* Ensure token exists
* Refresh page

**Sell button disabled**:
* Verify you own the tokens
* Check token balance > 0
* Ensure wallet connected
* May be network issue

### Price Looks Wrong

**If price seems incorrect**:

1. **Check timeframe** - May be looking at wrong period
2. **Refresh chart** - May be cached data
3. **Check connection** - Socket may be disconnected (🔴)
4. **Compare Raydium** - For graduated tokens
5. **Market volatility** - Rapid price changes normal

### High Price Impact

**Why it happens**:
* Large trade relative to liquidity
* Bonding curve steepness
* Current token supply

**Solutions**:
* Split into smaller trades
* Wait for more liquidity
* Accept higher slippage
* DCA over time

## Account Issues

### Can't Verify Account

**Common problems**:

1. **Twitch won't connect**
   * Check pop-ups enabled
   * Clear cookies
   * Disconnect any old connections
   * Try different browser
   
2. **Verification pending long time**
   * Check email for requests
   * Check spam folder
   * Wait up to 24 hours
   * Contact support if >24h
   
3. **Verification rejected**
   * Read rejection reason
   * Fix issues noted
   * Wait 30 days
   * Reapply

### Lost Access to Wallet

**CRITICAL**: We cannot recover wallets

**If you have seed phrase**:
* Import to new wallet app
* Access restored

**If you lost seed phrase**:
* Funds are lost forever
* No recovery possible
* Always backup seed phrase!

### Profile Not Updating

**Solutions**:
* Clear cache
* Hard refresh (Ctrl+Shift+R)
* Log out and log back in
* Try different device
* Contact support if persists

## Chart & Display Issues

### Charts Not Loading

**Fixes**:

1. **Clear cache**
2. **Disable extensions** (especially ad blockers)
3. **Check JavaScript enabled**
4. **Try different browser**
5. **Check TradingView status** (status.tradingview.com)

### Missing Data

**If stats show 0 or blank**:

* Refresh page
* Check socket connection (🟢)
* Clear cache
* Wait a few moments for sync
* Report if persists >5 minutes

### Mobile Display Issues

**If layout broken on mobile**:

* Rotate device
* Refresh page
* Update browser app
* Try desktop mode
* Use native app (when available)

## Rewards & Earnings

### Rewards Not Showing

**Creator/Early Bird rewards missing**:

1. **Check you're eligible**
   * Creator: Token must have trading
   * Early Bird: Must not have sold
   
2. **Wait for accumulation**
   * Rewards accumulate over time
   * May take trades to generate
   
3. **Check correct token**
   * Multiple tokens? Check right one
   
4. **Check wallet address**
   * Ensure correct wallet connected

### Can't Claim Rewards

**If claim button disabled**:

* May be no rewards accumulated yet
* Check minimum claim amount
* Ensure wallet connected
* Verify gas SOL available
* Refresh page

**If transaction fails**:
* Add SOL for gas (~0.01)
* Increase gas fees
* Try again in a few minutes

### Early Bird Status Lost

**If you lost Early Bird status**:

**Did you sell?**
* Even partial sell = forfeit
* This is permanent
* No way to recover

**If you didn't sell**:
* Check transaction history
* May be display error
* Contact support with details

## Search & Discovery

### Can't Find Token

**If searching fails**:

1. **Try different terms**
   * Token symbol
   * Creator name
   * Token address
   
2. **Check spelling**
3. **Browse all tokens**
4. **Check token actually exists**
   * View on Solscan
   * Verify creator

### Empty Results

**If no tokens showing**:

* Clear filters
* Refresh page
* Check internet connection
* Try different category
* Report bug if persistent

## Performance Issues

### High CPU Usage

**Browser getting slow**:

* Close unused tabs
* Disable auto-refresh on charts
* Use fewer indicators
* Clear cache
* Restart browser

### Memory Leaks

**If page gets slower over time**:

* Refresh page periodically
* Close and reopen tab
* Clear browser data
* Use fewer simultaneous charts

## Error Messages

### "Insufficient Funds"

**Meaning**: Not enough SOL in wallet

**Fix**: 
* Add SOL to wallet
* Reduce trade amount
* Account for fees (trading + gas)

### "Slippage Tolerance Exceeded"

**Meaning**: Price moved beyond your tolerance

**Fix**:
* Increase slippage (3-10%)
* Try smaller amount
* Wait for stability

### "Transaction Timeout"

**Meaning**: Transaction took too long

**Fix**:
* Retry transaction
* Use higher priority fee
* Check network status

### "Invalid Signature"

**Meaning**: Wallet signature failed

**Fix**:
* Unlock wallet
* Reconnect wallet
* Approve transaction
* Check wallet app updated

### "Network Error"

**Meaning**: Connection to blockchain failed

**Fix**:
* Check internet
* Wait for network recovery
* Try different RPC endpoint
* Check Solana status (status.solana.com)

## Browser-Specific Issues

### Chrome/Edge

* Update to latest version
* Disable conflicting extensions
* Clear site data
* Reset browser settings

### Firefox

* Check Enhanced Tracking Protection
* Allow yoink.now in exceptions
* Disable strict mode
* Clear cookies

### Safari

* Enable JavaScript
* Allow cross-site tracking for yoink.now
* Clear website data
* Try private window

### Brave

* Disable Shields for yoink.now
* Allow all cookies
* Enable JavaScript
* Check wallet extension compatibility

## Mobile Issues

### App-Like Experience

**Add to homescreen** (Mobile Web):

**iOS**:
1. Safari → Share → Add to Home Screen

**Android**:
1. Chrome → Menu → Add to Home screen

### Touch Issues

**If buttons don't work**:
* Ensure zoom is normal
* Clear mobile browser cache
* Try desktop mode
* Update browser app

## Security Concerns

### Suspicious Activity

**If you see unauthorized transactions**:

1. **Disconnect wallet immediately**
2. **Revoke permissions** (revoke.cash)
3. **Transfer funds** to new wallet
4. **Report to support**
5. **Never share seed phrase**

### Phishing Warnings

**Always verify**:
* URL is exactly "yoink.now"
* HTTPS padlock present
* Wallet popup is authentic
* No typos in domain

**Never**:
* Share seed phrase
* Share private keys
* Click suspicious links
* Connect to fake sites

## Getting More Help

### Before Contacting Support

**Gather information**:
* Screenshot of error
* Transaction hash (if applicable)
* Steps to reproduce
* Browser and wallet used
* Already tried solutions

### Contact Channels

**Fastest to Slowest**:

1. **Discord** - #support channel (fastest)
2. **Twitter** - DM @YoinkPlatform
3. **Email** - support@yoink.now
4. **In-app** - Help button

### Emergency Support

**For critical issues**:
* Lost funds
* Security breaches
* Platform down
* Critical bugs

**Use**: Discord @mods or emergency@yoink.now

## Prevention Tips

**Avoid issues by**:

* ✅ Keep browser updated
* ✅ Backup seed phrase safely
* ✅ Use strong passwords
* ✅ Keep reasonable SOL for gas
* ✅ Double-check transactions
* ✅ Start with small trades
* ✅ Read error messages carefully
* ✅ Stay informed (Discord/Twitter)

## Next Steps

<table data-view="cards"><thead><tr><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>FAQ</strong></td><td>Common questions answered</td><td><a href="faq.md">faq.md</a></td></tr><tr><td><strong>Contact Support</strong></td><td>Get personalized help</td><td><a href="contact.md">contact.md</a></td></tr><tr><td><strong>Quickstart Guide</strong></td><td>Learn the basics</td><td><a href="../getting-started/quickstart.md">quickstart.md</a></td></tr></tbody></table>
