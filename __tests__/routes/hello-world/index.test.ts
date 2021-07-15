import { handler as helloWorld } from '@routes/hello-world';
import createEvent from '@serverless/event-mocks';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';

import { Mocks, expectResponse } from '../../common';

const RESOURCE_PATH = '/hello';
const ID = '22543534-d8dd-48eb-8b5c-c714ed2df982';

const createRequestMock = (): string => {
  return JSON.stringify({
    name: 'Linkal',
  });
};

describe('Routes - Hello World', (): void => {
  let eventMock: APIGatewayProxyEvent;
  let contextMock: Context;

  beforeEach((): void => {
    eventMock = createEvent('aws:apiGateway', {
      body: createRequestMock(),
      headers: {
        'Content-Type': 'application/json',
      },
      httpMethod: 'POST',
      path: RESOURCE_PATH,
      pathParameters: {
        mapId: ID,
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

  test('Should throw an error when request has accountId path parameters in incorrect format', async () => {
    const response: APIGatewayProxyResult = await helloWorld(
      eventMock,
      contextMock,
    );

    expectResponse(response, 200, { message: 'Hello Linkal!' });
  });
});
