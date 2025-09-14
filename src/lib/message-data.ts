export interface Message {
  id: string
  type: 'ai' | 'user'
  content: string
  timestamp: string
}

export const messagesData: Message[] = [
  {
    id: '1',
    type: 'ai',
    content:
      "Hello! I've analyzed your blotter and found some interesting patterns. Your portfolio shows a 25% concentration in tech stocks. Would you like me to elaborate on your risk exposure",
    timestamp: '2 min ago',
  },
  {
    id: '2',
    type: 'user',
    content:
      'Yes, tell me about my tech exposure and any risks I should be aware of',
    timestamp: '2 min ago',
  },
  {
    id: '3',
    type: 'ai',
    content:
      'Based on your holdings, you have significant exposure to AAPL (8.2%), MSFT (7.1%). Recent semiconductor restrictions announced today could impact NVDA specifically. I recommend monitoring these positions closely',
    timestamp: '2 min ago',
  },
]
