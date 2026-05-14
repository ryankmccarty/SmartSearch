import React from 'react';
import { TriangleAlert, Phone } from 'lucide-react';

export function EmergencyBanner() {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex items-start gap-3 px-4 py-3.5 bg-red-50 border border-red-200 rounded-xl mb-6"
    >
      <TriangleAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-red-800">
          If this is a medical emergency, call 911 or go to the nearest emergency room immediately.
        </p>
        <p className="text-xs text-red-600 mt-0.5">Do not wait — do not drive yourself.</p>
      </div>
      <a
        href="tel:911"
        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-full text-xs font-bold hover:bg-red-700 transition-colors"
      >
        <Phone className="w-3.5 h-3.5" aria-hidden="true" />
        Call 911
      </a>
    </div>
  );
}
