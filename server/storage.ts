import {
  users,
  aiModels,
  prompts,
  modelInferences,
  promptPurchases,
  type User,
  type InsertUser,
  type AiModel,
  type InsertAiModel,
  type Prompt,
  type InsertPrompt,
  type ModelInference,
  type InsertModelInference,
  type PromptPurchase,
  type InsertPromptPurchase,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserEarnings(id: number, earnings: string): Promise<User | undefined>;
  getTopEarners(limit: number): Promise<User[]>;

  // AI Model operations
  getAiModel(id: number): Promise<AiModel | undefined>;
  getAiModels(category?: string, search?: string): Promise<AiModel[]>;
  createAiModel(model: InsertAiModel): Promise<AiModel>;
  updateModelUsage(id: number): Promise<AiModel | undefined>;
  getTopModels(limit: number): Promise<AiModel[]>;
  getModelsByCreator(creatorId: number): Promise<AiModel[]>;

  // Prompt operations
  getPrompt(id: number): Promise<Prompt | undefined>;
  getPrompts(category?: string): Promise<Prompt[]>;
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  updatePromptSales(id: number): Promise<Prompt | undefined>;

  // Model Inference operations
  createModelInference(inference: InsertModelInference): Promise<ModelInference>;
  getModelInferences(modelId?: number, userId?: number): Promise<ModelInference[]>;

  // Prompt Purchase operations
  createPromptPurchase(purchase: InsertPromptPurchase): Promise<PromptPurchase>;
  getPromptPurchases(userId?: number): Promise<PromptPurchase[]>;

  // Statistics
  getTotalStats(): Promise<{
    activeModels: number;
    totalInferences: number;
    aptDistributed: string;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private aiModels: Map<number, AiModel>;
  private prompts: Map<number, Prompt>;
  private modelInferences: Map<number, ModelInference>;
  private promptPurchases: Map<number, PromptPurchase>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.aiModels = new Map();
    this.prompts = new Map();
    this.modelInferences = new Map();
    this.promptPurchases = new Map();
    this.currentId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample users
    const user1: User = {
      id: 1,
      username: "ai_researcher",
      walletAddress: "0x123...abc",
      totalEarnings: "12450",
      reputation: 95,
      createdAt: new Date("2024-01-15"),
    };

    const user2: User = {
      id: 2,
      username: "blockchain_dev",
      walletAddress: "0x456...def",
      totalEarnings: "8920",
      reputation: 87,
      createdAt: new Date("2024-02-10"),
    };

    const user3: User = {
      id: 3,
      username: "sound_artist",
      walletAddress: "0x789...ghi",
      totalEarnings: "7340",
      reputation: 92,
      createdAt: new Date("2024-01-20"),
    };

    this.users.set(1, user1);
    this.users.set(2, user2);
    this.users.set(3, user3);

    // Create sample AI models
    const model1: AiModel = {
      id: 1,
      name: "Vision Transformer v2",
      description: "State-of-the-art image classification and object detection model with 94.2% accuracy on ImageNet.",
      category: "Computer Vision",
      creatorId: 1,
      pricePerInference: "2.5",
      modelFileUrl: "/models/vision-transformer-v2.pkl",
      storageType: "ipfs",
      usageCount: 2847,
      rating: "4.8",
      ratingCount: 156,
      isActive: true,
      createdAt: new Date("2024-01-15"),
    };

    const model2: AiModel = {
      id: 2,
      name: "GPT-Aptos 13B",
      description: "Fine-tuned language model specialized in blockchain and Move smart contract development.",
      category: "Language",
      creatorId: 2,
      pricePerInference: "1.8",
      modelFileUrl: "/models/gpt-aptos-13b.pt",
      storageType: "filecoin",
      usageCount: 1923,
      rating: "4.6",
      ratingCount: 98,
      isActive: true,
      createdAt: new Date("2024-02-10"),
    };

    const model3: AiModel = {
      id: 3,
      name: "AudioGen Pro",
      description: "Generate high-quality music and sound effects from text descriptions using advanced neural networks.",
      category: "Audio",
      creatorId: 3,
      pricePerInference: "3.2",
      modelFileUrl: "/models/audiogen-pro.h5",
      storageType: "ocean",
      usageCount: 1678,
      rating: "4.9",
      ratingCount: 89,
      isActive: true,
      createdAt: new Date("2024-01-20"),
    };

    this.aiModels.set(1, model1);
    this.aiModels.set(2, model2);
    this.aiModels.set(3, model3);

    // Create sample prompts
    const prompt1: Prompt = {
      id: 1,
      title: "Professional Headshot Generator",
      description: "Generate stunning professional headshots with perfect lighting and composition. Includes 15 variations and style guide.",
      content: "professional headshot of [subject], studio lighting, clean background, corporate attire, high resolution, professional photography...",
      category: "Photography",
      creatorId: 1,
      price: "15",
      salesCount: 247,
      rating: "4.9",
      ratingCount: 89,
      nftTokenId: "nft_001",
      isActive: true,
      createdAt: new Date("2024-02-01"),
    };

    const prompt2: Prompt = {
      id: 2,
      title: "Code Documentation Writer",
      description: "Automatically generate comprehensive documentation for any codebase. Includes README templates and API docs.",
      content: "Create detailed documentation for this [language] code: [code_snippet]. Include usage examples, installation instructions, API reference...",
      category: "Development",
      creatorId: 2,
      price: "12",
      salesCount: 189,
      rating: "4.7",
      ratingCount: 67,
      nftTokenId: "nft_002",
      isActive: true,
      createdAt: new Date("2024-02-05"),
    };

    const prompt3: Prompt = {
      id: 3,
      title: "Fantasy Landscape Artist",
      description: "Create breathtaking fantasy landscapes with magical elements. Perfect for game development and digital art.",
      content: "epic fantasy landscape, [environment], magical lighting, detailed terrain, atmospheric perspective, 4k resolution...",
      category: "Art",
      creatorId: 3,
      price: "18",
      salesCount: 312,
      rating: "4.8",
      ratingCount: 94,
      nftTokenId: "nft_003",
      isActive: true,
      createdAt: new Date("2024-01-25"),
    };

    this.prompts.set(1, prompt1);
    this.prompts.set(2, prompt2);
    this.prompts.set(3, prompt3);

    this.currentId = 4;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      totalEarnings: "0",
      reputation: 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserEarnings(id: number, earnings: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = {
      ...user,
      totalEarnings: earnings,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getTopEarners(limit: number): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => parseFloat(b.totalEarnings) - parseFloat(a.totalEarnings))
      .slice(0, limit);
  }

  async getAiModel(id: number): Promise<AiModel | undefined> {
    return this.aiModels.get(id);
  }

  async getAiModels(category?: string, search?: string): Promise<AiModel[]> {
    let models = Array.from(this.aiModels.values()).filter(model => model.isActive);

    if (category && category !== "All Categories") {
      models = models.filter(model => model.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      models = models.filter(model =>
        model.name.toLowerCase().includes(searchLower) ||
        model.description.toLowerCase().includes(searchLower)
      );
    }

    return models.sort((a, b) => b.usageCount - a.usageCount);
  }

  async createAiModel(insertModel: InsertAiModel): Promise<AiModel> {
    const id = this.currentId++;
    const model: AiModel = {
      ...insertModel,
      id,
      usageCount: 0,
      rating: "0",
      ratingCount: 0,
      isActive: true,
      createdAt: new Date(),
    };
    this.aiModels.set(id, model);
    return model;
  }

  async updateModelUsage(id: number): Promise<AiModel | undefined> {
    const model = this.aiModels.get(id);
    if (!model) return undefined;

    const updatedModel = {
      ...model,
      usageCount: model.usageCount + 1,
    };
    this.aiModels.set(id, updatedModel);
    return updatedModel;
  }

  async getTopModels(limit: number): Promise<AiModel[]> {
    return Array.from(this.aiModels.values())
      .filter(model => model.isActive)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  async getModelsByCreator(creatorId: number): Promise<AiModel[]> {
    return Array.from(this.aiModels.values())
      .filter(model => model.creatorId === creatorId && model.isActive)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPrompt(id: number): Promise<Prompt | undefined> {
    return this.prompts.get(id);
  }

  async getPrompts(category?: string): Promise<Prompt[]> {
    let prompts = Array.from(this.prompts.values()).filter(prompt => prompt.isActive);

    if (category && category !== "All Categories") {
      prompts = prompts.filter(prompt => prompt.category === category);
    }

    return prompts.sort((a, b) => b.salesCount - a.salesCount);
  }

  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const id = this.currentId++;
    const prompt: Prompt = {
      ...insertPrompt,
      id,
      salesCount: 0,
      rating: "0",
      ratingCount: 0,
      nftTokenId: `nft_${id}`,
      isActive: true,
      createdAt: new Date(),
    };
    this.prompts.set(id, prompt);
    return prompt;
  }

  async updatePromptSales(id: number): Promise<Prompt | undefined> {
    const prompt = this.prompts.get(id);
    if (!prompt) return undefined;

    const updatedPrompt = {
      ...prompt,
      salesCount: prompt.salesCount + 1,
    };
    this.prompts.set(id, updatedPrompt);
    return updatedPrompt;
  }

  async createModelInference(insertInference: InsertModelInference): Promise<ModelInference> {
    const id = this.currentId++;
    const inference: ModelInference = {
      ...insertInference,
      id,
      createdAt: new Date(),
    };
    this.modelInferences.set(id, inference);
    return inference;
  }

  async getModelInferences(modelId?: number, userId?: number): Promise<ModelInference[]> {
    let inferences = Array.from(this.modelInferences.values());

    if (modelId) {
      inferences = inferences.filter(inference => inference.modelId === modelId);
    }

    if (userId) {
      inferences = inferences.filter(inference => inference.userId === userId);
    }

    return inferences.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createPromptPurchase(insertPurchase: InsertPromptPurchase): Promise<PromptPurchase> {
    const id = this.currentId++;
    const purchase: PromptPurchase = {
      ...insertPurchase,
      id,
      createdAt: new Date(),
    };
    this.promptPurchases.set(id, purchase);
    return purchase;
  }

  async getPromptPurchases(userId?: number): Promise<PromptPurchase[]> {
    let purchases = Array.from(this.promptPurchases.values());

    if (userId) {
      purchases = purchases.filter(purchase => purchase.buyerId === userId);
    }

    return purchases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getTotalStats(): Promise<{
    activeModels: number;
    totalInferences: number;
    aptDistributed: string;
  }> {
    const activeModels = Array.from(this.aiModels.values()).filter(model => model.isActive).length;
    const totalInferences = Array.from(this.modelInferences.values()).length + 156000; // Add base count
    const aptDistributed = Array.from(this.users.values())
      .reduce((total, user) => total + parseFloat(user.totalEarnings), 0)
      .toFixed(1);

    return {
      activeModels,
      totalInferences,
      aptDistributed,
    };
  }
}

export const storage = new MemStorage();
