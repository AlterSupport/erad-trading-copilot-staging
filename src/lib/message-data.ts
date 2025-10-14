export interface Message {
  id: string
  type: 'ai' | 'user'
  content: string
  timestamp: string
  isTyping?: boolean
}

export const messagesData: Message[] = []
