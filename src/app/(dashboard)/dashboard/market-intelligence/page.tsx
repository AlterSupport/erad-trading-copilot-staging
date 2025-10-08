'use client'
import MarketIntelligence from '@/components/market-intelligence';
import PriceAlert from '@/components/price-alert';
import React from 'react';

const MarketIntelligencePage = () => {
  return (
    <section className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
      <div className='col-span-full lg:col-span-2 space-y-5'>
        <MarketIntelligence />
      </div>
      <div className='col-span-full lg:col-span-1 space-y-5'>
        <PriceAlert />
      </div>
    </section>
  );
};

export default MarketIntelligencePage;
