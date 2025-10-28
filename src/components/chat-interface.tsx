'use client'

import { Message } from '@/lib/message-data'
import { useChatStore } from '@/store/useChatStore'
import llmService, { BlotterAttachmentPayload } from '@/lib/services/llm-service'
import { cn } from '@/lib/utils'
import { Zap, Paperclip, X } from 'lucide-react'
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

const PLACEHOLDER_TIPS = [
  'Ask for a pricing check on the US 10Y Treasury.',
  'Summarize today’s blotter-level risk drivers.',
  'Stress test the portfolio for a 75 bps rates shock.',
  'Find issuance opportunities that match my mandate.',
]

const ALLOWED_ATTACHMENT_TYPES = ['csv', 'xlsx', 'json']
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024 // 10 MB

const TypingIndicator = () => (
  <div
    className='flex items-center gap-2 text-sm text-muted-foreground'
    role='status'
    aria-live='polite'
  >
    <span className='sr-only'>Assistant is typing</span>
    <div className='flex items-center gap-1'>
      <span
        className='h-2.5 w-2.5 animate-bounce rounded-full bg-primary opacity-80'
        style={{ animationDelay: '0ms' }}
      />
      <span
        className='h-2.5 w-2.5 animate-bounce rounded-full bg-primary opacity-80'
        style={{ animationDelay: '150ms' }}
      />
      <span
        className='h-2.5 w-2.5 animate-bounce rounded-full bg-primary opacity-80'
        style={{ animationDelay: '300ms' }}
      />
    </div>
  </div>
)

const MAX_MESSAGES_BEFORE_RESET = 20

const markdownComponents: Components = {
  a: ({ node, ...props }) => (
    <a
      {...props}
      target='_blank'
      rel='noopener noreferrer'
      className='text-primary underline break-words hover:text-primary/80'
    />
  ),
}

export default function ChatInterface() {
  const { messages, addMessage, clearMessages } = useChatStore()
  const [inputValue, setInputValue] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [selectedAttachment, setSelectedAttachment] = useState<File | null>(null)
  const [attachmentError, setAttachmentError] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const bottomMarkerRef = useRef<HTMLDivElement>(null)
  const isInitialScroll = useRef(true)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useLayoutEffect(() => {
    const node = chatContainerRef.current
    const bottomMarker = bottomMarkerRef.current

    if (!node || !bottomMarker) {
      return
    }

    const scrollToBottom = (behavior: ScrollBehavior) => {
      node.scrollTo({
        top: node.scrollHeight,
        behavior,
      })
      bottomMarker.scrollIntoView({
        behavior,
        block: 'end',
      })
      window.requestAnimationFrame(() => {
        window.scrollTo({
          top:
            window.document.documentElement.scrollHeight ||
            window.document.body.scrollHeight,
          behavior,
        })
      })
    }

    const behavior = isInitialScroll.current ? 'auto' : 'smooth'
    scrollToBottom(behavior)

    const timeoutId = window.setTimeout(() => scrollToBottom('auto'), 60)
    isInitialScroll.current = false

    return () => window.clearTimeout(timeoutId)
  }, [messages])

  useEffect(() => {
    if (PLACEHOLDER_TIPS.length <= 1) return
    if (inputValue.trim()) return

    const interval = window.setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_TIPS.length)
    }, 6000)

    return () => window.clearInterval(interval)
  }, [inputValue])

  const validateAttachment = (file: File): string | null => {
    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    if (!ALLOWED_ATTACHMENT_TYPES.includes(extension)) {
      return 'Unsupported file type. Please upload CSV, XLSX, or JSON.'
    }
    if (file.size > MAX_ATTACHMENT_BYTES) {
      return 'File size exceeds the 10 MB limit.'
    }
    return null
  }

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result
        if (!result || typeof result !== 'string') {
          reject(new Error('Failed to read file.'))
          return
        }
        const base64 = result.includes(',') ? result.split(',')[1] : result
        resolve(base64)
      }
      reader.onerror = () => reject(reader.error ?? new Error('Failed to read file.'))
      reader.readAsDataURL(file)
    })
  }

  const clearAttachment = () => {
    setSelectedAttachment(null)
    setAttachmentError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const error = validateAttachment(file)
    if (error) {
      setAttachmentError(error)
      setSelectedAttachment(null)
      event.target.value = ''
      return
    }

    setAttachmentError(null)
    setSelectedAttachment(file)
  }

  const handleAttachmentButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveAttachment = () => {
    clearAttachment()
  }

  const sendMessage = async (content: string): Promise<boolean> => {
    if (!content.trim() && !selectedAttachment) return false

    let blotterAttachment: BlotterAttachmentPayload | undefined
    if (selectedAttachment) {
      try {
        const base64 = await readFileAsBase64(selectedAttachment)
        const fileType = selectedAttachment.name.split('.').pop()?.toLowerCase() || ''
        blotterAttachment = {
          fileName: selectedAttachment.name,
          fileType,
          fileContent: base64,
        }
      } catch (error) {
        console.error('Failed to prepare attachment:', error)
        setAttachmentError('Failed to read the attachment. Please try again.')
        return false
      }
    }

    const chatHistory = useChatStore
      .getState()
      .messages.map((m) => ({
        role: m.type === 'ai' ? 'model' : 'user',
        content: m.content,
      }))

    const nonTypingCount = messages.filter((m) => !m.isTyping).length
    if (nonTypingCount >= MAX_MESSAGES_BEFORE_RESET) return false
    const displayContent = selectedAttachment
      ? `${content}\n\n[Attached blotter: ${selectedAttachment.name}]`
      : content

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: displayContent,
      timestamp: 'now',
    }
    addMessage(newMessage)

    const typingMessage: Message = {
      id: `typing_${Date.now()}`,
      type: 'ai',
      content: '',
      timestamp: 'now',
      isTyping: true,
    }
    addMessage(typingMessage)

    try {
      const response = await llmService.chat(content, chatHistory, blotterAttachment)

      const { messages } = useChatStore.getState()
      const filteredMessages = messages.filter(
        (msg) => msg.id !== typingMessage.id
      )
      useChatStore.setState({ messages: filteredMessages })

      if (selectedAttachment) {
        clearAttachment()
      }

      const aiResponse: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: response.fulfillmentText || 'No content received.',
        timestamp: 'now',
      }
      addMessage(aiResponse)
      return true
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
      return false
    }
  }

  const handleSend = async () => {
    const nonTypingCount = messages.filter((m) => !m.isTyping).length
    if (nonTypingCount >= MAX_MESSAGES_BEFORE_RESET) return

    const sent = await sendMessage(inputValue)
    if (sent) {
      setInputValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputValue.trim() && !selectedAttachment) return
    await handleSend()
  }

  const activePlaceholder =
    PLACEHOLDER_TIPS[placeholderIndex] ||
    'Ask for a pricing check, risk recap, or trade idea...'

  const nonTypingCount = messages.filter((m) => !m.isTyping).length
  const reachedMessageLimit = nonTypingCount >= MAX_MESSAGES_BEFORE_RESET

  const handleResetChat = () => {
    clearMessages()
    setInputValue('')
    isInitialScroll.current = true
    clearAttachment()
  }

  return (
    <div className='flex h-full min-h-0 w-full flex-1 items-stretch justify-center overflow-hidden bg-muted/40 px-4 py-6 dark:bg-background sm:px-8'>
      <div className='flex h-full max-h-full min-h-0 w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-border/60 bg-card text-foreground shadow-xl'>
        <div className='flex h-full min-h-0 flex-col overflow-hidden'>
          <header className='flex flex-col gap-4 border-b border-border/60 bg-muted/30 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-6'>
            <div className='flex items-center gap-3 sm:gap-4'>
              <div className='relative flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 sm:h-14 sm:w-14'>
                <Zap className='h-5 w-5 text-primary' />
                <span className='absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-muted/30 bg-emerald-400'></span>
              </div>
              <div>
                <p className='text-lg font-semibold sm:text-xl'>Trade Advisor</p>
                <p className='text-xs text-muted-foreground sm:text-sm'>
                  Ask about markets, manage blotter risk, or ideate trades in seconds.
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3 text-xs text-muted-foreground sm:text-sm'>
            <div className='flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1'>
                <span className='h-2 w-2 rounded-full bg-emerald-400 animate-pulse'></span>
                <span>Realtime reasoning</span>
              </div>
            </div>
          </header>

          <div className='flex flex-1 min-h-0 flex-col'>
            <div
              ref={chatContainerRef}
              className='flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-10 sm:py-8'
            >
              {messages.length === 0 && (
                <div className='flex h-full flex-col items-center justify-center gap-4 text-center text-sm text-muted-foreground sm:text-base'>
                  <div className='flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/50'>
                    <Zap className='h-6 w-6 text-primary' />
                  </div>
                  <div className='space-y-2'>
                    <p className='text-lg font-semibold text-foreground'>
                      Start a smarter conversation
                    </p>
                    <p className='mx-auto max-w-sm text-xs text-muted-foreground sm:text-sm'>
                      Ask about markets, surface portfolio risks, or co-build a strategy. Try asking for a pricing check or a hedge idea to begin.
                    </p>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex w-full items-start gap-3 sm:gap-4',
                    message.type === 'user' && 'flex-row-reverse text-right'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-xs font-semibold uppercase text-muted-foreground sm:h-10 sm:w-10',
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-primary/10 text-primary'
                    )}
                  >
                    {message.type === 'user' ? 'You' : <Zap className='h-4 w-4' />}
                  </div>
                  <div
                    className={cn(
                      'relative max-w-[85%] rounded-3xl px-5 py-4 text-sm leading-relaxed shadow-sm sm:max-w-[70%] sm:text-base',
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border/60 bg-muted/40 text-foreground'
                    )}
                  >
                    {message.isTyping ? (
                      <TypingIndicator />
                    ) : (
                      <div
                        className={cn(
                          'prose prose-sm max-w-none text-current sm:prose-base',
                          'prose-headings:font-semibold prose-headings:text-current prose-p:leading-relaxed prose-strong:text-current prose-a:text-primary'
                        )}
                      >
                        <ReactMarkdown components={markdownComponents}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                    <span
                      className={cn(
                        'mt-3 block text-[11px] font-medium tracking-wide uppercase',
                        message.type === 'user'
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      )}
                    >
                      {message.isTyping ? 'Thinking…' : message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={bottomMarkerRef} aria-hidden='true' />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className='border-t border-border/60 bg-muted/20 px-5 py-5 sm:px-10 sm:py-6'
          >
            {reachedMessageLimit && (
              <div className='mb-4 flex flex-col gap-3 rounded-2xl border border-amber-400/60 bg-amber-50 px-4 py-3 text-center text-xs text-amber-800 shadow sm:flex-row sm:items-center sm:justify-between sm:text-sm'>
                <div className='font-medium'>
                  Conversation is getting long. Start a fresh chat to keep answers sharp.
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleResetChat}
                  className='border-amber-400 text-amber-900 hover:bg-amber-100'
                  type='button'
                >
                  Refresh chat
                </Button>
              </div>
            )}

            <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4'>
              <div className='w-full rounded-2xl border border-border/60 bg-background px-4 py-3 shadow-inner focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/60'>
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={activePlaceholder}
                  className='h-24 min-h-[96px] border-0 bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 sm:h-24 sm:text-base'
                />
                <div className='mt-3 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm'>
                  <div className='flex items-center gap-2'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={handleAttachmentButtonClick}
                      className='gap-2 px-3'
                    >
                      <Paperclip className='h-4 w-4' /> Attach blotter
                    </Button>
                    {selectedAttachment && (
                      <div className='flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1 text-muted-foreground'>
                        <span className='max-w-[160px] truncate'>{selectedAttachment.name}</span>
                        <button
                          type='button'
                          onClick={handleRemoveAttachment}
                          className='text-muted-foreground transition hover:text-foreground'
                        >
                          <X className='h-3.5 w-3.5' />
                        </button>
                      </div>
                    )}
                  </div>
                  {attachmentError && (
                    <p className='text-destructive'>{attachmentError}</p>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='.csv,.xlsx,.json'
                  onChange={handleAttachmentChange}
                  className='hidden'
                />
              </div>
              <Button
                type='submit'
                disabled={(!inputValue.trim() && !selectedAttachment) || reachedMessageLimit}
                className='w-full rounded-2xl px-6 py-3 text-base font-semibold sm:w-auto'
              >
                Send
              </Button>
            </div>
            <p className='mt-2 text-[11px] text-muted-foreground sm:mt-3'>
              {reachedMessageLimit
                ? 'Reset the conversation to continue.'
                : 'Enter to send • Shift + Enter for a new line • Attach CSV/XLSX/JSON for blotter analysis'}
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
