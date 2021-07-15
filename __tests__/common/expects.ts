import { JSONObject } from '@common/types';
import { APIGatewayProxyResult } from 'aws-lambda';

export const expectResponse = (
  response: APIGatewayProxyResult,
  statusCode: number,
  expectedResponseBody: JSONObject,
): void => {
  expect(response.statusCode).toBe(statusCode);

  const responseBody = isEventBodyJson(response.body)
    ? JSON.parse(response.body)
    : response.body;
  expect(responseBody).toEqual(expect.objectContaining(expectedResponseBody));
};

const isEventBodyJson = (eventBody: string | null): boolean => {
  try {
    JSON.parse(eventBody || '');
  } catch (error) {
    return false;
  }
  return true;
};
