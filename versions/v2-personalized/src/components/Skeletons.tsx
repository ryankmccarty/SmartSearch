import React from 'react';
import { motion } from 'framer-motion';
export function AnswerSkeleton() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="w-full max-w-3xl mx-auto border border-border rounded-2xl bg-surface overflow-hidden">
      
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded-full bg-neutral-200 animate-pulse" />
          <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-neutral-200 rounded animate-pulse" />
          <div className="h-4 w-11/12 bg-neutral-200 rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-neutral-200 rounded animate-pulse" />
        </div>
        <div className="flex gap-2 pt-4">
          <div className="h-8 w-24 bg-neutral-200 rounded-full animate-pulse" />
          <div className="h-8 w-32 bg-neutral-200 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="bg-neutral-50 border-t border-border p-4 flex justify-end">
        <div className="h-10 w-32 bg-neutral-200 rounded-full animate-pulse" />
      </div>
    </motion.div>);

}
export function ResultSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto py-6 border-b border-border space-y-3">
      <div className="h-5 w-64 bg-neutral-200 rounded animate-pulse" />
      <div className="h-4 w-48 bg-neutral-100 rounded animate-pulse" />
      <div className="space-y-2 pt-2">
        <div className="h-4 w-full bg-neutral-100 rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-neutral-100 rounded animate-pulse" />
      </div>
    </div>);

}
export function ResultsListSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <ResultSkeleton />
      <ResultSkeleton />
      <ResultSkeleton />
    </div>);

}