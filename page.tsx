"use client";

import { useState, useEffect, useCallback } from "react";
import { useSocketEvents } from "@/hooks/useSocketEvent";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Trophy, Lock, CheckCircle2, X, Info, Clock, Loader2 } from "lucide-react";
import { useProfilePicture } from "@/hooks/useProfilePicture";
import { useSocket } from "@/providers/SocketProvider";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { SolanaIcon } from "./SolanaIcon";
import { PublicKey } from "@solana/web3.js";
import { usePump } from "@/providers/PumpProvider";
import { getFormattedEarlyBirdInfo, formatSolPrecise } from "@/lib/fee-utils";
import { usePricing } from "@/providers/PricingProvider";
import { timeAgo } from "@/lib/utils";
import { getDefaultProfilePicture } from "@/lib/getDefaultProfilePicture";
import { EarlyBirdSeatAvatar } from "@/components/EarlyBirdSeatAvatar";
import { EarlyBirdLeaderboardAvatar } from "@/components/EarlyBirdLeaderboardAvatar";

interface EarlyBirdSeat {
  position: number;
  walletAddress: string | null;
  balance: number;
  firstBuyTimestamp?: string;
  lastUpdated?: string;
  isTaken: boolean;
  isDisqualified?: boolean; // Track if this seat was disqualified (paper hands)
  hasClaimed?: boolean;
  claimedAmount?: string;
  claimedAt?: string;
}

interface EarlyBirdsSeatsProps {
  coinAddress: string;
  userWallet?: string | null;
  tokenSymbol?: string;
  tokenImage?: string;
  isPendingBonding?: boolean;
}

export function EarlyBirdsSeats({ coinAddress, userWallet, tokenSymbol = "tokens", tokenImage, isPendingBonding: initialIsPendingBonding }: EarlyBirdsSeatsProps) {
  const [seats, setSeats] = useState<EarlyBirdSeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalBuyers, setTotalBuyers] = useState(0);
  const { socket } = useSocket();
  const { program, claimEarlyBirdRewards } = usePump();
  const { solanaPrice } = usePricing();
  const { toast } = useToast();
  const [earlyBirdPool, setEarlyBirdPool] = useState<string>("0.000000000");
  const [totalEarlyBirdFees, setTotalEarlyBirdFees] = useState<string>("0.000000000");
  const [isBonded, setIsBonded] = useState(false);
  const [isPendingBonding, setIsPendingBonding] = useState(initialIsPendingBonding || false);
  const [claiming, setClaiming] = useState(false);
  const [userHasClaimed, setUserHasClaimed] = useState(false);
  const [userClaimedAmount, setUserClaimedAmount] = useState<string | null>(null);
  const [userHasSeat, setUserHasSeat] = useState(false);
  // Store the pool balance at bonding time (before any claims)
  const [poolAtBonding, setPoolAtBonding] = useState<string | null>(null);

  const handleClaim = async () => {
    if (!coinAddress || claiming || !userWallet) return;
    
    try {
      setClaiming(true);
      console.log('[EarlyBirdsSeats] Claiming Early Bird rewards for:', coinAddress);
      
      const result = await claimEarlyBirdRewards(coinAddress);
      
      if (result.success) {
        console.log('[EarlyBirdsSeats] Successfully claimed rewards!');
        
        // Show success toast
        toast({
          title: "Rewards Claimed!",
          description: "Your Early Bird rewards have been successfully claimed.",
          variant: "success",
          className: "bg-green-950/50 border-green-500/30",
          duration: 6000,
          style: { color: '#4ade80' }
        });
        
        // Note: No need to refetch here - socket listener will handle the update
        // when backend emits earlyBirdClaimedEvent
      } else {
        console.error('[EarlyBirdsSeats] Failed to claim rewards:', result.error);
        
        // Check if user cancelled/rejected the transaction
        const isCancelled = result.error && 
          (result.error.includes('User rejected') || 
           result.error.includes('cancelled') ||
           result.error.includes('window closed') ||
           result.error.includes('Plugin Closed'));
        
        if (!isCancelled) {
          // Show error toast only if not cancelled
          toast({
            title: "Claim Failed",
            description: result.error || 'Failed to claim rewards',
            variant: "destructive",
            duration: 6000,
          });
          setError(result.error || 'Failed to claim rewards');
        }
      }
    } catch (err) {
      console.error('[EarlyBirdsSeats] Error claiming rewards:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while claiming rewards';
      
      // Check if user cancelled/rejected the transaction
      const isCancelled = errorMessage.includes('User rejected') || 
        errorMessage.includes('cancelled') ||
        errorMessage.includes('window closed') ||
        errorMessage.includes('Plugin Closed');
      
      if (!isCancelled) {
        // Show error toast only if not cancelled
        toast({
          title: "Claim Failed",
          description: errorMessage,
          variant: "destructive",
          duration: 6000,
        });
        setError(errorMessage);
      }
    } finally {
      setClaiming(false);
    }
  };

  const formatAddress = (address: string): string =>
    address ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}` : "";

  // Helper function to format numbers (humanize large numbers)
  const formatNumber = (num: number): string => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const fetchEarlyBirds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate coinAddress
      if (!coinAddress) {
        console.error("No coin address provided");
        setError("No coin address provided");
        setLoading(false);
        return;
      }

      console.log("Fetching early birds for coin:", coinAddress);

      // Fetch from backend API instead of blockchain
      const response = await fetch(`/api/early-birds/${coinAddress}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch early birds' }));
        throw new Error(errorData.message || 'Failed to fetch early birds');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch early birds');
      }

      console.log(`Found ${data.totalSeats} early bird positions`);
      console.log('[EarlyBirdsSeats] API response:', data.seats);

      // If pool at bonding is available from API, use it
      if (data.earlyBirdPoolAtBonding) {
        const poolInSol = data.earlyBirdPoolAtBonding / 1e9;
        const formattedPool = formatSolPrecise(data.earlyBirdPoolAtBonding);
        setPoolAtBonding(formattedPool);
        console.log('[EarlyBirdsSeats] Loaded pool at bonding from API:', formattedPool, 'SOL');
      }

      // Transform API response into seat data
      const allSeats: EarlyBirdSeat[] = Array.from({ length: 50 }, (_, i) => {
        const position = i + 1;
        const apiSeat = data.seats?.find((s: any) => s.position === position);

        if (apiSeat) {
          // Check if this seat is disqualified (paper hands penalty)
          if (apiSeat.isDisqualified) {
            return {
              position,
              walletAddress: apiSeat.walletAddress, // Keep the wallet address for display
              balance: 0,
              isTaken: false,
              isDisqualified: true, // Show red X overlay
            };
          }
          
          // Active seat with holder
          if (apiSeat.walletAddress) {
            const seat = {
              position,
              walletAddress: apiSeat.walletAddress,
              balance: apiSeat.balance || 0,
              firstBuyTimestamp: apiSeat.firstBuyTimestamp,
              lastUpdated: apiSeat.lastUpdated,
              isTaken: true,
              isDisqualified: false,
              hasClaimed: apiSeat.hasClaimed || false,
              claimedAmount: apiSeat.claimedAmount,
              claimedAt: apiSeat.claimedAt,
            };
            
            if (seat.hasClaimed) {
              console.log(`[EarlyBirdsSeats] Seat #${position} has claimed:`, {
                hasClaimed: seat.hasClaimed,
                claimedAmount: seat.claimedAmount,
                claimedAt: seat.claimedAt
              });
            }
            
            return seat;
          }
        }

        // Empty seat (available)
        return {
          position,
          walletAddress: null,
          balance: 0,
          isTaken: false,
          isDisqualified: false,
        };
      });

      setSeats(allSeats);
      
      // Check if current user has claimed
      if (userWallet) {
        const userSeat = allSeats.find(s => s.walletAddress === userWallet && !s.isDisqualified);
        setUserHasSeat(!!userSeat);
        setUserHasClaimed(userSeat?.hasClaimed || false);
        setUserClaimedAmount(userSeat?.claimedAmount || null);
        console.log('[EarlyBirdsSeats] User claim status:', {
          userWallet,
          hasSeat: !!userSeat,
          hasClaimed: userSeat?.hasClaimed || false,
          claimedAmount: userSeat?.claimedAmount
        });
      }
    } catch (err) {
      console.error("Error fetching early birds:", err);
      setError(err instanceof Error ? err.message : "Failed to load Early Bird seats");
    } finally {
      setLoading(false);
    }
  }, [coinAddress, userWallet]);

  // Fetch Early Bird pool data
  const fetchEarlyBirdPool = useCallback(async () => {
    try {
      if (!program || !coinAddress) return;
      
      const mint = new PublicKey(coinAddress);
      const earlyBirdInfo = await getFormattedEarlyBirdInfo(program, mint);
      
      setEarlyBirdPool(earlyBirdInfo.poolBalance);
      setTotalEarlyBirdFees(earlyBirdInfo.totalFeesAccrued);
    } catch (err) {
      console.error("Error fetching Early Bird pool:", err);
    }
  }, [program, coinAddress]);

  // Initial data fetch
  useEffect(() => {
    fetchEarlyBirds();
    fetchEarlyBirdPool();
  }, [fetchEarlyBirds, fetchEarlyBirdPool]);

  // Early bird update handlers with useCallback for stable references
  const handleEarlyBirdUpdate = useCallback((eventData: any) => {
    const data = Array.isArray(eventData) ? eventData[1].data : eventData.data;
    
    if (data?.mint !== coinAddress) return;
    
    setSeats(prev => prev.map(seat => {
      if (seat.position === data.position) {
        return {
          ...seat,
          position: data.position,
          walletAddress: data.walletAddress,
          balance: data.balance || 0,
          firstBuyTimestamp: data.firstBuyTimestamp,
          lastUpdated: data.lastUpdated,
          isTaken: !!data.walletAddress,
          isDisqualified: false,
        };
      }
      return seat;
    }));
  }, [coinAddress]);

  const handleEarlyBirdRemoved = useCallback((eventData: any) => {
    const data = Array.isArray(eventData) ? eventData[1].data : eventData.data;
    
    if (data?.mint !== coinAddress) return;
    
    setSeats(prev => prev.map(seat => {
      if (seat.position === data.position && seat.walletAddress === data.walletAddress) {
        return {
          ...seat,
          balance: 0,
          isTaken: false,
          isDisqualified: true,
        };
      }
      return seat;
    }));
  }, [coinAddress]);

  // Use socket events hook for early bird updates with automatic cleanup
  useSocketEvents(
    socket,
    {
      'earlyBirdUpdate': handleEarlyBirdUpdate,
      'earlyBirdRemoved': handleEarlyBirdRemoved,
    },
    [handleEarlyBirdUpdate, handleEarlyBirdRemoved]
  );

  // Trade and bonding event handlers with useCallback for stable references
  const handleTradeEvent = useCallback((eventData: any) => {
    const data = Array.isArray(eventData) ? eventData[1].data : eventData.data;
    
    if (data?.mint !== coinAddress) return;

    if (!isBonded && !isPendingBonding) {
      setEarlyBirdPool(formatSolPrecise((data.earlyBirdPool || 0) * 1e9));
      setTotalEarlyBirdFees(formatSolPrecise((data.totalEarlyBirdFeesAccrued || 0) * 1e9));
    }
    
    if (data.post?.isPendingBonding) {
      setIsPendingBonding(true);
    }
    
    if (data.post?.hasBonded) {
      setIsBonded(true);
      setIsPendingBonding(false);
    }
  }, [coinAddress, isBonded, isPendingBonding]);

  const handleCompleteEvent = useCallback((event: any) => {
    const data = event.data || event;
    
    let eventMintAddress;
    if (data.mint) {
      if (typeof data.mint === 'string') {
        eventMintAddress = data.mint;
      } else if (data.mint.toString) {
        eventMintAddress = data.mint.toString();
      } else if (data.mint._bn) {
        eventMintAddress = data.mint.toBase58?.() || data.mint.toString();
      }
    }
    
    if (eventMintAddress === coinAddress) {
      setIsPendingBonding(true);
      
      if (data.earlyBirdPool !== undefined) {
        const poolLamports = typeof data.earlyBirdPool === 'string' 
          ? parseInt(data.earlyBirdPool, 16) 
          : data.earlyBirdPool;
        const formattedPool = formatSolPrecise(poolLamports);
        setPoolAtBonding(formattedPool);
      } else {
        setPoolAtBonding(earlyBirdPool);
      }
      
      fetchEarlyBirdPool();
    }
  }, [coinAddress, earlyBirdPool, fetchEarlyBirdPool]);

  const handleCompletedBondEvent = useCallback((event: any) => {
    const data = event.data || event;
    
    let eventMintAddress;
    if (data.mint) {
      if (typeof data.mint === 'string') {
        eventMintAddress = data.mint;
      } else if (data.mint.toString) {
        eventMintAddress = data.mint.toString();
      } else if (data.mint._bn) {
        eventMintAddress = data.mint.toBase58?.() || data.mint.toString();
      }
    }
    
    if (eventMintAddress === coinAddress) {
      setIsBonded(true);
      setIsPendingBonding(false);
      
      if (data.post?.earlyBirdPoolAtBonding) {
        const formattedPool = formatSolPrecise(data.post.earlyBirdPoolAtBonding);
        setPoolAtBonding(formattedPool);
      } else if (!poolAtBonding) {
        setPoolAtBonding(earlyBirdPool);
      }
      
      fetchEarlyBirdPool();
    }
  }, [coinAddress, earlyBirdPool, poolAtBonding, fetchEarlyBirdPool]);

  const handleEarlyBirdClaimedEvent = useCallback((eventData: any) => {
    const data = Array.isArray(eventData) ? eventData[1].data : eventData.data;
    
    let eventMintAddress;
    if (data.mint) {
      if (typeof data.mint === 'string') {
        eventMintAddress = data.mint;
      } else if (data.mint.toString) {
        eventMintAddress = data.mint.toString();
      } else if (data.mint._bn) {
        eventMintAddress = data.mint.toBase58?.() || data.mint.toString();
      }
    }
    
    if (eventMintAddress === coinAddress) {
      let userAddress;
      if (data.user) {
        if (typeof data.user === 'string') {
          userAddress = data.user;
        } else if (data.user.toString) {
          userAddress = data.user.toString();
        } else if (data.user.toBase58) {
          userAddress = data.user.toBase58();
        }
      }
      
      if (userAddress) {
        setSeats(prevSeats => prevSeats.map(seat => {
          if (seat.walletAddress === userAddress) {
            return {
              ...seat,
              hasClaimed: true,
              claimedAmount: data.amount?.toString(),
              claimedAt: data.timestamp ? new Date(data.timestamp * 1000).toISOString() : new Date().toISOString()
            };
          }
          return seat;
        }));
        
        if (userAddress === userWallet) {
          setUserHasClaimed(true);
          setUserClaimedAmount(data.amount?.toString() || null);
        }
      }
    }
  }, [coinAddress, userWallet]);

  // Use socket events hook for trade and bonding events with automatic cleanup
  useSocketEvents(
    socket,
    {
      'tradeEvent': handleTradeEvent,
      'completeEvent': handleCompleteEvent,
      'completedBond': handleCompletedBondEvent,
      'earlyBirdClaimedEvent': handleEarlyBirdClaimedEvent,
    },
    [handleTradeEvent, handleCompleteEvent, handleCompletedBondEvent, handleEarlyBirdClaimedEvent]
  );

  const takenSeats = seats.filter((s) => s.isTaken).length;
  const disqualifiedSeats = seats.filter((s) => s.isDisqualified).length;
  const availableSeats = 50 - takenSeats - disqualifiedSeats;

  // Display pool: use the snapshot at bonding time during claiming phase, otherwise use current pool
  const displayPool = (isBonded || isPendingBonding) && poolAtBonding ? poolAtBonding : earlyBirdPool;

  // Calculate potential share per Early Bird if claiming now
  const calculatePotentialShare = () => {
    if (takenSeats === 0) return "0.000000000";
    const poolLamports = parseFloat(displayPool) * 1e9;
    const sharePerSeat = poolLamports / takenSeats;
    return formatSolPrecise(sharePerSeat);
  };

  const potentialShare = calculatePotentialShare();

  return (
    <TooltipProvider>
    <div className="space-y-4 px-1 sm:px-4">
      <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
          <span className="text-base sm:text-lg font-semibold">Early Bird Seats (First 50 Buyers)</span>
        </div>
        <div className="flex items-center gap-3 text-sm flex-wrap">
          <span className="text-green-500">
            <CheckCircle2 className="h-4 w-4 inline mr-1" />
            {takenSeats} Taken
          </span>
          {disqualifiedSeats > 0 && (
            <span className="text-red-500">
              <X className="h-4 w-4 inline mr-1" />
              {disqualifiedSeats} Disqualified
            </span>
          )}
          <span className="text-muted-foreground">
            <Lock className="h-4 w-4 inline mr-1" />
            {availableSeats} Available
          </span>
        </div>
      </CardTitle>

      {/* Info Section: How it works + Pool data */}
      <div className="px-2 py-3 space-y-2">
        <p className="text-sm text-muted-foreground leading-relaxed">
          First 50 buyers share 2% of all trading fees equally when curve completes.
        </p>
        <p className="text-sm text-red-400 font-semibold leading-relaxed">
          Selling = permanent disqualification.
        </p>
        
        {/* Show info during claiming phase that pool amount is locked */}
        {(isBonded || isPendingBonding) && poolAtBonding && (
          <p className="text-sm text-amber-400 leading-relaxed flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            Pool frozen at bonding completion - total rewards locked in!
          </p>
        )}

        {/* Pool Stats - Left aligned */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 text-sm pt-1">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs">
                {(isBonded || isPendingBonding) ? 'Total Bird Pool (at bonding):' : 'Total Bird Pool:'}
              </span>
              <span className="font-bold inline-flex items-center gap-1">
                <SolanaIcon size="sm" />
                <span className="text-foreground">{displayPool}</span>
                {solanaPrice?.solana?.usd && (
                  <span className="text-muted-foreground text-xs">
                    (${(parseFloat(displayPool) * solanaPrice.solana.usd).toFixed(2)})
                  </span>
                )}
              </span>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs">Per Seat:</span>
              <span className="font-bold text-accent inline-flex items-center gap-1">
                <SolanaIcon size="sm" />
                <span>{potentialShare}</span>
                {solanaPrice?.solana?.usd && (
                  <span className="text-muted-foreground text-xs">
                    (${(parseFloat(potentialShare) * solanaPrice.solana.usd).toFixed(2)})
                  </span>
                )}
              </span>
            </div>
          </div>
          {!isBonded && !isPendingBonding && userHasSeat && (
            <div className="text-amber-500 font-semibold flex items-center gap-1.5">
              ⏳ Claim after bonding
            </div>
          )}
          {(isPendingBonding || isBonded) && userWallet && userHasSeat && !userHasClaimed && (
            <button
              onClick={handleClaim}
              disabled={claiming}
              className="flex justify-center items-center gap-1.5 h-9 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 disabled:cursor-not-allowed bg-secondary/40 backdrop-blur-sm border border-border/60 text-foreground hover:bg-secondary/60 hover:text-neon-green hover:border-neon-green disabled:opacity-50 disabled:hover:bg-secondary/40 disabled:hover:text-foreground disabled:hover:border-border/60 dark:bg-black/40 dark:border-white/5 dark:text-foreground/80 dark:hover:bg-black/60 dark:hover:text-neon-green dark:hover:border-neon-green"
            >
              {claiming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Claiming...
                </>
              ) : (
                <>
                  <Trophy className="h-4 w-4" />
                  Claim Your Rewards
                </>
              )}
            </button>
          )}
          {(isPendingBonding || isBonded) && userWallet && userHasClaimed && (
            <Card className="border-neon-green/60 dark:border-neon-green/30">
              <div className="flex justify-center items-center gap-1.5 h-9 px-4 py-2 font-medium text-sm text-white">
                <CheckCircle2 className="h-4 w-4 text-neon-green" />
                Rewards Claimed!
                {userClaimedAmount && (
                  <>
                    <span className="mx-1">·</span>
                    <span className="font-bold flex items-center gap-1">
                      {(parseFloat(userClaimedAmount) / 1e9).toFixed(2)}
                      <SolanaIcon size="xs" />
                    </span>
                  </>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      <CardContent className="p-0">
        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <svg className="animate-spin h-8 w-8 text-accent mx-auto mb-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <p className="text-sm text-muted-foreground">Loading Early Birds...</p>
            </div>
          </div>
        ) : error ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3">
            {seats.map((seat) => {
              const isUserSeat = userWallet && seat.walletAddress === userWallet;
              
              // Build tooltip content with state-specific info
              const tooltipContent = (seat.isTaken || seat.isDisqualified) ? (
                <div className="space-y-0.5 text-xs">
                  {/* Header with position and status badges */}
                  <div className="flex items-center gap-2 pb-0.5 border-b border-border/50">
                    <div className="font-bold">Seat #{seat.position}</div>
                    {isUserSeat && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-violet-500 text-white rounded font-bold">YOU</span>
                    )}
                    {seat.hasClaimed && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-neon-green text-black rounded font-bold">CLAIMED</span>
                    )}
                    {seat.isDisqualified && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-red-500 text-white rounded font-bold">DISQUALIFIED</span>
                    )}
                  </div>
                  
                  {/* Wallet Address */}
                  {seat.walletAddress && (
                    <div className="space-y-0">
                      <div className="text-[10px] text-muted-foreground">Wallet:</div>
                      <Link href={`/profile/${seat.walletAddress}`} className="font-mono text-[9px] leading-tight hover:underline hover:text-accent">
                        {seat.walletAddress.substring(0, 5)}...
                      </Link>
                    </div>
                  )}
                  
                  {/* Balance */}
                  {seat.balance > 0 && !seat.isDisqualified && (
                    <div className="space-y-0">
                      <div className="text-[10px] text-muted-foreground">Balance:</div>
                      <div className="font-semibold">{formatNumber(seat.balance)} tokens</div>
                    </div>
                  )}
                  
                  {/* Joined Date */}
                  {seat.firstBuyTimestamp && (
                    <div className="space-y-0">
                      <div className="text-[10px] text-muted-foreground">Joined:</div>
                      <div>{timeAgo(seat.firstBuyTimestamp)}</div>
                    </div>
                  )}
                  
                  {/* Claimed Info */}
                  {seat.hasClaimed && seat.claimedAmount && (
                    <div className="space-y-0 pt-0.5 border-t border-neon-green/30">
                      <div className="text-[10px] text-neon-green">Rewards Claimed:</div>
                      <div className="text-neon-green font-bold text-sm flex items-center gap-1">
                        {(parseFloat(seat.claimedAmount) / 1e9).toFixed(4)}
                        <SolanaIcon size="xs" />
                      </div>
                      {seat.claimedAt && (
                        <div className="text-[10px] text-neon-green/70">
                          {timeAgo(seat.claimedAt)}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Disqualified Info */}
                  {seat.isDisqualified && (
                    <div className="space-y-0 pt-0.5 border-t border-red-500/30">
                      <div className="text-red-400 font-semibold">❌ Disqualified</div>
                      <div className="text-[10px] text-red-400/70">Paper Hands Penalty - Sold tokens</div>
                      {seat.lastUpdated && (
                        <div className="text-[10px] text-red-400/50">
                          {timeAgo(seat.lastUpdated)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs space-y-1">
                  <div className="font-bold">Seat #{seat.position}</div>
                  {(isBonded || isPendingBonding) ? (
                    <>
                      <div className="text-muted-foreground">🔒 Seat Closed</div>
                      <div className="text-[10px] text-muted-foreground/70">Bonding completed - No longer available</div>
                    </>
                  ) : (
                    <>
                      <div className="text-muted-foreground">🔓 Available</div>
                      <div className="text-[10px] text-muted-foreground/70">Be one of the first 50 buyers!</div>
                    </>
                  )}
                </div>
              );
              
              return (
                <Tooltip key={seat.position}>
                  <TooltipTrigger asChild>
                <div
                  className={`
                    relative aspect-square rounded-lg border-2 transition-all duration-300 ease-out
                    hover:scale-105 hover:-translate-y-1 hover:shadow-xl
                    ${seat.isTaken 
                      ? seat.hasClaimed
                        ? 'bg-neon-green/20 border-neon-green shadow-lg shadow-neon-green/50 hover:shadow-neon-green/70'
                        : isUserSeat
                          ? 'bg-violet-500/20 border-violet-400 shadow-lg shadow-violet-500/50 hover:shadow-violet-500/70'
                          : 'bg-accent/20 border-accent shadow-lg shadow-accent/50 hover:shadow-accent/70'
                      : seat.isDisqualified
                        ? 'bg-red-900/20 border-red-500/30 hover:shadow-red-500/40'
                        : 'bg-secondary/20 border-border/30 hover:shadow-secondary/40'
                    }
                  `}
                >
                  {seat.isTaken ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-1">
                      {/* Seat number badge in top left corner */}
                      <div className={`absolute top-0 left-0 ${seat.hasClaimed ? 'bg-neon-green/80 text-black' : isUserSeat ? 'bg-violet-500/80' : 'bg-accent/80'} text-background text-[8px] px-1 rounded-br-md rounded-tl-md font-bold z-10`}>
                        #{seat.position}
                      </div>
                      
                      {/* User badge in top right corner */}
                      {isUserSeat && (
                        <div className="absolute top-0 right-0 bg-violet-500 text-white text-[8px] px-1 rounded-bl-md rounded-tr-md font-bold">
                          YOU
                        </div>
                      )}
                      
                      {/* Memish neon green checkmark for claimed seats */}
                      {seat.hasClaimed && (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg"
                          className="absolute inset-0 w-full h-full pointer-events-none z-30" 
                          viewBox="0 0 140 100"
                          role="img"
                        >
                          <title>Memish neon green checkmark</title>

                          {/* faint glow / shadow */}
                          <path d="M20 60 
                                   L50 85 
                                   L120 20"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="16"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity="0.2"/>

                          {/* main neon check */}
                          <path d="M20 60 
                                   L50 85 
                                   L120 20"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="12"
                                strokeLinecap="round"
                                strokeLinejoin="round"/>

                          {/* hand-drawn wobble */}
                          <path d="M19 61 L51 84 L119 21"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity="0.8"/>
                        </svg>
                      )}
                      
                      {/* Profile picture - clickable */}
                      <EarlyBirdSeatAvatar
                        walletAddress={seat.walletAddress!}
                        position={seat.position}
                        hasClaimed={seat.hasClaimed}
                      />
                      
                      {/* Wallet address - first 5 characters - clickable */}
                      <Link 
                        href={`/profile/${seat.walletAddress}`}
                        className={`text-[8px] sm:text-[9px] font-mono ${seat.hasClaimed ? 'text-neon-green' : isUserSeat ? 'text-violet-400/90' : 'text-accent/70'} hover:underline z-20`}
                      >
                        {seat.walletAddress!.substring(0, 5)}
                      </Link>
                    </div>
                  ) : seat.isDisqualified ? (
                    // Disqualified seat - show hand-drawn X overlay with user info preserved
                    <div className="w-full h-full flex flex-col items-center justify-center p-1 relative">
                      {/* Seat number in top left corner */}
                      <div className="absolute top-0 left-0 bg-red-900/80 text-red-200 text-[8px] px-1 rounded-br-md rounded-tl-md font-bold z-10">
                        #{seat.position}
                      </div>
                      
                      {/* User badge in top right corner (if it's the user's disqualified seat) */}
                      {isUserSeat && (
                        <div className="absolute top-0 right-0 bg-red-600 text-white text-[8px] px-1 rounded-bl-md rounded-tr-md font-bold z-10">
                          YOU
                        </div>
                      )}
                      
                      {/* User profile picture (grayed out) - clickable */}
                      {seat.walletAddress ? (
                        <EarlyBirdSeatAvatar
                          walletAddress={seat.walletAddress}
                          position={seat.position}
                          isDisqualified={true}
                        />
                      ) : (
                        <img
                          src={getDefaultProfilePicture(String(seat.position))}
                          alt={`Disqualified Seat ${seat.position}`}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-red-500/30 mb-1 opacity-30 grayscale"
                        />
                      )}
                      
                      {/* Wallet address - first 5 characters - clickable */}
                      {seat.walletAddress ? (
                        <Link 
                          href={`/profile/${seat.walletAddress}`}
                          className="text-[8px] sm:text-[9px] font-mono text-red-500/50 hover:text-red-500/70 hover:underline z-20"
                        >
                          {seat.walletAddress.substring(0, 5)}
                        </Link>
                      ) : (
                        <div className="text-[8px] sm:text-[9px] font-mono text-red-500/50">
                          -----
                        </div>
                      )}
                      
                      {/* Human hand-drawn red cross */}
                      <svg 
                        className="absolute inset-0 w-full h-full pointer-events-none" 
                        viewBox="0 0 120 120"
                      >
                        <defs>
                          <filter id="rough" x="-30%" y="-30%" width="160%" height="160%">
                            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="3" seed="22" result="noise"/>
                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" xChannelSelector="R" yChannelSelector="G"/>
                          </filter>
                        </defs>

                        {/* slightly irregular, hand-like lines */}
                        <path 
                          d="M 28 28 C 38 36, 46 44, 56 54 C 66 62, 72 70, 86 84 C 88 86, 92 88, 94 92"
                          fill="none"
                          stroke="#d62828"
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          filter="url(#rough)"
                          opacity="0.96"
                        />
                        <path 
                          d="M 94 26 C 84 36, 74 46, 62 60 C 54 68, 44 78, 30 92 C 28 94, 26 96, 26 98"
                          fill="none"
                          stroke="#d62828"
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          filter="url(#rough)"
                          opacity="0.96"
                        />

                        {/* subtle dot imperfections to mimic a pen touch */}
                        <circle cx="31" cy="27" r="1.3" fill="#d62828" opacity="0.9"/>
                        <circle cx="94" cy="26" r="1.1" fill="#d62828" opacity="0.9"/>
                        <circle cx="88" cy="88" r="1.2" fill="#d62828" opacity="0.8"/>
                        <circle cx="29" cy="94" r="1.2" fill="#d62828" opacity="0.8"/>
                      </svg>
                    </div>
                  ) : (
                    // Available seat
                    <div className="w-full h-full flex flex-col items-center justify-center p-1">
                      <Lock className="h-4 w-4 sm:h-6 sm:w-6 text-muted-foreground/40 mb-1" />
                      <div className="text-[8px] sm:text-[10px] font-medium text-muted-foreground/60">#{seat.position}</div>
                    </div>
                  )}
                </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    {tooltipContent}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mt-6 p-4 bg-secondary/20 rounded-lg">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                Early Bird Details
              </h4>
              <div className="space-y-3">
                {seats
                  .filter((s) => s.isTaken)
                  .map((seat) => {
                    const isUserSeat = userWallet && seat.walletAddress === userWallet;
                    
                    return (
                      <div
                        key={seat.position}
                        className={`flex items-center justify-between p-2 sm:p-3 rounded-lg ${
                          isUserSeat ? 'bg-accent/10 border border-accent/30' : 'bg-secondary/30'
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/20 text-accent font-bold text-xs sm:text-sm">
                            #{seat.position}
                          </div>
                          <EarlyBirdLeaderboardAvatar
                            walletAddress={seat.walletAddress!}
                            position={seat.position}
                          />
                          <div className="flex flex-col">
                            <Link 
                              href={`/profile/${seat.walletAddress}`}
                              className="font-mono text-xs sm:text-sm font-medium hover:text-accent transition-colors"
                            >
                              {formatAddress(seat.walletAddress!)}
                              {isUserSeat && (
                                <span className="ml-2 text-[10px] bg-accent text-background px-2 py-0.5 rounded-full font-bold">
                                  YOU
                                </span>
                              )}
                            </Link>
                            <a
                              href={`https://solscan.io/account/${seat.walletAddress}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-muted-foreground hover:text-accent flex items-center gap-1"
                            >
                              <svg width="12" height="12" viewBox="0 0 316 315" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_15320_6385)">
                                  <path d="M157.501 -0.375009C158.243 -0.3738 158.986 -0.372592 159.751 -0.371347C200.901 -0.19058 238.327 15.5969 268.001 44C268.795 44.7309 269.589 45.4618 270.407 46.2148C299.639 74.0132 314.085 114.372 316.001 154C316.043 154.866 316.086 155.732 316.129 156.625C317.036 195.299 303.157 231.777 277.001 260C272.034 255.884 267.588 251.579 263.251 246.812C258.943 242.131 254.59 237.533 250.063 233.062C245.827 228.877 241.829 224.56 238.001 220C239.494 215.902 241.505 212.358 243.751 208.625C258.049 184.089 261.052 157.294 253.876 130C247.036 105.774 231.076 84.526 209.251 71.875C185.025 58.3674 158.112 53.5756 131.001 61C105.763 68.7927 83.7433 84.5134 70.9019 108.01C58.1815 132.403 54.1314 159.243 62.1256 185.875C70.2872 211.566 87.1832 233.11 111.001 246C136.273 258.52 161.194 259.401 188.125 252.452C190.247 251.941 192.193 251.796 194.376 251.75C195.47 251.711 195.47 251.711 196.587 251.672C203.77 252.648 208.21 257.811 213.024 262.73C213.77 263.481 214.516 264.231 215.285 265.004C217.656 267.392 220.016 269.789 222.376 272.188C223.986 273.813 225.596 275.437 227.208 277.061C231.147 281.033 235.077 285.013 239.001 289C237.172 293.096 234.662 294.969 230.938 297.312C230.016 297.897 230.016 297.897 229.075 298.493C208.561 311.04 185.304 315.442 161.563 315.375C160.771 315.374 159.978 315.373 159.162 315.371C119.658 315.208 81.7949 301.088 52.0006 275C51.1511 274.283 50.3016 273.567 49.4264 272.828C43.1832 267.436 38.0125 261.54 33.0006 255C32.3212 254.125 31.6419 253.249 30.942 252.348C14.9048 231.058 4.95175 206.294 1.00058 180C0.816245 178.802 0.631909 177.605 0.441987 176.371C-4.60214 134.33 7.93634 92.1714 33.7896 58.9648C59.598 26.653 96.2021 6.05584 137.122 0.414542C143.913 -0.311258 150.679 -0.395715 157.501 -0.375009Z" fill="#00E8B5" />
                                  <path d="M197.996 108.172C209.455 118.008 217.931 131.94 220 147C221.423 167.213 218.076 184.808 204.625 200.5C192.888 212.619 177.288 219.847 160.402 220.354C142.737 220.513 127.002 215.572 114.062 203.26C101.611 190.821 95.117 175.085 94.625 157.5C95.1486 140.845 100.967 125.086 112.727 113.105C137.096 90.5362 171.111 88.6825 197.996 108.172Z" fill="#C74AE3" />
                                </g>
                              </svg>
                              View on Solscan
                            </a>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1 text-xs sm:text-sm font-semibold">
                            {tokenImage && (
                              <img 
                                src={tokenImage} 
                                alt={tokenSymbol}
                                className="w-4 h-4 rounded-full"
                              />
                            )}
                            {formatNumber(seat.balance)} <span className="text-accent">{tokenSymbol}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                
                {takenSeats === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                    <p>No Early Birds yet! Be among the first 50 buyers to earn rewards!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Disqualification Warning */}
            {disqualifiedSeats > 0 && (
              <div className="mt-4 p-4 bg-red-900/10 border border-red-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-500 mb-1">
                      Paper Hands Penalty
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {disqualifiedSeats} seat{disqualifiedSeats > 1 ? 's were' : ' was'} disqualified. 
                      Early Birds who sell their tokens lose their seat permanently and cannot reclaim it. 
                      Hold your tokens to keep earning rewards! 💎🙌
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </div>
    </TooltipProvider>
  );
}
