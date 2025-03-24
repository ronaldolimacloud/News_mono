import { useState, useEffect } from 'react';
import { fetchNewsFromDynamoDB } from '../services/newsService';
import allNews from '@assets/data/allNews.json'; // Keep as fallback

export function useNews() {
  const [news, setNews] = useState(allNews); // Start with JSON data as initial state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        const newsData = await fetchNewsFromDynamoDB();
        setNews(newsData);
      } catch (err) {
        console.error('Error loading news from DynamoDB:', err);
        setError(err.message);
        // Keep using the JSON data if DynamoDB fetch fails
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, []);

  return { news, loading, error };
}