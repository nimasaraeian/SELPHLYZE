"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { userTracker, aiMemory } from '@/utils/userContext';

export function useUserTracking() {
  const pathname = usePathname();
  const isInitialized = useRef(false);
  
  useEffect(() => {
    // Initialize user on first load
    if (!isInitialized.current) {
      userTracker.initializeUser();
      isInitialized.current = true;
    }

    // Track page visit
    userTracker.trackPageVisit(pathname);

    // Set up activity tracking
    const handleActivity = () => {
      userTracker.updateActivity();
    };

    const handleBeforeUnload = () => {
      userTracker.updateActivity();
    };

    // Track user activity
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  const trackAIConversation = (userMessage: string, aiResponse: string, context?: string) => {
    const user = userTracker.getCurrentUser();
    if (user) {
      aiMemory.saveConversation(user.userCode, userMessage, aiResponse, context || pathname);
    }
  };

  const trackSearch = (query: string, results: any[]) => {
    const user = userTracker.getCurrentUser();
    if (user) {
      aiMemory.saveSearch(user.userCode, query, results, pathname);
    }
  };

  const getUserContext = () => {
    return userTracker.getCurrentUser();
  };

  const getUserName = () => {
    return userTracker.getUserName();
  };

  const getUserFirstName = () => {
    return userTracker.getUserFirstName();
  };

  return {
    trackAIConversation,
    trackSearch,
    getUserContext,
    getUserName,
    getUserFirstName,
    isLoggedIn: userTracker.isUserLoggedIn()
  };
}
