
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getBookmarks, getLikes } from '@/services/interactionService';
import { getArticleById } from '@/services/articleService';
import { NewsItem } from '@/components/NewsCard';

export function useUserArticles() {
  const { user } = useAuth();
  const userId = user?.id;

  // Fetch user's bookmarked articles
  const {
    data: bookmarks = [],
    isLoading: isLoadingBookmarks,
    isError: isErrorBookmarks,
  } = useQuery({
    queryKey: ['bookmarks', userId],
    queryFn: () => userId ? getBookmarks(userId) : [],
    enabled: !!userId
  });

  // Fetch user's liked articles
  const {
    data: likes = [],
    isLoading: isLoadingLikes,
    isError: isErrorLikes,
  } = useQuery({
    queryKey: ['likes', userId],
    queryFn: () => userId ? getLikes(null, userId) : [],
    enabled: !!userId
  });

  // Convert bookmarks to NewsItem format
  const {
    data: savedArticles = [],
    isLoading: isLoadingSaved,
    isError: isErrorSaved,
  } = useQuery({
    queryKey: ['articles', 'bookmarked', bookmarks],
    queryFn: async () => {
      if (!bookmarks.length) return [];
      
      const articles = await Promise.all(
        bookmarks.map(async (bookmark) => {
          try {
            const article = await getArticleById(bookmark.articleId);
            return {
              id: article.id,
              title: article.title,
              summary: article.summary || '',
              imageUrl: article.imageUrl || '',
              category: article.category,
              publishedDate: article.publishDate,
              author: article.author,
              slug: article.slug,
            } as NewsItem;
          } catch (error) {
            console.error(`Error fetching bookmarked article: ${bookmark.articleId}`, error);
            return null;
          }
        })
      );
      
      return articles.filter(Boolean) as NewsItem[];
    },
    enabled: bookmarks.length > 0
  });

  // Convert likes to NewsItem format
  const {
    data: likedArticles = [],
    isLoading: isLoadingLiked,
    isError: isErrorLiked,
  } = useQuery({
    queryKey: ['articles', 'liked', likes],
    queryFn: async () => {
      if (!likes.length) return [];
      
      const articles = await Promise.all(
        likes.map(async (like) => {
          try {
            const article = await getArticleById(like.articleId);
            return {
              id: article.id,
              title: article.title,
              summary: article.summary || '',
              imageUrl: article.imageUrl || '',
              category: article.category,
              publishedDate: article.publishDate,
              author: article.author,
              slug: article.slug,
            } as NewsItem;
          } catch (error) {
            console.error(`Error fetching liked article: ${like.articleId}`, error);
            return null;
          }
        })
      );
      
      return articles.filter(Boolean) as NewsItem[];
    },
    enabled: likes.length > 0
  });

  return {
    savedArticles,
    likedArticles,
    isLoading: isLoadingBookmarks || isLoadingLikes || isLoadingSaved || isLoadingLiked,
    isError: isErrorBookmarks || isErrorLikes || isErrorSaved || isErrorLiked
  };
}
