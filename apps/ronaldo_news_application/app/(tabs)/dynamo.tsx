import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import NewsListItem from '@/components/NewsListItem';
import { generateClient } from 'aws-amplify/data';
import { getUrl } from 'aws-amplify/storage';

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

// Define subscription payload type
type SubscriptionPayload = {
  data: {
    id: string;
    [key: string]: any;
  } | null;
  [key: string]: any;
};

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to format news data with author and publisher details
  async function formatNewsData(client: any, newsItems: any[]) {
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
      
      // Handle image URL using Amplify Storage
      let imageUrl = '';
      const DEFAULT_IMAGE = 'https://amplify-mysharedbackend-r-newsportalstoragebucket5-bwr4e6vcufol.s3.ap-southeast-2.amazonaws.com/public/comets_logo_small.png';
      
      if (item.image) {
        try {
          // Check if the image is already a full URL
          if (item.image.startsWith('http')) {
            // Use the URL directly
            imageUrl = item.image;
            console.log('Using image URL directly:', imageUrl);
          } else {
            // Remove any 'public/' prefix if it exists since getUrl expects the key without it
            let imageKey = item.image;
            if (imageKey.startsWith('public/')) {
              imageKey = imageKey.substring(7); // Remove 'public/' prefix
            }
            
            // Get the signed URL from S3
            const result = await getUrl({
              key: imageKey,
              options: {
                expiresIn: 3600 // URL expires in 1 hour
              }
            });
            
            imageUrl = result.url.toString();
            console.log('Retrieved S3 image URL:', imageUrl);
          }
        } catch (error) {
          console.error('Error getting image URL from S3:', error);
          // Use default image if there's an error
          imageUrl = DEFAULT_IMAGE;
        }
      } else {
        // Use default image if no image is specified
        imageUrl = DEFAULT_IMAGE;
      }
      
      console.log('Processed image URL:', {
        original: item.image,
        processed: imageUrl
      });
      
      // Create a formatted news item with all the related data
      formattedNews.push({
        id: item.id,
        title: item.title as string,
        body: item.body as string,
        image: imageUrl,
        created_at: item.created_at as string || new Date().toISOString(),
        authorId: item.authorId,
        publisherId: item.publisherId,
        author,
        publisher
      });
    }
    
    return formattedNews;
  }

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        
        // Use any type to avoid TypeScript errors with models
        const client: any = generateClient();
        
        // Check if the News model exists
        if (!client.models?.News) {
          throw new Error("News model not found in Amplify data models");
        }
        
        // Initial fetch of news articles
        const newsResult = await client.models.News.list();
        const newsItems = newsResult.data || [];
        
        console.log('Initial news items:', newsItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          image: item.image
        })));
        
        // Process and format the initial data
        const formattedNews = await formatNewsData(client, newsItems);
        console.log('Formatted news items with images:', formattedNews.map(item => ({
          id: item.id,
          title: item.title,
          image: item.image,
          imageType: typeof item.image
        })));
        setNews(formattedNews);
        setLoading(false);
        
        // Subscribe to new news articles (onCreate)
        const createSubscription = client.models.News.onCreate().subscribe({
          next: async (payload: SubscriptionPayload) => {
            console.log('New article created:', payload);
            
            // Get the new item data
            if (payload && payload.data) {
              // Fetch the complete news item with relations
              const newItem = await client.models.News.get({
                id: payload.data.id
              });
              
              if (newItem.data) {
                // Format the new item
                const formattedItem = await formatNewsData(client, [newItem.data]);
                
                // Add the new item to the news list
                setNews(currentNews => [...currentNews, ...formattedItem]);
              }
            }
          },
          error: (error: Error) => {
            console.error('Create subscription error:', error);
          }
        });
        
        // Subscribe to updated news articles (onUpdate)
        const updateSubscription = client.models.News.onUpdate().subscribe({
          next: async (payload: SubscriptionPayload) => {
            console.log('Article updated:', payload);
            
            // Get the updated item data
            if (payload && payload.data) {
              // Fetch the complete news item with relations
              const updatedItem = await client.models.News.get({
                id: payload.data.id
              });
              
              if (updatedItem.data) {
                // Format the updated item
                const formattedItem = await formatNewsData(client, [updatedItem.data]);
                
                // Update the news list
                setNews(currentNews => 
                  currentNews.map(item => 
                    item.id === formattedItem[0].id ? formattedItem[0] : item
                  )
                );
              }
            }
          },
          error: (error: Error) => {
            console.error('Update subscription error:', error);
          }
        });
        
        // Subscribe to deleted news articles (onDelete)
        const deleteSubscription = client.models.News.onDelete().subscribe({
          next: (payload: SubscriptionPayload) => {
            console.log('Article deleted:', payload);
            
            // Remove the deleted item from the news list
            if (payload && payload.data && payload.data.id) {
              setNews(currentNews => 
                currentNews.filter(item => item.id !== payload.data!.id)
              );
            }
          },
          error: (error: Error) => {
            console.error('Delete subscription error:', error);
          }
        });
        
        // Cleanup subscriptions when component unmounts
        return () => {
          createSubscription.unsubscribe();
          updateSubscription.unsubscribe();
          deleteSubscription.unsubscribe();
        };
        
      } catch (err: any) {
        console.error('Error fetching news:', err);
        setError(err.message || 'Failed to fetch news');
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
  
  
