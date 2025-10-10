'use client'

import { Message } from '@/lib/message-data'
import { useChatStore } from '@/store/useChatStore'
import llmService from '@/lib/services/llm-service'
import { cn } from '@/lib/utils'
import { Zap } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'
import { Input } from './ui/input'
import { Separator } from './ui/separator'

export default function ChatInterface() {
  const { messages, addMessage } = useChatStore()
  const [inputValue, setInputValue] = useState('')
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const chatHistory = useChatStore
      .getState()
      .messages.map((m) => ({
        role: m.type === 'ai' ? 'model' : 'user',
        content: m.content,
      }))

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content,
      timestamp: 'now',
    }
    addMessage(newMessage)

    const typingMessage: Message = {
      id: `typing_${Date.now()}`,
      type: 'ai',
      content: 'Analyzing...',
      timestamp: 'now',
    }
    addMessage(typingMessage)

    try {
      const response = await llmService.chat(content, chatHistory)

      const { messages } = useChatStore.getState()
      const filteredMessages = messages.filter(
        (msg) => msg.id !== typingMessage.id
      )
      useChatStore.setState({ messages: filteredMessages })

      const aiResponse: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: response.fulfillmentText || 'No content received.',
        timestamp: 'now',
      }
      addMessage(aiResponse)
    } catch (error) {
      const { messages } = useChatStore.getState()
      const filteredMessages = messages.filter(
        (msg) => msg.id !== typingMessage.id
      )
      useChatStore.setState({ messages: filteredMessages })

      const errorResponse: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `Error: ${
          error instanceof Error ? error.message : String(error)
        }`,
        timestamp: 'now',
      }
      addMessage(errorResponse)
    }
  }

  const handleSend = async () => {
    await sendMessage(inputValue)
    setInputValue('')
  }

  const handleQuickQuestionClick = async (question: string) => {
    await sendMessage(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className='flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:grid lg:grid-cols-3 lg:gap-6'>
      <Card className='border border-border rounded-lg bg-white lg:col-span-1 lg:sticky lg:top-24'>
        <CardHeader className='px-4 pt-4 pb-3'>
          <h4 className='font-semibold text-base sm:text-lg'>Quick Questions</h4>
        </CardHeader>
        <Separator className='mx-4' />
        <CardContent className='flex flex-col gap-3 px-4 py-4'>
          {[
            'Summarize the key risks in my blotter.',
            'What are the latest trends in the European bond market?',
            'Show me the price for the US 10-Year Treasury.',
          ].map((question) => (
            <Card
              key={question}
              className='cursor-pointer border border-transparent hover:border-border transition-colors'
              onClick={() => handleQuickQuestionClick(question)}
            >
              <CardContent className='px-3 py-2'>
                <p className='text-sm sm:text-base'>{question}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card className='border border-border rounded-lg bg-white flex flex-col min-h-[60vh] lg:col-span-2'>
        <CardHeader className='flex flex-row items-center gap-2 sm:gap-3 px-4 py-4 border-b border-border'>
          <div className='flex justify-center items-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black p-1 text-white'>
            <Zap className='w-4 h-4 sm:w-5 sm:h-5' />
          </div>
          <h4 className='font-semibold text-base sm:text-lg'>Trade Advisor</h4>
        </CardHeader>

        <CardContent className='flex flex-col flex-1 px-0'>
          <div
            ref={chatContainerRef}
            className='flex-1 overflow-y-auto px-4 py-4 sm:py-5 space-y-5 sm:space-y-6 scrollbar-hide'
          >
            {messages.map((message) => (
              <div key={message.id} className='flex gap-2 sm:gap-3'>
                {message.type === 'ai' && (
                  <div className='flex justify-center items-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black p-1 text-white flex-shrink-0'>
                    <Zap className='w-3 h-3 sm:w-4 sm:h-4' />
                  </div>
                )}
                <div
                  className={cn(
                    'w-[85%] sm:w-4/5 space-y-1',
                    message.type === 'user' &&
                      'bg-muted rounded-lg p-2 sm:p-3 inline-block ring ring-border ml-auto'
                  )}
                >
                  <div className='text-sm leading-relaxed'>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  <span className='text-xs text-muted-foreground'>
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className='border-t border-border px-3 sm:px-4 py-3 sm:py-4 bg-background/80'>
            <div className='relative flex items-center'>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Ask about your portfolio, market conditions, or trading strategy...'
                className='h-11 sm:h-12 w-full rounded-3xl pr-14 sm:pr-20 placeholder:text-xs sm:placeholder:text-sm bg-muted'
              />
              <Button
                onClick={handleSend}
                className='absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 rounded-full'
              >
                <Zap className='w-3 h-3 sm:w-4 sm:h-4' />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
