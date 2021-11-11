import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDBClient({
  region: process.env.region || 'eu-west-1',
});

export const docClient = DynamoDBDocumentClient.from(ddbClient);
