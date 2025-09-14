// LLM Service for connecting to the deployed Cloud Function
interface LLMServiceConfig {
  baseUrl: string;
  apiKey?: string;
  timeout: number;
}

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  tools?: Record<string, unknown>[];
  context?: Record<string, unknown>;
}

interface FunctionCall {
  name: string;
  arguments: Record<string, unknown>;
}

interface ChatResponse {
  success: boolean;
  response: {
    type: 'text_response' | 'function_call';
    content?: string;
    function_call?: FunctionCall;
  };
  timestamp: string;
  error?: string;
}

export class LLMService {
  private config: LLMServiceConfig;

  constructor(config: LLMServiceConfig) {
    this.config = config;
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(this.config.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      return data;
    } catch (error) {
      console.error('LLM Service error:', error);
      throw new Error(`Failed to communicate with LLM service: ${error}`);
    }
  }

  async analyzeSentiment(text: string): Promise<unknown> {
    try {
      const response = await fetch(`${this.config.baseUrl}/analyze-sentiment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify({ text }),
        signal: AbortSignal.timeout(this.config.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      throw new Error(`Failed to analyze sentiment: ${error}`);
    }
  }

  async analyzePortfolio(portfolioData: Record<string, unknown>): Promise<unknown> {
    try {
      const response = await fetch(`${this.config.baseUrl}/analyze-portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify({ portfolio_data: portfolioData }),
        signal: AbortSignal.timeout(this.config.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Portfolio analysis error:', error);
      throw new Error(`Failed to analyze portfolio: ${error}`);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout for health check
      });

      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Create and export a configured instance
const llmService = new LLMService({
  baseUrl: process.env.NEXT_PUBLIC_LLM_SERVICE_URL || 'http://localhost:8080',
  apiKey: process.env.NEXT_PUBLIC_LLM_SERVICE_API_KEY,
  timeout: 30000 // 30 seconds
});

export default llmService;

// Enhanced agent orchestrator that uses the cloud LLM service
export class CloudAgentOrchestrator {
  private llmService: LLMService;

  constructor(llmService: LLMService) {
    this.llmService = llmService;
  }

  async processMessage(userMessage: string, context?: { previousMessages?: ChatMessage[] }): Promise<string> {
    try {
      // Prepare messages for the LLM service
      const messages: ChatMessage[] = [
        {
          role: 'user',
          content: userMessage
        }
      ];

      // Add context if available
      if (context?.previousMessages) {
        messages.unshift(...context.previousMessages);
      }

      // Get available tools schema
      const tools = this.getToolsSchema();

      // Send to cloud LLM service
      const response = await this.llmService.chat({
        messages,
        tools,
        context
      });

      if (!response.success) {
        throw new Error(response.error || 'LLM service returned an error');
      }

      // Handle different response types
      if (response.response.type === 'function_call') {
        // Execute the requested function and get results
        const functionResult = await this.executeFunctionCall(response.response.function_call!);
        
        // Send function result back to LLM for final response
        const followUpMessages: ChatMessage[] = [
          ...messages,
          {
            role: 'assistant',
            content: `I need to use the ${response.response.function_call!.name} tool to help answer your question.`
          },
          {
            role: 'function',
            content: JSON.stringify(functionResult)
          }
        ];

        const finalResponse = await this.llmService.chat({
          messages: followUpMessages,
          context
        });

        return finalResponse.response.content || 'I processed your request but couldn\'t generate a response.';
      } else {
        return response.response.content || 'I couldn\'t generate a response to your message.';
      }
    } catch (error) {
      console.error('Cloud agent error:', error);
      return `I apologize, but I encountered an error while processing your request: ${error}. Please try again.`;
    }
  }

  private getToolsSchema(): Record<string, unknown>[] {
    // Return the schema for available tools
    return [
      {
        name: 'web_search',
        description: 'Search the web for real-time information about markets, news, and financial data',
        schema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'The search query to execute' },
            maxResults: { type: 'number', description: 'Maximum number of results to return' },
            region: { type: 'string', description: 'Region to focus search on' }
          },
          required: ['query']
        }
      },
      {
        name: 'get_asset_prices',
        description: 'Fetch real-time prices for stocks, bonds, commodities, and other financial instruments',
        schema: {
          type: 'object',
          properties: {
            symbols: { type: 'array', items: { type: 'string' }, description: 'Asset symbols to fetch prices for' },
            region: { type: 'string', description: 'Region to focus on' },
            assetType: { type: 'string', enum: ['stock', 'bond', 'commodity', 'forex', 'crypto'] }
          },
          required: ['symbols']
        }
      },
      {
        name: 'analyze_market_sentiment',
        description: 'Analyze market sentiment from news, social media, and analyst reports',
        schema: {
          type: 'object',
          properties: {
            symbols: { type: 'array', items: { type: 'string' } },
            region: { type: 'string' },
            timeframe: { type: 'string', enum: ['1h', '24h', '7d', '30d'] }
          }
        }
      }
    ];
  }

  private async executeFunctionCall(functionCall: FunctionCall): Promise<unknown> {
    // This would execute the actual tool functions
    // For now, we'll return mock data since the tools are already implemented in the agent orchestrator
    const { name, arguments: args } = functionCall;

    switch (name) {
      case 'web_search':
        return {
          results: [
            {
              title: `${args.query} - Latest Market Analysis`,
              url: `https://example.com/search?q=${encodeURIComponent(args.query as string)}`,
              snippet: `Recent analysis shows significant movement in ${args.query} with key indicators pointing to potential opportunities.`
            }
          ]
        };
      
      case 'get_asset_prices':
        return {
          prices: (args.symbols as string[]).map((symbol: string) => ({
            symbol,
            price: 100 + Math.random() * 200,
            change: (Math.random() - 0.5) * 10,
            changePercent: (Math.random() - 0.5) * 5,
            lastUpdated: new Date().toISOString()
          }))
        };
      
      case 'analyze_market_sentiment':
        return {
          sentiment: 'bullish',
          confidence: 0.75,
          keyTopics: ['earnings', 'growth', 'market volatility'],
          riskFactors: ['market volatility', 'regulatory uncertainty']
        };
      
      default:
        return { error: `Unknown function: ${name}` };
    }
  }
}

// Export configured cloud agent
export const cloudAgentOrchestrator = new CloudAgentOrchestrator(llmService);
