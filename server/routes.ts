import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertAiModelSchema, 
  insertPromptSchema, 
  insertModelInferenceSchema,
  insertPromptPurchaseSchema 
} from "@shared/schema";
import multer from "multer";
import path from "path";

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getTotalStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // AI Models endpoints
  app.get("/api/models", async (req, res) => {
    try {
      const { category, search } = req.query;
      const models = await storage.getAiModels(
        category as string, 
        search as string
      );
      res.json(models);
    } catch (error) {
      console.error("Error fetching models:", error);
      res.status(500).json({ message: "Failed to fetch models" });
    }
  });

  app.get("/api/models/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const model = await storage.getAiModel(id);
      
      if (!model) {
        return res.status(404).json({ message: "Model not found" });
      }
      
      res.json(model);
    } catch (error) {
      console.error("Error fetching model:", error);
      res.status(500).json({ message: "Failed to fetch model" });
    }
  });

  app.post("/api/models", upload.single('modelFile'), async (req, res) => {
    try {
      const modelData = insertAiModelSchema.parse(req.body);
      
      // Handle file upload
      if (req.file) {
        modelData.modelFileUrl = `/uploads/${req.file.filename}`;
      }
      
      const model = await storage.createAiModel(modelData);
      res.json(model);
    } catch (error) {
      console.error("Error creating model:", error);
      res.status(400).json({ message: "Failed to create model" });
    }
  });

  app.get("/api/models/top/:limit", async (req, res) => {
    try {
      const limit = parseInt(req.params.limit) || 10;
      const models = await storage.getTopModels(limit);
      res.json(models);
    } catch (error) {
      console.error("Error fetching top models:", error);
      res.status(500).json({ message: "Failed to fetch top models" });
    }
  });

  // Model inference endpoint
  app.post("/api/models/:id/infer", async (req, res) => {
    try {
      const modelId = parseInt(req.params.id);
      const { input, userId } = req.body;
      
      const model = await storage.getAiModel(modelId);
      if (!model) {
        return res.status(404).json({ message: "Model not found" });
      }

      // Simulate AI inference
      const startTime = Date.now();
      
      // Mock inference based on model category
      let output;
      switch (model.category) {
        case "Computer Vision":
          output = {
            predictions: [
              { class: "cat", confidence: 0.94 },
              { class: "dog", confidence: 0.06 }
            ],
            detected_objects: []
          };
          break;
        case "Language":
          output = {
            generated_text: "This is a simulated response from the language model based on your input.",
            tokens_used: 45
          };
          break;
        case "Audio":
          output = {
            audio_url: "/generated/audio_sample.wav",
            duration: 30,
            format: "wav"
          };
          break;
        default:
          output = { result: "Inference completed successfully" };
      }
      
      const executionTime = Date.now() - startTime;
      
      // Record inference
      const inference = await storage.createModelInference({
        modelId,
        userId: userId || null,
        input,
        output,
        cost: model.pricePerInference,
        executionTime,
      });

      // Update model usage
      await storage.updateModelUsage(modelId);

      res.json({
        inference,
        output,
        cost: model.pricePerInference,
        executionTime,
      });
    } catch (error) {
      console.error("Error processing inference:", error);
      res.status(500).json({ message: "Failed to process inference" });
    }
  });

  // Prompts endpoints
  app.get("/api/prompts", async (req, res) => {
    try {
      const { category } = req.query;
      const prompts = await storage.getPrompts(category as string);
      res.json(prompts);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      res.status(500).json({ message: "Failed to fetch prompts" });
    }
  });

  app.get("/api/prompts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const prompt = await storage.getPrompt(id);
      
      if (!prompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      
      res.json(prompt);
    } catch (error) {
      console.error("Error fetching prompt:", error);
      res.status(500).json({ message: "Failed to fetch prompt" });
    }
  });

  app.post("/api/prompts", async (req, res) => {
    try {
      const promptData = insertPromptSchema.parse(req.body);
      const prompt = await storage.createPrompt(promptData);
      res.json(prompt);
    } catch (error) {
      console.error("Error creating prompt:", error);
      res.status(400).json({ message: "Failed to create prompt" });
    }
  });

  // Prompt purchase endpoint
  app.post("/api/prompts/:id/purchase", async (req, res) => {
    try {
      const promptId = parseInt(req.params.id);
      const { buyerId, transactionHash } = req.body;
      
      const prompt = await storage.getPrompt(promptId);
      if (!prompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }

      const purchase = await storage.createPromptPurchase({
        promptId,
        buyerId,
        price: prompt.price,
        transactionHash,
      });

      // Update prompt sales
      await storage.updatePromptSales(promptId);

      res.json(purchase);
    } catch (error) {
      console.error("Error processing purchase:", error);
      res.status(500).json({ message: "Failed to process purchase" });
    }
  });

  // Leaderboard endpoints
  app.get("/api/leaderboard/earners/:limit", async (req, res) => {
    try {
      const limit = parseInt(req.params.limit) || 10;
      const users = await storage.getTopEarners(limit);
      res.json(users);
    } catch (error) {
      console.error("Error fetching top earners:", error);
      res.status(500).json({ message: "Failed to fetch top earners" });
    }
  });

  // User endpoints
  app.get("/api/users/:username", async (req, res) => {
    try {
      const username = req.params.username;
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/users/:id/models", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const models = await storage.getModelsByCreator(id);
      res.json(models);
    } catch (error) {
      console.error("Error fetching user models:", error);
      res.status(500).json({ message: "Failed to fetch user models" });
    }
  });

  // Mock wallet connection endpoint
  app.post("/api/wallet/connect", async (req, res) => {
    try {
      const { walletAddress } = req.body;
      
      // Simulate wallet connection
      const mockUser = {
        id: 999,
        username: "connected_user",
        walletAddress,
        aptBalance: "1247.5",
        connected: true,
      };
      
      res.json(mockUser);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      res.status(500).json({ message: "Failed to connect wallet" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
