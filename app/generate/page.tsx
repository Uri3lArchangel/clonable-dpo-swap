'use client';

import { useState } from 'react';
import { ARBITRUM_TOKENS } from '@/src/lib/tokens';
import { ARBITRUM_CHAIN_ID, SWAP_ROUTER_ADDRESS } from '@/src/lib/constants';

interface Token {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  logoURI: string;
}

declare global {
  interface Window {
    ethereum?: {
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

export default function GeneratePage() {
  const [techStack, setTechStack] = useState<'html' | 'react'>('html');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateHTMLCode = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DPO Token Swap | DPO Global</title>
  <meta name="description" content="Swap digital asset securities on the DPO Global ecosystem powered by Arbitrum Layer 2">
  <script src="https://cdn.jsdelivr.net/npm/web3@1.8.0/dist/web3.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #10B981;
      --primary-dark: #059669;
      --primary-light: #D1FAE5;
      --background: #FFFFFF;
      --surface: #F9FAFB;
      --border: #E5E7EB;
      --text-primary: #111827;
      --text-secondary: #6B7280;
      --error: #EF4444;
      --success: #10B981;
      --warning: #F59E0B;
      --dpo-green: #10B981;
      --dpo-dark: #111827;
      --dpo-light: #F9FAFB;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #F9FAFB 0%, #ECFDF5 100%);
      color: var(--text-primary);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    
    .swap-container {
      background-color: var(--background);
      border-radius: 20px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      width: 100%;
      max-width: 480px;
      padding: 28px;
      border: 1px solid var(--border);
      position: relative;
      overflow: hidden;
    }
    
    .swap-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, var(--dpo-green) 0%, var(--primary-dark) 100%);
    }
    
    .swap-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .swap-title {
      font-size: 22px;
      font-weight: 600;
      color: var(--dpo-dark);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .swap-title svg {
      width: 20px;
      height: 20px;
    }
    
    .swap-network {
      background-color: var(--primary-light);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-dark);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .swap-network-icon {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: var(--dpo-green);
    }
    
    .token-input {
      background-color: var(--surface);
      border-radius: 14px;
      padding: 18px;
      margin-bottom: 12px;
      border: 1px solid var(--border);
      transition: all 0.2s;
    }
    
    .token-input:focus-within {
      border-color: var(--dpo-green);
      box-shadow: 0 0 0 2px var(--primary-light);
    }
    
    .token-input-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    
    .token-input-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
    }
    
    .token-balance {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
    }
    
    .token-balance:hover {
      color: var(--dpo-green);
    }
    
    .token-selector {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .token-amount {
      flex: 1;
    }
    
    .token-amount input {
      width: 100%;
      background: transparent;
      border: none;
      font-size: 26px;
      font-weight: 600;
      color: var(--dpo-dark);
      outline: none;
    }
    
    .token-amount input::placeholder {
      color: var(--text-secondary);
      opacity: 0.5;
    }
    
    .token-dropdown {
      position: relative;
    }
    
    .token-dropdown-toggle {
      background-color: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-weight: 500;
      min-width: 100px;
      transition: all 0.2s;
    }
    
    .token-dropdown-toggle:hover {
      background-color: var(--primary-light);
      border-color: var(--dpo-green);
    }
    
    .token-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    
    .swap-direction {
      display: flex;
      justify-content: center;
      margin: 8px 0;
      position: relative;
      z-index: 1;
    }
    
    .swap-direction-button {
      background-color: var(--background);
      border: 1px solid var(--border);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }
    
    .swap-direction-button:hover {
      background-color: var(--primary-light);
      transform: rotate(180deg);
      border-color: var(--dpo-green);
    }
    
    .swap-settings {
      margin: 16px 0;
      padding: 16px;
      background-color: var(--surface);
      border-radius: 14px;
      border: 1px solid var(--border);
    }
    
    .slippage-input {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .slippage-input label {
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    .slippage-input input {
      flex: 1;
      background-color: var(--background);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 14px;
      transition: all 0.2s;
    }
    
    .slippage-input input:focus {
      border-color: var(--dpo-green);
      box-shadow: 0 0 0 2px var(--primary-light);
      outline: none;
    }
    
    .swap-button {
      width: 100%;
      background: linear-gradient(90deg, var(--dpo-green) 0%, var(--primary-dark) 100%);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 18px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 8px;
      box-shadow: 0 4px 6px rgba(16, 185, 129, 0.1);
    }
    
    .swap-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 8px rgba(16, 185, 129, 0.15);
    }
    
    .swap-button:disabled {
      background: var(--border);
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    
    .connect-wallet-button {
      width: 100%;
      background: linear-gradient(90deg, var(--dpo-green) 0%, var(--primary-dark) 100%);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 18px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 12px;
      box-shadow: 0 4px 6px rgba(16, 185, 129, 0.1);
    }
    
    .connect-wallet-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 8px rgba(16, 185, 129, 0.15);
    }
    
    .status-message {
      margin-top: 16px;
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .status-message svg {
      width: 16px;
      height: 16px;
    }
    
    .status-message.error {
      background-color: rgba(239, 68, 68, 0.1);
      color: var(--error);
    }
    
    .status-message.success {
      background-color: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }
    
    .status-message.info {
      background-color: rgba(59, 130, 246, 0.1);
      color: #3B82F6;
    }
    
    .status-message.warning {
      background-color: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }
    
    .network-alert {
      margin-bottom: 16px;
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
      text-align: center;
      background-color: rgba(245, 158, 11, 0.1);
      color: var(--warning);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .network-alert svg {
      width: 16px;
      height: 16px;
    }
    
    .network-alert button {
      margin-left: 8px;
      background: none;
      border: none;
      color: var(--warning);
      font-weight: 600;
      cursor: pointer;
      text-decoration: underline;
    }
    
    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
      margin: 0 auto;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* DPO Branding */
    .dpo-branding {
      text-align: center;
      margin-top: 24px;
      font-size: 12px;
      color: var(--text-secondary);
    }
    
    .dpo-branding a {
      color: var(--dpo-green);
      text-decoration: none;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="swap-container">
    <div class="swap-header">
      <h1 class="swap-title">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 10L12 15L17 10M7 10L12 5M7 10H17M17 14L12 9L7 14M17 14L12 19M17 14H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        DPO Token Swap
      </h1>
      <div class="swap-network">
        <span class="swap-network-icon"></span>
        <span>Arbitrum</span>
      </div>
    </div>
    
    <div id="networkAlert" class="network-alert" style="display: none;">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 9V11M12 15H12.01M5 7.2L3 5.2C2.73478 5.2 2.48043 5.10536 2.29289 4.93726C2.10536 4.76915 2 4.54076 2 4.3V3.7C2 3.45924 2.10536 3.23085 2.29289 3.06274C2.48043 2.89464 2.73478 2.8 3 2.8H21C21.2652 2.8 21.5196 2.89464 21.7071 3.06274C21.8946 3.23085 22 3.45924 22 3.7V4.3C22 4.54076 21.8946 4.76915 21.7071 4.93726C21.5196 5.10536 21.2652 5.2 21 5.2L19 7.2M5 7.2V18C5 18.5304 5.21071 19.0391 5.58579 19.4142C5.96086 19.7893 6.46957 20 7 20H17C17.5304 20 18.0391 19.7893 18.4142 19.4142C18.7893 19.0391 19 18.5304 19 18V7.2M5 7.2H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span id="networkAlertText"></span>
      <button id="switchNetworkBtn">Switch Network</button>
    </div>
    
    <div class="token-input">
      <div class="token-input-header">
        <span class="token-input-label">From</span>
        <span class="token-balance" id="fromBalance">Balance: 0</span>
      </div>
      <div class="token-selector">
        <div class="token-amount">
          <input type="number" id="fromAmount" placeholder="0.0" step="any">
        </div>
        <div class="token-dropdown">
          <select id="fromToken" class="token-dropdown-toggle">
            ${ARBITRUM_TOKENS.map(token => `
              <option value="${token.address}" data-icon="${token.logoURI}">${token.symbol}</option>
            `).join('')}
          </select>
        </div>
      </div>
    </div>
    
    <div class="swap-direction">
      <button class="swap-direction-button" id="switchTokens">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 7H20M20 7L16 3M20 7L16 11M16 17H4M4 17L8 21M4 17L8 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    
    <div class="token-input">
      <div class="token-input-header">
        <span class="token-input-label">To</span>
        <span class="token-balance" id="toBalance">Balance: 0</span>
      </div>
      <div class="token-selector">
        <div class="token-amount">
          <input type="number" id="toAmount" placeholder="0.0" step="any" readonly>
        </div>
        <div class="token-dropdown">
          <select id="toToken" class="token-dropdown-toggle">
            ${ARBITRUM_TOKENS.map(token => `
              <option value="${token.address}" ${token.symbol === 'USDC' ? 'selected' : ''} data-icon="${token.logoURI}">${token.symbol}</option>
            `).join('')}
          </select>
        </div>
      </div>
    </div>
    
    <div class="swap-settings">
      <div class="slippage-input">
        <label for="slippage">Slippage Tolerance</label>
        <input type="number" id="slippage" value="0.5" step="0.1" min="0.1" max="5">
        <span>%</span>
      </div>
    </div>
    
    <button class="connect-wallet-button" id="connectWallet">Connect Wallet</button>
    <button class="swap-button" id="swapButton" disabled>
      <span id="swapButtonText">Swap</span>
      <span id="swapButtonSpinner" class="loading-spinner" style="display: none;"></span>
    </button>
    
    <div class="status-message" id="statusMessage"></div>

    <div class="dpo-branding">
      Powered by <a href="https://dpo-global.com" target="_blank">DPO Global</a> - Digital Asset Securities Platform
    </div>
  </div>

  <script>
    let web3;
    let accounts = [];
    const API_BASE_URL = 'https://api.dpo-global.com/swap';
    const ARBITRUM_RPC_URL = 'https://arb1.arbitrum.io/rpc';
    
    // Token data
    const tokens = ${JSON.stringify(ARBITRUM_TOKENS, null, 2)};
    const SWAP_ROUTER_ADDRESS = '${SWAP_ROUTER_ADDRESS}';
    const ARBITRUM_CHAIN_ID = ${ARBITRUM_CHAIN_ID};
    
    // DOM elements
    const connectWalletBtn = document.getElementById('connectWallet');
    const swapBtn = document.getElementById('swapButton');
    const swapBtnText = document.getElementById('swapButtonText');
    const swapBtnSpinner = document.getElementById('swapButtonSpinner');
    const fromTokenSelect = document.getElementById('fromToken');
    const toTokenSelect = document.getElementById('toToken');
    const fromAmountInput = document.getElementById('fromAmount');
    const toAmountInput = document.getElementById('toAmount');
    const slippageInput = document.getElementById('slippage');
    const fromBalanceDiv = document.getElementById('fromBalance');
    const toBalanceDiv = document.getElementById('toBalance');
    const statusMessageDiv = document.getElementById('statusMessage');
    const switchTokensBtn = document.getElementById('switchTokens');
    const networkAlert = document.getElementById('networkAlert');
    const networkAlertText = document.getElementById('networkAlertText');
    const switchNetworkBtn = document.getElementById('switchNetworkBtn');
    
    // Initialize
    async function init() {
      connectWalletBtn.addEventListener('click', connectWallet);
      fromAmountInput.addEventListener('input', getQuote);
      fromTokenSelect.addEventListener('change', () => {
        updateBalances();
        getQuote();
      });
      toTokenSelect.addEventListener('change', getQuote);
      slippageInput.addEventListener('change', getQuote);
      swapBtn.addEventListener('click', executeSwap);
      switchTokensBtn.addEventListener('click', switchTokens);
      switchNetworkBtn.addEventListener('click', switchToArbitrum);
      
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        
        // Check if already connected
        try {
          accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) {
            updateWalletStatus();
            checkNetwork();
          }
        } catch (error) {
          console.error('Error getting accounts:', error);
        }
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (newAccounts) => {
          accounts = newAccounts;
          updateWalletStatus();
          updateBalances();
          getQuote();
        });
        
        // Listen for chain changes
        window.ethereum.on('chainChanged', (chainId) => {
          window.location.reload();
        });
      } else {
        showMessage('Please install MetaMask or another Ethereum wallet', 'error');
      }
    }
    
    // Check and handle network
    async function checkNetwork() {
      if (!web3 || !accounts[0]) return;
      
      try {
        const chainId = await web3.eth.getChainId();
        if (chainId !== ARBITRUM_CHAIN_ID) {
          showNetworkAlert('Please switch to Arbitrum network to use this dApp');
          return false;
        }
        networkAlert.style.display = 'none';
        return true;
      } catch (error) {
        console.error('Error checking network:', error);
        return false;
      }
    }
    
    // Show network alert
    function showNetworkAlert(message) {
      networkAlertText.textContent = message;
      networkAlert.style.display = 'flex';
    }
    
    // Switch to Arbitrum network
    async function switchToArbitrum() {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: web3.utils.toHex(ARBITRUM_CHAIN_ID) }],
        });
        networkAlert.style.display = 'none';
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: web3.utils.toHex(ARBITRUM_CHAIN_ID),
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
            networkAlert.style.display = 'none';
          } catch (addError) {
            showMessage('Failed to add Arbitrum network: ' + addError.message, 'error');
          }
        } else {
          showMessage('Failed to switch to Arbitrum network: ' + switchError.message, 'error');
        }
      }
    }
    
    // Connect wallet
    async function connectWallet() {
      if (!window.ethereum) {
        showMessage('Please install MetaMask or another Ethereum wallet', 'error');
        return;
      }
      
      try {
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        web3 = new Web3(window.ethereum);
        
        // Check and switch to Arbitrum network
        const isCorrectNetwork = await checkNetwork();
        if (!isCorrectNetwork) {
          await switchToArbitrum();
        }
        
        updateWalletStatus();
        updateBalances();
        getQuote();
      } catch (error) {
        showMessage('Failed to connect wallet: ' + error.message, 'error');
      }
    }
    
    // Switch tokens
    function switchTokens() {
      const fromToken = fromTokenSelect.value;
      const fromAmount = fromAmountInput.value;
      
      fromTokenSelect.value = toTokenSelect.value;
      toTokenSelect.value = fromToken;
      
      if (fromAmount) {
        fromAmountInput.value = toAmountInput.value;
        toAmountInput.value = '';
        getQuote();
      }
      
      updateBalances();
    }
    
    // Update UI when wallet is connected
    function updateWalletStatus() {
      connectWalletBtn.textContent = accounts[0] ? 
        \`Connected: \${accounts[0].substring(0, 6)}...\${accounts[0].substring(38)}\` : 
        'Connect Wallet';
    }
    
    // Update token balances
    async function updateBalances() {
      if (!accounts[0]) return;
      
      const fromTokenAddress = fromTokenSelect.value;
      const toTokenAddress = toTokenSelect.value;
      
      try {
        // Get from token balance
        const fromToken = tokens.find(t => t.address === fromTokenAddress);
        if (fromToken) {
          const balance = await getTokenBalance(fromTokenAddress, accounts[0], fromToken.decimals);
          fromBalanceDiv.textContent = \`Balance: \${balance} \${fromToken.symbol}\`;
        }
        
        // Get to token balance
        const toToken = tokens.find(t => t.address === toTokenAddress);
        if (toToken) {
          const balance = await getTokenBalance(toTokenAddress, accounts[0], toToken.decimals);
          toBalanceDiv.textContent = \`Balance: \${balance} \${toToken.symbol}\`;
        }
      } catch (error) {
        console.error('Error updating balances:', error);
      }
    }
    
    // Get token balance
    async function getTokenBalance(tokenAddress, userAddress, decimals) {
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
      return (balance / (10 ** decimals)).toFixed(6);
    }
    
    // Get swap quote
    async function getQuote() {
      if (!accounts[0] || !fromAmountInput.value || parseFloat(fromAmountInput.value) <= 0) {
        toAmountInput.value = '';
        swapBtn.disabled = true;
        return;
      }
      
      const fromTokenAddress = fromTokenSelect.value;
      const toTokenAddress = toTokenSelect.value;
      const amount = fromAmountInput.value;
      const slippage = slippageInput.value;
      
      try {
        const response = await fetch(\`\${API_BASE_URL}/quote\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fromTokenAddress,
            toTokenAddress,
            amount,
            slippage
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          const fromToken = tokens.find(t => t.address === fromTokenAddress);
          const toToken = tokens.find(t => t.address === toTokenAddress);
          
          if (fromToken && toToken) {
            const toAmount = web3.utils.fromWei(data.toAmount, 'ether');
            toAmountInput.value = parseFloat(toAmount).toFixed(6);
            swapBtn.disabled = false;
          }
        } else {
          showMessage('Failed to get quote: ' + (data.error || 'Unknown error'), 'error');
          swapBtn.disabled = true;
        }
      } catch (error) {
        showMessage('Failed to get quote: ' + error.message, 'error');
        swapBtn.disabled = true;
      }
    }
    
    // Execute swap (with built-in approval)
    async function executeSwap() {
      if (!accounts[0]) return;
      
      // Check network first
      const isCorrectNetwork = await checkNetwork();
      if (!isCorrectNetwork) {
        showMessage('Please switch to Arbitrum network to execute swaps', 'error');
        return;
      }
      
      const fromTokenAddress = fromTokenSelect.value;
      const toTokenAddress = toTokenSelect.value;
      const fromAmount = fromAmountInput.value;
      const toAmount = toAmountInput.value;
      const slippage = slippageInput.value;
      
      if (!fromTokenAddress || !toTokenAddress || !fromAmount || !toAmount || parseFloat(fromAmount) <= 0) {
        return;
      }
      
      try {
        showMessage('Processing swap...', 'info');
        swapBtn.disabled = true;
        swapBtnText.style.display = 'none';
        swapBtnSpinner.style.display = 'block';
        
        // First check if we need approval
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
        ], fromTokenAddress);
        
        const requiredAllowance = web3.utils.toWei(fromAmount, 'ether');
        const currentAllowance = await tokenContract.methods.allowance(accounts[0], SWAP_ROUTER_ADDRESS).call();
        
        if (BigInt(currentAllowance) < BigInt(requiredAllowance)) {
          showMessage('Approving token for swap...', 'info');
          
          const approveResponse = await fetch(\`\${API_BASE_URL}/approve\`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              tokenAddress: fromTokenAddress,
              ownerAddress: accounts[0],
              amount: requiredAllowance
            })
          });
          
          const approveData = await approveResponse.json();
          
          if (!approveResponse.ok) {
            throw new Error(approveData.error || 'Approval failed');
          }
          
          showMessage('Token approved, executing swap...', 'info');
        }
        
        // Now execute the swap
        const swapResponse = await fetch(\`\${API_BASE_URL}/swap\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fromTokenAddress,
            toTokenAddress,
            amount: fromAmount,
            toAmount,
            fromAddress: accounts[0],
            slippage
          })
        });
        
        const swapData = await swapResponse.json();
        
        if (swapResponse.ok) {
          showMessage(\`Swap successful! TX: \${swapData.transactionHash}\`, 'success');
          updateBalances();
          fromAmountInput.value = '';
          toAmountInput.value = '';
        } else {
          throw new Error(swapData.error || 'Swap failed');
        }
      } catch (error) {
        showMessage('Swap failed: ' + error.message, 'error');
      } finally {
        swapBtn.disabled = false;
        swapBtnText.style.display = 'block';
        swapBtnSpinner.style.display = 'none';
      }
    }
    
    // Show status message
    function showMessage(message, type) {
      statusMessageDiv.textContent = message;
      statusMessageDiv.className = 'status-message ' + type;
      
      // Add appropriate icon based on message type
      let icon = '';
      if (type === 'error') {
        icon = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8V12M12 16H12.01M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      } else if (type === 'success') {
        icon = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      } else {
        icon = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      }
      
      statusMessageDiv.innerHTML = icon + '<span>' + message + '</span>';
    }
    
    // Initialize the app
    init();
  </script>
</body>
</html>`;
  };
  
  const generateReactCode = () => {
    return `import React, { useState, useEffect } from 'react';
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

const ARBITRUM_TOKENS: Token[] = ${JSON.stringify(ARBITRUM_TOKENS, null, 2)};
const SWAP_ROUTER_ADDRESS = '${SWAP_ROUTER_ADDRESS}';
const ARBITRUM_CHAIN_ID = ${ARBITRUM_CHAIN_ID};

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
      const response = await fetch(\`\${API_BASE_URL}/quote\`, {
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
        
        const approveResponse = await fetch(\`\${API_BASE_URL}/approve\`, {
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
      
      const swapResponse = await fetch(\`\${API_BASE_URL}/swap\`, {
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
        showMessage(\`Swap successful! TX: \${swapData.transactionHash}\`, 'success');
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
              className={\`mt-4 p-3 rounded-lg text-sm flex items-center justify-center gap-2 \${
                messageType === 'error'
                  ? 'bg-red-50 text-red-600'
                  : messageType === 'success'
                  ? 'bg-green-50 text-green-600'
                  : 'bg-blue-50 text-blue-600'
              }\`}
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

export default DpoTokenSwap;`;
  };

  const codeToDisplay = techStack === 'html' ? generateHTMLCode() : generateReactCode();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <span className="text-green-600">DPO</span> Token Swap Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate compliant swap interfaces for digital asset securities on the DPO ecosystem
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6">
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Tech Stack</label>
              <div className="flex gap-3">
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    techStack === 'html' 
                      ? 'bg-green-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setTechStack('html')}
                >
                  HTML + JavaScript
                </button>
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    techStack === 'react' 
                      ? 'bg-green-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setTechStack('react')}
                >
                  React Component
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Generated Code
                </label>
                <button
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors flex items-center gap-1.5"
                  onClick={() => copyToClipboard(codeToDisplay)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm border border-gray-200" style={{ maxHeight: '500px' }}>
                <code className="text-gray-800">{codeToDisplay}</code>
              </pre>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h2 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                Implementation Notes
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-green-700 text-sm">
                <li>This code is optimized for the DPO ecosystem on Arbitrum network</li>
                <li>Includes built-in compliance with DPO&apos;s security token standards</li>
                <li>The swap flow automatically handles token approvals during the swap process</li>
                <li>UI will detect and prompt to switch to Arbitrum network if needed</li>
                <li>Replace API endpoint with your DPO-compatible swap service</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>DPO Global LLC - Digital Asset Securities Platform</p>
          <p className="mt-1">Powered by Arbitrum Layer 2 Technology</p>
        </div>
      </div>
    </div>
  );
}