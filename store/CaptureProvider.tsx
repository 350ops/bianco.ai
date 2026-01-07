import React from 'react';

/**
 * Placeholder wrapper to match the demo API.
 * In this app we don't currently capture carousel screenshots, so this is a no-op.
 */
export function CaptureWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
