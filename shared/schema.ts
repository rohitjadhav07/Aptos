import { pgTable, text, serial, integer, boolean, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  walletAddress: text("wallet_address").unique(),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0"),
  reputation: integer("reputation").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiModels = pgTable("ai_models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  creatorId: integer("creator_id").references(() => users.id),
  pricePerInference: decimal("price_per_inference", { precision: 10, scale: 3 }).notNull(),
  modelFileUrl: text("model_file_url"),
  storageType: text("storage_type"), // ipfs, filecoin, ocean
  usageCount: integer("usage_count").default(0),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  ratingCount: integer("rating_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  creatorId: integer("creator_id").references(() => users.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  salesCount: integer("sales_count").default(0),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  ratingCount: integer("rating_count").default(0),
  nftTokenId: text("nft_token_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const modelInferences = pgTable("model_inferences", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").references(() => aiModels.id),
  userId: integer("user_id").references(() => users.id),
  input: jsonb("input"),
  output: jsonb("output"),
  cost: decimal("cost", { precision: 10, scale: 3 }).notNull(),
  executionTime: integer("execution_time"), // in milliseconds
  createdAt: timestamp("created_at").defaultNow(),
});

export const promptPurchases = pgTable("prompt_purchases", {
  id: serial("id").primaryKey(),
  promptId: integer("prompt_id").references(() => prompts.id),
  buyerId: integer("buyer_id").references(() => users.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  transactionHash: text("transaction_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAiModelSchema = createInsertSchema(aiModels).omit({
  id: true,
  usageCount: true,
  rating: true,
  ratingCount: true,
  isActive: true,
  createdAt: true,
});

export const insertPromptSchema = createInsertSchema(prompts).omit({
  id: true,
  salesCount: true,
  rating: true,
  ratingCount: true,
  nftTokenId: true,
  isActive: true,
  createdAt: true,
});

export const insertModelInferenceSchema = createInsertSchema(modelInferences).omit({
  id: true,
  createdAt: true,
});

export const insertPromptPurchaseSchema = createInsertSchema(promptPurchases).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAiModel = z.infer<typeof insertAiModelSchema>;
export type AiModel = typeof aiModels.$inferSelect;

export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type Prompt = typeof prompts.$inferSelect;

export type InsertModelInference = z.infer<typeof insertModelInferenceSchema>;
export type ModelInference = typeof modelInferences.$inferSelect;

export type InsertPromptPurchase = z.infer<typeof insertPromptPurchaseSchema>;
export type PromptPurchase = typeof promptPurchases.$inferSelect;
