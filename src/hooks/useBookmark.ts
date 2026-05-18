import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export const useBookmark = (postId: string) => {
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session || !postId) return;
    axios
      .get(`/api/favorites?postId=${encodeURIComponent(postId)}`)
      .then(res => setIsBookmarked(res.data.bookmarked))
      .catch(() => {});
  }, [postId, session]);

  const toggleBookmark = async () => {
    if (!session || isLoading) return;
    setIsLoading(true);
    const optimistic = !isBookmarked;
    setIsBookmarked(optimistic);
    try {
      const res = await axios.post('/api/favorites', { postId });
      setIsBookmarked(res.data.bookmarked);
    } catch {
      setIsBookmarked(!optimistic);
    } finally {
      setIsLoading(false);
    }
  };

  return { isBookmarked, toggleBookmark, isLoading };
};
