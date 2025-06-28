import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useSpotifyToken() {
  const { data: session } = useSession();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        setIsLoading(true);
        
        // Get token from next-auth session
        if (session?.accessToken) {
          setAccessToken(session.accessToken);
        } else {
          throw new Error('No Spotify access token available');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get Spotify token'));
        console.error('Error getting Spotify token:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      getToken();
    }
  }, [session]);

  return { accessToken, isLoading, error };
}

export default useSpotifyToken;