import 'source-map-support/register';

import { apiHandler } from '@libs/api-gateway';
import { Result } from '@libs/api-gateway/types';
import { Logger } from '@libs/log';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { HelloData, HelloDataType } from './types';

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  return apiHandler<HelloDataType, Record<string, unknown>>({
    context,
    event,
    execute: (
      event: APIGatewayEvent,
      body: HelloDataType,
      pathParameters: Record<string, unknown>,
      log: Logger,
    ) => processEvent(event, body, pathParameters, log),
    input: { body: HelloData },
  });
};

const processEvent = (
  event: APIGatewayEvent,
  body: HelloDataType,
  pathParameters: Record<string, unknown>,
  log: Logger,
): Promise<Result> => {
  return Promise.resolve({
    body: {
      message: `Hello ${body.name}!`,
    },
    statusCode: 200,
  });
};
