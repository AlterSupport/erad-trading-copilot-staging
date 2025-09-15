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
      "Hello! I've analyzed your blotter and found a significant concentration in European corporate bonds. Your portfolio has a 45% allocation to the financial sector. Would you like me to elaborate on your risk exposure?",
    timestamp: '2 min ago',
  },
  {
    id: '2',
    type: 'user',
    content:
      'Yes, tell me more about my exposure to the financial sector and any associated risks.',
    timestamp: '2 min ago',
  },
  {
    id: '3',
    type: 'ai',
    content:
      'Your holdings are concentrated in Societe Generale (15%) and Deutsche Bank (12%). Recent ECB policy shifts could impact these positions. I recommend monitoring for any statements on interest rate adjustments.',
    timestamp: '2 min ago',
  },
]
