'use client'
import ChatInterface from '@/components/chat-interface';
import React from 'react';

const ChatPage = () => {
  return (
    <section className='flex h-full min-h-0 flex-1 overflow-hidden bg-background'>
      <ChatInterface />
    </section>
  );
};

export default ChatPage;
