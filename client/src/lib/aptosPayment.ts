import { Aptos, Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

// Model inference pricing (in APT)
export const MODEL_PRICING = {
  'gpt-3.5-turbo': 0.01,
  'claude-3-haiku': 0.015,
  'llama-2-7b': 0.005,
  'stable-diffusion': 0.02,
  'whisper-large': 0.008,
  'default': 0.01
};

// Platform fee recipient (you can change this to your own address)
const PLATFORM_ADDRESS = "0x06ed61974ad9b10aa57c7ed03c7f6936797caf4b62fd5cc61985b4f592f80693";

export interface PaymentTransaction {
  sender: string;
  receiver: string;
  amount: number;
  modelId: string;
  timestamp: number;
}

export async function createModelInferencePayment(
  aptos: Aptos,
  senderAddress: string,
  modelId: string,
  modelName?: string
): Promise<any> {
  const amount = MODEL_PRICING[modelName as keyof typeof MODEL_PRICING] || MODEL_PRICING.default;
  const amountInOctas = Math.floor(amount * 100000000); // Convert APT to octas

  const transaction = {
    type: "entry_function_payload",
    function: "0x1::coin::transfer",
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
    arguments: [
      PLATFORM_ADDRESS, // recipient
      amountInOctas.toString() // amount in octas
    ]
  };

  return transaction;
}

export async function verifyPaymentTransaction(
  aptos: Aptos,
  txHash: string
): Promise<boolean> {
  try {
    const txn = await aptos.getTransactionByHash({ transactionHash: txHash });
    return txn.success === true;
  } catch (error) {
    console.error('Failed to verify transaction:', error);
    return false;
  }
}

export function getModelPrice(modelName?: string): number {
  return MODEL_PRICING[modelName as keyof typeof MODEL_PRICING] || MODEL_PRICING.default;
}

export function formatAPT(amount: number): string {
  return amount.toFixed(4);
}