import { NextResponse } from 'next/server';
import { ARBITRUM_CHAIN_ID, ARBITRUM_RPC_URL, SWAP_ROUTER_ADDRESS, MAX_APPROVAL_AMOUNT } from '@/src/lib/constants';
import Web3 from 'web3';
import { ARBITRUM_TOKENS } from '@/src/lib/tokens';
import { ApproveResponse } from '@/src/lib/types';

const web3 = new Web3(ARBITRUM_RPC_URL);

export async function POST(request: Request) {
  try {
    const { tokenAddress, ownerAddress, amount } = await request.json();
    
    // Validate inputs
    if (!tokenAddress || !ownerAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Find token
    const token = ARBITRUM_TOKENS.find(t => t.address.toLowerCase() === tokenAddress.toLowerCase());
    
    if (!token) {
      return NextResponse.json({ error: 'Invalid token address' }, { status: 400 });
    }

    // Simulate an approval transaction (in a real app, you'd construct and send an actual transaction)
    const txHash = web3.utils.randomHex(32);

    const response: ApproveResponse = {
      transactionHash: txHash,
      spender: SWAP_ROUTER_ADDRESS,
      amount: amount || MAX_APPROVAL_AMOUNT
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Approve error:', error);
    return NextResponse.json({ error: 'Failed to execute approval' }, { status: 500 });
  }
}