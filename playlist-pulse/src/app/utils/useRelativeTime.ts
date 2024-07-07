// utils/useRelativeTime.ts
import { useState, useEffect } from 'react';
import { formatDistanceToNow, isValid } from 'date-fns';

export function useRelativeTime(dateString: string) {
  const [relativeTime, setRelativeTime] = useState('');

  useEffect(() => {
    function updateRelativeTime() {
      const date = new Date(dateString);
      if (isValid(date)) {
        setRelativeTime(formatDistanceToNow(date, { addSuffix: true }));
      } else {
        setRelativeTime('Invalid date');
      }
    }

    updateRelativeTime();
    const intervalId = setInterval(updateRelativeTime, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [dateString]);

  return relativeTime;
}