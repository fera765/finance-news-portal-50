
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  likeArticle, 
  unlikeArticle, 
  checkIfLiked,
  bookmarkArticle, 
  removeBookmark, 
  checkIfBookmarked 
} from '@/services/interactionService';
import { trackArticleView } from '@/services/articleService';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export function useArticleInteractions(articleId: string | undefined) {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Track article view
  useEffect(() => {
    const trackView = async () => {
      if (articleId) {
        try {
          // Only track view once per session
          const viewKey = `article-${articleId}-viewed`;
          if (!sessionStorage.getItem(viewKey)) {
            await trackArticleView(articleId);
            sessionStorage.setItem(viewKey, 'true');
          }
        } catch (error) {
          console.error('Error tracking view:', error);
        }
      }
    };

    trackView();
  }, [articleId]);

  // Check if article is liked
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (articleId && userId) {
        try {
          const liked = await checkIfLiked(articleId, userId);
          setIsLiked(liked);
        } catch (error) {
          console.error('Error checking like status:', error);
        }
      }
    };

    checkLikeStatus();
  }, [articleId, userId]);

  // Check if article is bookmarked
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (articleId && userId) {
        try {
          const bookmarked = await checkIfBookmarked(articleId, userId);
          setIsBookmarked(bookmarked);
        } catch (error) {
          console.error('Error checking bookmark status:', error);
        }
      }
    };

    checkBookmarkStatus();
  }, [articleId, userId]);

  // Like/unlike mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      if (!articleId) throw new Error('No article selected');
      
      if (isLiked) {
        await unlikeArticle(articleId, userId);
        return false;
      } else {
        await likeArticle(articleId, userId);
        return true;
      }
    },
    onSuccess: (newLikedState) => {
      setIsLiked(newLikedState);
      toast(newLikedState ? 'Article liked' : 'Article unliked');
      queryClient.invalidateQueries({ queryKey: ['likes', articleId] });
    },
    onError: (error) => {
      toast.error('Failed to update like status');
      console.error('Like error:', error);
    }
  });

  // Bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      if (!articleId) throw new Error('No article selected');
      
      if (isBookmarked) {
        await removeBookmark(articleId, userId);
        return false;
      } else {
        await bookmarkArticle(articleId, userId);
        return true;
      }
    },
    onSuccess: (newBookmarkedState) => {
      setIsBookmarked(newBookmarkedState);
      toast(newBookmarkedState ? 'Article bookmarked' : 'Bookmark removed');
      queryClient.invalidateQueries({ queryKey: ['bookmarks', userId] });
    },
    onError: () => {
      toast.error('Failed to update bookmark');
    }
  });

  const handleLike = () => {
    if (!user) return false;
    likeMutation.mutate();
    return true;
  };

  const handleBookmark = () => {
    if (!user) return false;
    bookmarkMutation.mutate();
    return true;
  };

  return {
    isLiked,
    isBookmarked,
    handleLike,
    handleBookmark,
    likeLoading: likeMutation.isPending,
    bookmarkLoading: bookmarkMutation.isPending
  };
}
