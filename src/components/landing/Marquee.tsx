
'use client';

import React from 'react';
import './marquee.css';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  variant?: 'red' | 'black';
}

const Marquee = ({ variant = 'red' }: MarqueeProps) => {
  const items = [
    "Jiu-Jitsu For Everyone",
    "Brazilian Jiu-Jitsu",
    "Gracie Barra Legacy",
    "Master the Art",
    "Self Defense Protocol",
    "Brotherhood in Arms",
    "Join the Team"
  ];

  const renderContent = () => (
    <ul className="marquee__content">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <li className="marquee__text">{item.toUpperCase()}</li>
          <li className="marquee__logo">
            <Zap className="h-6 w-6 fill-current text-white" />
          </li>
        </React.Fragment>
      ))}
    </ul>
  );

  return (
    <div className={cn("marquee_container", variant === 'black' ? "bg-black" : "bg-red")}>
      <div id="motto">
        <div className="mq-container">
          <div className="marquee enable-animation">
            {renderContent()}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marquee;
