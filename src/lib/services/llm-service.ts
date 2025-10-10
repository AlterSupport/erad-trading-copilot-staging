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

interface FulfillmentMessage {
  text: {
    text: string[];
  };
}

interface ChatResponse {
  intent: string;
  entities: Record<string, unknown>;
  fulfillmentText: string;
  fulfillmentMessages?: FulfillmentMessage[];
}

export class LLMService {
  private config: LLMServiceConfig;

  constructor(config: LLMServiceConfig) {
    this.config = config;
  }

  async chat(currentUserInput: string, chatHistory: ChatMessage[]): Promise<ChatResponse> {
    try {
      const response = await fetch(this.config.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'x-api-key': this.config.apiKey })
        },
        body: JSON.stringify({ currentUserInput, chatHistory }),
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
}

// Create and export a configured instance
const llmService = new LLMService({
  baseUrl: process.env.NEXT_PUBLIC_NLU_FUNCTION_URL || '',
  apiKey: process.env.NEXT_PUBLIC_LLM_SERVICE_API_KEY,
  timeout: Number(process.env.NEXT_PUBLIC_LLM_SERVICE_TIMEOUT_MS || 120000) // default: 120 seconds
});

export default llmService;
