import React from 'react';
import { motion } from 'framer-motion';
export interface Tab {
  id: string;
  label: string;
  count?: number;
}
interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}
export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-border mb-8 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative pb-3 text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'text-endeavor-blue' : 'text-neutral-500 hover:text-neutral-800'}`}>
            
            {tab.label}
            {tab.count !== undefined &&
            <span className="ml-1.5 text-xs text-neutral-400 font-normal">
                {tab.count}
              </span>
            }
            {isActive &&
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-endeavor-blue"
              initial={false}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30
              }} />

            }
          </button>);

      })}
    </div>);

}