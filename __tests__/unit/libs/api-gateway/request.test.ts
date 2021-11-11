import { apiHandler } from '@libs/api-gateway';
import { Result } from '@libs/api-gateway/types';
import { Logger } from '@libs/log';
import createEvent from '@serverless/event-mocks';
import {
  APIGatewayEvent,
  APIGatewayProxyEvent,
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { z } from 'zod';

import { Mocks, expectResponse } from '../../../common';

jest.mock('@libs/log');

const RESOURCE_PATH = '/hello';
const ID = '22543534-d8dd-48eb-8b5c-c714ed2df982';

const createRequestMock = (name: string | number): string => {
  return JSON.stringify({
    name: name,
  });
};

const HelloData = z.object({
  name: z.string(),
});

const processEvent = (
  event: APIGatewayEvent,
  body: HelloDataType,
  pathParameters: HelloDataType,
): Promise<Result> => {
  return Promise.resolve({
    body: {
      message: `Hello ${body.name}!`,
    },
    statusCode: 200,
  });
};

type HelloDataType = z.infer<typeof HelloData>;

describe('Libs - API Gateway - Request', (): void => {
  let eventMock: APIGatewayProxyEvent;
  let contextMock: Context;

  beforeEach((): void => {
    Logger.prototype.info = jest.fn();
    Logger.prototype.error = jest.fn();

    eventMock = createEvent('aws:apiGateway', {
      body: createRequestMock('Linkal'),
      headers: {
        'Content-Type': 'application/json',
      },
      httpMethod: 'POST',
      path: RESOURCE_PATH,
      pathParameters: {
        name: ID,
      } as APIGatewayProxyEventPathParameters,
      requestContext: {
        requestTimeEpoch: Date.now(),
      },
    }) as APIGatewayProxyEvent;

    contextMock = Mocks.createContext();
  });

  afterEach((): void => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('Should return error when event body is null', async () => {
    eventMock.body = null;
    const response: APIGatewayProxyResult = await apiHandler({
      context: contextMock,
      event: eventMock,
      execute: (
        event: APIGatewayEvent,
        body: HelloDataType,
        pathParameters: HelloDataType,
        log: Logger,
      ) => processEvent(event, body, pathParameters),
      input: {
        body: HelloData,
      },
    });

    expectResponse(response, 404, {
      code: 'invalid-input',
      date: expect.anything(),
    });
  });

  test('Should return error when event body has incorrect format', async () => {
    eventMock.body = createRequestMock(1);
    const response: APIGatewayProxyResult = await apiHandler({
      context: contextMock,
      event: eventMock,
      execute: (
        event: APIGatewayEvent,
        body: HelloDataType,
        pathParameters: HelloDataType,
        log: Logger,
      ) => processEvent(event, body, pathParameters),
      input: {
        body: HelloData,
      },
    });

    expectResponse(response, 404, {
      code: 'invalid-input',
      date: expect.anything(),
    });
  });

  test('Should return error when event pathParameters has incorrect format', async () => {
    eventMock.pathParameters = {};
    const response: APIGatewayProxyResult = await apiHandler({
      context: contextMock,
      event: eventMock,
      execute: (
        event: APIGatewayEvent,
        body: HelloDataType,
        pathParameters: HelloDataType,
        log: Logger,
      ) => processEvent(event, body, pathParameters),
      input: {
        body: HelloData,
        pathParameters: HelloData,
      },
    });

    expectResponse(response, 404, {
      code: 'invalid-input',
      date: expect.anything(),
    });
  });

  test('Should return success when event has the correct format', async () => {
    const response: APIGatewayProxyResult = await apiHandler({
      context: contextMock,
      event: eventMock,
      execute: (
        event: APIGatewayEvent,
        body: HelloDataType,
        pathParameters: HelloDataType,
        log: Logger,
      ) => processEvent(event, body, pathParameters),
      input: {
        body: HelloData,
      },
    });

    expectResponse(response, 200, { message: 'Hello Linkal!' });
  });
});
