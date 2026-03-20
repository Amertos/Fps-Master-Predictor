'use client';

import { useState, useCallback, useEffect } from 'react';

interface UseToastReturn {
  toast: string;
  showToast: (message: string) => void;
}

/**
 * Displays an ephemeral toast notification that auto-dismisses after 3 seconds.
 */
export function useToast(): UseToastReturn {
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((message: string) => {
    setToast(message);
  }, []);

  return { toast, showToast };
}
