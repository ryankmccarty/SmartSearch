import React from 'react';
import { TriangleAlert } from 'lucide-react';

export function EmergencyBanner() {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex items-start gap-3 px-4 py-3 border border-gray-200 rounded-xl"
    >
      <TriangleAlert className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" aria-hidden="true" />
      <p className="text-sm text-gray-700 leading-relaxed">
        If this is a medical emergency, call 911 or go to the nearest emergency room immediately.{' '}
        <a
          href="tel:911"
          className="font-semibold underline underline-offset-2 hover:text-gray-900 transition-colors"
        >
          Call 911
        </a>
      </p>
    </div>
  );
}
