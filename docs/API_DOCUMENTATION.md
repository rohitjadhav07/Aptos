# 🚀 AptosAI Grid API Documentation

Welcome to the AptosAI Grid API! This comprehensive guide will help you integrate with our decentralized AI platform.

## 🌟 Base URL
```
Production: https://aptosai-grid.vercel.app/api
Testnet: https://testnet-api.aptosai-grid.com/api
```

## 🔐 Authentication

All API requests require a valid Aptos wallet signature for write operations.

```typescript
// Example authentication header
headers: {
  'Authorization': 'Bearer <wallet_signature>',
  'Content-Type': 'application/json'
}
```

## 🧠 AI Models API

### List All Models
```http
GET /api/models
```

**Query Parameters:**
- `category` (optional): Filter by model category
- `search` (optional): Search by model name or description
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "models": [
    {
      "id": 1,
      "name": "GPT-3.5 Turbo",
      "description": "Advanced language model for text generation",
      "category": "Language",
      "pricePerInference": 0.01,
      "owner": "0x123...",
      "totalInferences": 1337,
      "rating": 4.8,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 42,
  "hasMore": true
}
```

### Get Model Details
```http
GET /api/models/:id
```

**Response:**
```json
{
  "id": 1,
  "name": "GPT-3.5 Turbo",
  "description": "Advanced language model for text generation",
  "category": "Language",
  "pricePerInference": 0.01,
  "owner": "0x123...",
  "totalInferences": 1337,
  "rating": 4.8,
  "capabilities": ["text-generation", "summarization", "translation"],
  "inputSchema": {
    "type": "object",
    "properties": {
      "prompt": {"type": "string"},
      "maxTokens": {"type": "number"}
    }
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "text": {"type": "string"},
      "confidence": {"type": "number"}
    }
  }
}
```

### Upload New Model
```http
POST /api/models
```

**Request Body:**
```json
{
  "name": "My Awesome Model",
  "description": "A revolutionary AI model",
  "category": "Computer Vision",
  "pricePerInference": 0.02,
  "modelFile": "base64_encoded_file",
  "inputSchema": {...},
  "outputSchema": {...}
}
```

### Execute Model Inference
```http
POST /api/models/:id/infer
```

**Request Body:**
```json
{
  "input": {
    "prompt": "Generate a story about space exploration",
    "maxTokens": 100
  },
  "paymentTxHash": "0xabc123..."
}
```

**Response:**
```json
{
  "output": {
    "text": "In the year 2157, humanity reached the stars...",
    "confidence": 0.95
  },
  "cost": 0.01,
  "executionTime": 1.2,
  "txHash": "0xdef456..."
}
```

## 🎨 Prompts API

### List All Prompts
```http
GET /api/prompts
```

**Response:**
```json
{
  "prompts": [
    {
      "id": 1,
      "title": "Creative Writing Prompts",
      "description": "100 unique prompts for creative writing",
      "category": "Writing",
      "price": 0.5,
      "creatorId": "0x123...",
      "salesCount": 42,
      "rating": 4.9,
      "previewContent": "Write a story about..."
    }
  ]
}
```

### Purchase Prompt NFT
```http
POST /api/prompts/:id/purchase
```

**Request Body:**
```json
{
  "buyerId": "0x123...",
  "paymentTxHash": "0xabc123..."
}
```

## 📊 Statistics API

### Get Platform Stats
```http
GET /api/stats
```

**Response:**
```json
{
  "totalModels": 156,
  "totalInferences": 12847,
  "totalUsers": 892,
  "aptDistributed": 1247.89,
  "topCategories": [
    {"name": "Language", "count": 45},
    {"name": "Computer Vision", "count": 38}
  ]
}
```

## 🏆 Leaderboard API

### Get Top Performers
```http
GET /api/leaderboard
```

**Query Parameters:**
- `type`: "creators" | "users" | "models"
- `timeframe`: "day" | "week" | "month" | "all"

## 🔧 Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Insufficient APT balance for inference",
    "details": {
      "required": 0.01,
      "available": 0.005
    }
  }
}
```

### Common Error Codes
- `WALLET_NOT_CONNECTED`: User wallet not connected
- `INSUFFICIENT_BALANCE`: Not enough APT for operation
- `MODEL_NOT_FOUND`: Requested model doesn't exist
- `INVALID_INPUT`: Input doesn't match model schema
- `RATE_LIMITED`: Too many requests

## 🚀 SDK Usage

### TypeScript SDK
```bash
npm install @aptosai-grid/sdk
```

```typescript
import { AptosAIGrid } from '@aptosai-grid/sdk';

const client = new AptosAIGrid({
  network: 'testnet',
  apiKey: 'your-api-key'
});

// Execute model inference
const result = await client.models.infer(1, {
  prompt: "Hello, world!"
});
```

## 📝 Rate Limits

- **Free Tier**: 100 requests/hour
- **Pro Tier**: 1,000 requests/hour
- **Enterprise**: Unlimited

## 🔗 Webhooks

Subscribe to real-time events:

```json
{
  "url": "https://your-app.com/webhooks",
  "events": ["model.inference", "prompt.purchased"],
  "secret": "your-webhook-secret"
}
```

## 🌐 GraphQL API

For advanced queries, use our GraphQL endpoint:

```graphql
query GetModels($category: String) {
  models(category: $category) {
    id
    name
    description
    pricePerInference
    owner {
      address
      reputation
    }
  }
}
```

---

Need help? Join our [Discord](https://discord.gg/aptosai) or check out our [GitHub](https://github.com/rohitjadhav07/AptosAiGrid)!