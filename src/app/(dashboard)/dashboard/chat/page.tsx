'use client'
import ChatInterface from '@/components/chat-interface';
import React from 'react';

const ChatPage = () => {
  return (
    <section className='flex h-full flex-1 min-h-0 bg-[#F9F9F9] overflow-hidden'>
      <ChatInterface />
    </section>
  );
};

export default ChatPage;
