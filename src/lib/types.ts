export interface Token {
    address: string;
    symbol: string;
    decimals: number;
    name: string;
    logoURI: string;
  }
  
  export interface QuoteResponse {
    fromAmount: string;
    toAmount: string;
    estimatedGas: string;
  }
  
  export interface SwapResponse {
    transactionHash: string;
    fromAmount: string;
    toAmount: string;
  }
  
  export interface ApproveResponse {
    transactionHash: string;
    spender: string;
    amount: string;
  }