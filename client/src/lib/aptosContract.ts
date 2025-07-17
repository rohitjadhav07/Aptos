import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

// Contract address on testnet
export const CONTRACT_ADDRESS = '0x8fd669458715f59eee97ff0baa117b648c8649f9d43f423578261dd26e663a3a';

// Initialize Aptos client for testnet
const aptosConfig = new AptosConfig({ network: Network.TESTNET });
export const aptos = new Aptos(aptosConfig);

export interface AIModel {
  id: number;
  name: string;
  description: string;
  owner: string;
  pricePerInference: number;
  totalInferences: number;
  createdAt: number;
}

export class AptosAIGridContract {
  
  // Upload a new AI model
  static async uploadModel(
    name: string,
    description: string,
    pricePerInference: number
  ) {
    const transaction = {
      data: {
        function: `${CONTRACT_ADDRESS}::ai_grid::upload_model`,
        functionArguments: [name, description, pricePerInference.toString()],
      },
    };
    
    return transaction;
  }

  // Execute inference on a model
  static async executeInference(modelId: number) {
    const transaction = {
      data: {
        function: `${CONTRACT_ADDRESS}::ai_grid::execute_inference`,
        functionArguments: [modelId.toString()],
      },
    };
    
    return transaction;
  }

  // Get total number of models
  static async getTotalModels(): Promise<number> {
    try {
      const result = await aptos.view({
        payload: {
          function: `${CONTRACT_ADDRESS}::ai_grid::get_total_models`,
          functionArguments: [],
        },
      });
      return parseInt(result[0] as string);
    } catch (error) {
      console.error('Error getting total models:', error);
      return 0;
    }
  }

  // Get total number of inferences
  static async getTotalInferences(): Promise<number> {
    try {
      const result = await aptos.view({
        payload: {
          function: `${CONTRACT_ADDRESS}::ai_grid::get_total_inferences`,
          functionArguments: [],
        },
      });
      return parseInt(result[0] as string);
    } catch (error) {
      console.error('Error getting total inferences:', error);
      return 0;
    }
  }

  // Get model by ID
  static async getModel(modelId: number): Promise<AIModel | null> {
    try {
      const result = await aptos.view({
        payload: {
          function: `${CONTRACT_ADDRESS}::ai_grid::get_model`,
          functionArguments: [modelId.toString()],
        },
      });

      if (result && result.length >= 7) {
        return {
          id: parseInt(result[0] as string),
          name: result[1] as string,
          description: result[2] as string,
          owner: result[3] as string,
          pricePerInference: parseInt(result[4] as string),
          totalInferences: parseInt(result[5] as string),
          createdAt: parseInt(result[6] as string),
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting model:', error);
      return null;
    }
  }

  // Get account balance in APT
  static async getAccountBalance(address: string): Promise<number> {
    try {
      const resources = await aptos.getAccountResources({ accountAddress: address });
      const accountResource = resources.find((r: any) => 
        r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
      );
      
      if (accountResource) {
        const balance = parseInt(accountResource.data.coin.value);
        return balance / 100000000; // Convert octas to APT
      }
      return 0;
    } catch (error) {
      console.error('Error getting account balance:', error);
      return 0;
    }
  }

  // Convert APT to octas
  static aptToOctas(apt: number): number {
    return Math.floor(apt * 100000000);
  }

  // Convert octas to APT
  static octasToApt(octas: number): number {
    return octas / 100000000;
  }
}