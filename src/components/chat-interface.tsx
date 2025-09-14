'use client'

import { Message } from '@/lib/message-data'
import { useChatStore } from '@/store/useChatStore'
import llmService from '@/lib/services/llm-service'
import { cn } from '@/lib/utils'
import { Zap } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'
import { Input } from './ui/input'
import { Separator } from './ui/separator'

export default function ChatInterface() {
  const { messages, addMessage } = useChatStore()
  const [inputValue, setInputValue] = useState('')

  const handleSend = async () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: inputValue,
        timestamp: 'now',
      }
      addMessage(newMessage)
      setInputValue('')

      const typingMessage: Message = {
        id: `typing_${Date.now()}`,
        type: 'ai',
        content: 'Analyzing...',
        timestamp: 'now',
      }
      addMessage(typingMessage)

      try {
        const chatHistory = useChatStore.getState().messages.map(m => ({ role: m.type, content: m.content }));
        const response = await llmService.chat({ messages: chatHistory });

        const { messages } = useChatStore.getState()
        const filteredMessages = messages.filter(msg => msg.id !== typingMessage.id)
        useChatStore.setState({ messages: filteredMessages })

        if (response.success) {
          const aiResponse: Message = {
            id: Date.now().toString(),
            type: 'ai',
            content: response.response.content || 'No content received.',
            timestamp: 'now',
          }
          addMessage(aiResponse)
        } else {
          throw new Error(response.error || 'Unknown error');
        }
      } catch (error) {
        const { messages } = useChatStore.getState()
        const filteredMessages = messages.filter(msg => msg.id !== typingMessage.id)
        useChatStore.setState({ messages: filteredMessages })
        
        const errorResponse: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: `Error: ${error instanceof Error ? error.message : String(error)}`,
          timestamp: 'now',
        }
        addMessage(errorResponse)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <Card
        className={cn(
          'col-span-full border border-border flex flex-col gap-3 px-3 sm:px-4 rounded h-[20vh]',
          'lg:col-span-1 lg:h-auto'
        )}
      >
        <h4 className='font-semibold text-base sm:text-lg'>Quick Questions</h4>
        <Separator />
        <CardContent className='space-y-3 px-0'>
          <p className='text-sm sm:text-base'>What is your name?</p>
          <p className='text-sm sm:text-base'>What is your age?</p>
          <p className='text-sm sm:text-base'>What is your favorite color?</p>
        </CardContent>
      </Card>

      <Card
        className={cn(
          'col-span-full border border-border rounded px-3 sm:px-4 flex flex-col relative h-[50vh]',
          'lg:col-span-2 lg:h-auto'
        )}
      >
        <CardHeader className='flex items-center gap-2 sm:gap-3 h-3 lg:h-9 px-0 flex-shrink-0 bg-white border-b border-border'>
          <div className='flex justify-center items-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black p-1 text-white'>
            <Zap className='w-4 h-4 sm:w-5 sm:h-5' />
          </div>
          <h4 className='font-semibold text-base sm:text-lg'>Trade Advisor</h4>
        </CardHeader>

        <CardContent className='flex flex-col h-full p-0'>
          <div className='absolute inset-x-0 bottom-[70px] top-[50px] sm:top-[60px] overflow-y-auto px-2 sm:px-4 pt-4 sm:pt-5 pb-20 sm:pb-8 scrollbar-hide'>
            <div className='space-y-5 sm:space-y-6'>
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
                    <p className='text-sm leading-relaxed'>{message.content}</p>
                    <span className='text-xs text-muted-foreground'>
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-background'>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Ask about your portfolio, market conditions, or trading strategy...'
              className='h-11 sm:h-12 w-full rounded-3xl pr-14 sm:pr-15 placeholder:text-xs sm:placeholder:text-sm bg-muted'
            />
            <Button
              onClick={handleSend}
              className='absolute right-6 sm:right-7 top-1/2 transform -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 px-3 sm:px-4 rounded-full'
            >
              <Zap className='w-3 h-3 sm:w-4 sm:h-4' />
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
