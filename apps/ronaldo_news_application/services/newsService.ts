import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../packages/my-shared-backend/amplify/data/resource';

// Create a client to fetch data
const client = generateClient<Schema>();

// Function to fetch all news from DynamoDB
export async function fetchNewsFromDynamoDB() {
  try {
    const result = await client.models.News.list({
      // Include related models (author and publisher)
      selectionSet: [
        'id', 
        'title', 
        'body', 
        'image', 
        'created_at',
        'author { id, name }',
        'publisher { id, name }'
      ]
    });
    
    return result.data || [];
  } catch (error) {
    console.error('Error fetching news from DynamoDB:', error);
    throw error;
  }
}