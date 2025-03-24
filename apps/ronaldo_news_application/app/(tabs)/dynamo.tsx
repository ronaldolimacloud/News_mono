import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import NewsListItem from '@/components/NewsListItem';
import { generateClient } from 'aws-amplify/data';

// Define types for our news data
type Author = {
  id: string;
  name: string;
};

type Publisher = {
  id: string;
  name: string;
};

type NewsItem = {
  id: string;
  title: string;
  body: string;
  image?: string;
  created_at?: string;
  authorId?: string;
  publisherId?: string;
  author: Author;
  publisher: Publisher;
};

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        // Use any type to avoid TypeScript errors with models
        const client: any = generateClient();
        
        // Check if the News model exists
        if (!client.models?.News) {
          throw new Error("News model not found in Amplify data models");
        }
        
        // Fetch news articles
        const newsResult = await client.models.News.list();
        const newsItems = newsResult.data || [];
        
        // Process each news item and fetch related data
        const formattedNews: NewsItem[] = [];
        
        for (const item of newsItems) {
          let author: Author = { id: item.authorId || "unknown", name: "Unknown Author" };
          let publisher: Publisher = { id: item.publisherId || "unknown", name: "Unknown Publisher" };
          
          // Fetch author details if we have an authorId
          if (item.authorId && client.models?.Author) {
            try {
              const authorResult = await client.models.Author.get({ id: item.authorId });
              if (authorResult.data) {
                author = { 
                  id: authorResult.data.id,
                  name: authorResult.data.name as string
                };
              }
            } catch (error) {
              console.error('Error fetching author:', error);
            }
          }
          
          // Fetch publisher details if we have a publisherId
          if (item.publisherId && client.models?.Publisher) {
            try {
              const publisherResult = await client.models.Publisher.get({ id: item.publisherId });
              if (publisherResult.data) {
                publisher = {
                  id: publisherResult.data.id,
                  name: publisherResult.data.name as string
                };
              }
            } catch (error) {
              console.error('Error fetching publisher:', error);
            }
          }
          
          // Create a formatted news item with all the related data
          formattedNews.push({
            id: item.id,
            title: item.title as string,
            body: item.body as string,
            image: item.image as string,
            created_at: item.created_at as string,
            authorId: item.authorId,
            publisherId: item.publisherId,
            author,
            publisher
          });
        }
        
        setNews(formattedNews);
      } catch (err: any) {
        console.error('Error fetching news:', err);
        setError(err.message || 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    }
    
    fetchNews();
  }, []);
  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }
  
  if (news.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text>No news articles found</Text>
      </View>
    );
  }
  
  return (
    <View>
      <FlatList 
        data={news} 
        renderItem={({item}) => <NewsListItem newsarticle={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
}
  
  
