export interface Message {
  id: string
  type: 'ai' | 'user'
  content: string
  timestamp: string
}

export const messagesData: Message[] = []
