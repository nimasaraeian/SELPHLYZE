"use client";

import { useUserTracking } from '@/hooks/useUserTracking';

export default function UserTrackingProvider({ children }: { children: React.ReactNode }) {
  // Initialize user tracking
  useUserTracking();
  
  return <>{children}</>;
}
