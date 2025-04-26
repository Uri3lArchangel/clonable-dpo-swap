'use client'
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

/**
 * DPO Token Swap Interface
 * 
 * This component provides a UI for swapping digital asset securities on the DPO Global ecosystem.
 * It connects to Arbitrum network and interacts with the DPO swap router.
 * 
 * Features:
 * - Supports all DPO-compatible tokens on Arbitrum
 * - Automatic token approval flow
 * - Network detection and switching
 * - Real-time price quotes
 * - Slippage tolerance settings
 */

interface Token {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  logoURI: string;
}

interface QuoteResponse {
  toAmount: string;
  error?: string;
}

interface ApproveResponse {
  success: boolean;
  error?: string;
}

interface SwapResponse {
  transactionHash: string;
  error?: string;
}

const API_BASE_URL = 'https://api.dpo-global.com/swap';
const ARBITRUM_RPC_URL = 'https://arb1.arbitrum.io/rpc';

const ARBITRUM_TOKENS: Token[] = [
  {
    "address": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    "symbol": "USDC",
    "decimals": 6,
    "name": "USD Coin (Arb1)",
    "logoURI": "https://assets.coingecko.com/coins/images/6319/standard/USD_Coin_icon.png?1696506509"
  },
  {
    "address": "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    "symbol": "USDT",
    "decimals": 6,
    "name": "Tether USD",
    "logoURI": "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661"
  },
  {
    "address": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    "symbol": "WETH",
    "decimals": 18,
    "name": "Wrapped Ether",
    "logoURI": "https://assets.coingecko.com/coins/images/2518/standard/weth.png?1696503332"
  },
  {
    "address": "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    "symbol": "WBTC",
    "decimals": 8,
    "name": "Wrapped BTC",
    "logoURI": "https://assets.coingecko.com/coins/images/7598/standard/wrapped_bitcoin_wbtc.png?1696507857"
  },
  {
    "address": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    "symbol": "DAI",
    "decimals": 18,
    "name": "Dai Stablecoin",
    "logoURI": "https://assets.coingecko.com/coins/images/9956/standard/Badge_Dai.png?1696509996"
  },
  {
    "address": "0x912CE59144191C1204E64559FE8253a0e49E6548",
    "symbol": "ARB",
    "decimals": 18,
    "name": "Arbitrum",
    "logoURI": "https://assets.coingecko.com/coins/images/16547/standard/photo_2023-03-29_21.47.00.jpeg?1696516109"
  },
  {
    "address": "0x539bdE0d7Dbd336b79148AA742883198BBF60342",
    "symbol": "MAGIC",
    "decimals": 18,
    "name": "MAGIC",
    "logoURI": "https://assets.coingecko.com/coins/images/18623/standard/magic.png?1696517590"
  },
  {
    "address": "0x6694340fc020c5E6B96567843da2df01b2CE1eb6",
    "symbol": "STG",
    "decimals": 18,
    "name": "Stargate Finance",
    "logoURI": "https://assets.coingecko.com/coins/images/24413/standard/STG_LOGO.png?1696523563"
  },
  {
    "address": "0x354A6dA3fcde098F8389cad84b0182725c6C91dE",
    "symbol": "COMP",
    "decimals": 18,
    "name": "Compound",
    "logoURI": "https://assets.coingecko.com/coins/images/10775/standard/COMP.png?1696510402"
  },
  {
    "address": "0x11cDb42B0EB46D95f990BeDD4695A6e3fA034978",
    "symbol": "CRV",
    "decimals": 18,
    "name": "Curve DAO Token",
    "logoURI": "https://assets.coingecko.com/coins/images/12124/standard/Curve.png?1696511627"
  }
];
const SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
const ARBITRUM_CHAIN_ID = 42161;

const DpoTokenSwap = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [fromToken, setFromToken] = useState<Token>(ARBITRUM_TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(ARBITRUM_TOKENS.find(token => token.symbol === 'USDC') || ARBITRUM_TOKENS[1]);
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [slippage, setSlippage] = useState<string>('0.5');
  const [fromBalance, setFromBalance] = useState<string>('0');
  const [toBalance, setToBalance] = useState<string>('0');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'error' | 'success' | 'info'>('info');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wrongNetwork, setWrongNetwork] = useState<boolean>(false);

  // Initialize Web3 and check connection
  useEffect(() => {
    if (window.ethereum) {
      const initWeb3 = async () => {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          
          const accs = await web3Instance.eth.getAccounts();
          if (accs.length > 0) {
            setAccounts(accs as string[]);
            checkNetwork();
            updateBalances();
          }
        } catch (error) {
          showMessage('Error initializing Web3: ' + (error as Error).message, 'error');
        }
      };
      
      initWeb3();
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
        setAccounts(newAccounts);
        updateBalances();
        getQuote();
      });
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  // Check and handle network
  const checkNetwork = async (): Promise<boolean> => {
    if (!web3 || !accounts[0]) return false;
    
    try {
      const chainId = await web3.eth.getChainId();
      if (Number(chainId) !== ARBITRUM_CHAIN_ID) {
        setWrongNetwork(true);
        return false;
      }
      setWrongNetwork(false);
      return true;
    } catch (error) {
      console.error('Error checking network:', error);
      return false;
    }
  };

  // Switch to Arbitrum network
  const switchToArbitrum = async () => {
    if (!window.ethereum) {
      showMessage('MetaMask is not installed', 'error');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3?.utils.toHex(ARBITRUM_CHAIN_ID) }],
      });
      setWrongNetwork(false);
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: web3?.utils.toHex(ARBITRUM_CHAIN_ID),
              chainName: 'Arbitrum One',
              nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: [ARBITRUM_RPC_URL],
              blockExplorerUrls: ['https://arbiscan.io/']
            }]
          });
          setWrongNetwork(false);
        } catch (addError) {
          showMessage('Failed to add Arbitrum network: ' + (addError as Error).message, 'error');
        }
      } else {
        showMessage('Failed to switch to Arbitrum network: ' + switchError.message, 'error');
      }
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      showMessage('Please install MetaMask or another Ethereum wallet', 'error');
      return;
    }
    
    try {
      const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      setAccounts(accs as string[]);
      
      const isCorrectNetwork = await checkNetwork();
      if (!isCorrectNetwork) {
        await switchToArbitrum();
      }
      
      updateBalances();
    } catch (error) {
      showMessage('Failed to connect wallet: ' + (error as Error).message, 'error');
    }
  };

  // Update token balances
  const updateBalances = async () => {
    if (!web3 || !accounts[0]) return;
    
    try {
      const fromBalance = await getTokenBalance(fromToken.address, accounts[0], fromToken.decimals);
      setFromBalance(fromBalance);
      
      const toBalance = await getTokenBalance(toToken.address, accounts[0], toToken.decimals);
      setToBalance(toBalance);
    } catch (error) {
      console.error('Error updating balances:', error);
    }
  };

  // Get token balance
  const getTokenBalance = async (tokenAddress: string, userAddress: string, decimals: number): Promise<string> => {
    if (!web3) return '0';
    
    if (tokenAddress === '0x0000000000000000000000000000000000000000') {
      const balance = await web3.eth.getBalance(userAddress);
      return web3.utils.fromWei(balance, 'ether');
    }
    
    const tokenContract = new web3.eth.Contract([
      {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
      }
    ], tokenAddress);
    
    const balance = await tokenContract.methods.balanceOf(userAddress).call();
    return (Number(balance) / (10 ** decimals)).toFixed(6);
  };

  // Get swap quote
  const getQuote = async () => {
    if (!accounts[0] || !fromAmount || parseFloat(fromAmount) <= 0 || !web3) {
      setToAmount('');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromTokenAddress: fromToken.address,
          toTokenAddress: toToken.address,
          amount: fromAmount,
          slippage
        })
      });
      
      const data: QuoteResponse = await response.json();
      
      if (response.ok) {
        const toAmount = web3.utils.fromWei(data.toAmount, 'ether');
        setToAmount(parseFloat(toAmount).toFixed(6));
      } else {
        showMessage('Failed to get quote: ' + (data.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      showMessage('Failed to get quote: ' + (error as Error).message, 'error');
    }
  };

  // Switch tokens
  const switchTokens = () => {
    const currentFromToken = fromToken;
    const currentFromAmount = fromAmount;
    
    setFromToken(toToken);
    setToToken(currentFromToken);
    
    if (currentFromAmount) {
      setFromAmount(toAmount);
      setToAmount('');
      getQuote();
    }
    
    updateBalances();
  };

  // Execute swap (with built-in approval)
  const executeSwap = async () => {
    if (!web3 || !accounts[0] || !fromAmount || !toAmount || parseFloat(fromAmount) <= 0) {
      return;
    }
    
    const isCorrectNetwork = await checkNetwork();
    if (!isCorrectNetwork) {
      showMessage('Please switch to Arbitrum network to execute swaps', 'error');
      return;
    }
    
    try {
      setIsLoading(true);
      showMessage('Processing swap...', 'info');
      
      const tokenContract = new web3.eth.Contract([
        {
          "constant": true,
          "inputs": [
            {"name": "_owner", "type": "address"},
            {"name": "_spender", "type": "address"}
          ],
          "name": "allowance",
          "outputs": [{"name": "remaining", "type": "uint256"}],
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {"name": "_spender", "type": "address"},
            {"name": "_value", "type": "uint256"}
          ],
          "name": "approve",
          "outputs": [{"name": "success", "type": "bool"}],
          "type": "function"
        }
      ], fromToken.address);
      
      const requiredAllowance = web3.utils.toWei(fromAmount, 'ether');
      const currentAllowance: string = await tokenContract.methods
        .allowance(accounts[0], SWAP_ROUTER_ADDRESS)
        .call();

      if (BigInt(currentAllowance) < BigInt(requiredAllowance)) {
        showMessage('Approving token for swap...', 'info');
        
        const approveResponse = await fetch(`${API_BASE_URL}/approve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tokenAddress: fromToken.address,
            ownerAddress: accounts[0],
            amount: requiredAllowance.toString()
          })
        });
        
        const approveData: ApproveResponse = await approveResponse.json();
        
        if (!approveResponse.ok) {
          throw new Error(approveData.error || 'Approval failed');
        }
        
        showMessage('Token approved, executing swap...', 'info');
      }
      
      const swapResponse = await fetch(`${API_BASE_URL}/swap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromTokenAddress: fromToken.address,
          toTokenAddress: toToken.address,
          amount: fromAmount,
          toAmount,
          fromAddress: accounts[0],
          slippage
        })
      });
      
      const swapData: SwapResponse = await swapResponse.json();
      
      if (swapResponse.ok) {
        showMessage(`Swap successful! TX: ${swapData.transactionHash}`, 'success');
        updateBalances();
        setFromAmount('');
        setToAmount('');
      } else {
        throw new Error(swapData.error || 'Swap failed');
      }
    } catch (error) {
      showMessage('Swap failed: ' + (error as Error).message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Show status message
  const showMessage = (message: string, type: 'error' | 'success' | 'info') => {
    setStatusMessage(message);
    setMessageType(type);
  };

  // Handle from token change
  const handleFromTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedToken = ARBITRUM_TOKENS.find(token => token.address === e.target.value);
    if (selectedToken) {
      setFromToken(selectedToken);
      updateBalances();
      getQuote();
    }
  };

  // Handle to token change
  const handleToTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedToken = ARBITRUM_TOKENS.find(token => token.address === e.target.value);
    if (selectedToken) {
      setToToken(selectedToken);
      updateBalances();
      getQuote();
    }
  };

  // Handle from amount change
  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromAmount(e.target.value);
    getQuote();
  };

  // Handle max balance click
  const handleMaxBalance = () => {
    setFromAmount(fromBalance);
    getQuote();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 relative">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 to-green-700"></div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                <path d="M7 10L12 15L17 10M7 10L12 5M7 10H17M17 14L12 9L7 14M17 14L12 19M17 14H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              DPO Token Swap
            </h1>
            <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-sm font-medium text-green-800">Arbitrum</span>
            </div>
          </div>

          {wrongNetwork && (
            <div className="mb-4 p-3 rounded-lg bg-yellow-50 text-yellow-700 text-sm flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                <path d="M12 8V12M12 16H12.01M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Please switch to Arbitrum network</span>
              <button onClick={switchToArbitrum} className="font-semibold underline">Switch Network</button>
            </div>
          )}

          {/* From Token Input */}
          <div className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-200 transition-all focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-500">From</label>
              <span 
                className="text-sm font-medium text-gray-500 hover:text-green-600 cursor-pointer"
                onClick={handleMaxBalance}
              >
                Balance: {fromBalance} {fromToken.symbol}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                value={fromAmount}
                onChange={handleFromAmountChange}
                placeholder="0.0"
                className="w-full bg-transparent text-2xl font-semibold outline-none"
              />
              <select
                value={fromToken.address}
                onChange={handleFromTokenChange}
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                {ARBITRUM_TOKENS.map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center my-2 relative z-10">
            <button
              onClick={switchTokens}
              className="p-2 bg-white rounded-full border border-gray-200 hover:bg-green-50 hover:border-green-500 transition-all shadow-sm"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500">
                <path d="M8 7H20M20 7L16 3M20 7L16 11M16 17H4M4 17L8 21M4 17L8 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* To Token Input */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-500">To</label>
              <span className="text-sm font-medium text-gray-500">
                Balance: {toBalance} {toToken.symbol}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                value={toAmount}
                placeholder="0.0"
                readOnly
                className="w-full bg-transparent text-2xl font-semibold outline-none"
              />
              <select
                value={toToken.address}
                onChange={handleToTokenChange}
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                {ARBITRUM_TOKENS.map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Slippage Tolerance */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-500">Slippage Tolerance</label>
              <input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                step="0.1"
                min="0.1"
                max="5"
                className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
              />
              <span className="text-sm font-medium">%</span>
            </div>
          </div>

          {/* Connect Wallet / Swap Button */}
          {!accounts[0] ? (
            <button
              onClick={connectWallet}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-4 rounded-xl transition-all shadow-md hover:shadow-lg active:translate-y-0.5"
            >
              Connect Wallet
            </button>
          ) : (
            <button
              onClick={executeSwap}
              disabled={!fromAmount || parseFloat(fromAmount) <= 0 || isLoading || wrongNetwork}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none relative"
            >
              {isLoading ? (
                <>
                  <span className="opacity-0">Processing...</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-opacity-30 rounded-full border-t-white animate-spin"></div>
                  </div>
                </>
              ) : (
                'Swap'
              )}
            </button>
          )}

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm flex items-center justify-center gap-2 ${
                messageType === 'error'
                  ? 'bg-red-50 text-red-600'
                  : messageType === 'success'
                  ? 'bg-green-50 text-green-600'
                  : 'bg-blue-50 text-blue-600'
              }`}
            >
              {messageType === 'error' ? (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <path d="M12 8V12M12 16H12.01M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : messageType === 'success' ? (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* DPO Branding */}
          <div className="mt-6 text-center text-xs text-gray-500">
            Powered by <a href="https://dpo-global.com" target="_blank" rel="noopener noreferrer" className="text-green-600 font-medium">DPO Global</a> - Digital Asset Securities Platform
          </div>
        </div>
      </div>
    </div>
  );
};

export default DpoTokenSwap;