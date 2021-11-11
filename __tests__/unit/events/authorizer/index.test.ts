import { getGroupsPolicy } from '@common/data-access/policy';
import { AuthorizerPolicy } from '@common/types';
import { handler as authorizer } from '@events/authorizer';
import { validateJWT } from '@events/authorizer/jwt';
import { Logger } from '@libs/log';
import {
  APIGatewayEventRequestContextWithAuthorizer,
  APIGatewayRequestAuthorizerEvent,
  Context,
} from 'aws-lambda';
import { JWTVerifyResult } from 'jose';

import { Mocks } from '../../../common';

jest.mock('@common/data-access/policy');
jest.mock('@events/authorizer/jwt');
jest.mock('@libs/log');

const COGNITO_USERNAME = '1d26c3f1-dc63-4391-b92f-a5a9e4187ca5';
const RESOURCE_PATH = '/hello';
const JWT: JWTVerifyResult = {
  payload: {
    'cognito:groups': 'member',
    'cognito:username': COGNITO_USERNAME,
  },
  protectedHeader: {},
};
const GROUPS_POLICY: AuthorizerPolicy[] = [
  {
    group: 'member',
    policy: {
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: ['arn:aws:execute-api:*:*:*/*/*/hello'],
          Sid: 'linkal-api',
        },
      ],
      Version: '2012-10-17',
    },
  },
];

describe('Events - Authorizer', (): void => {
  let eventMock: APIGatewayRequestAuthorizerEvent;
  let contextMock: Context;

  beforeEach((): void => {
    Logger.prototype.info = jest.fn();
    Logger.prototype.error = jest.fn();

    (validateJWT as jest.Mock).mockImplementation(() => Promise.resolve(JWT));
    (getGroupsPolicy as jest.Mock).mockImplementation(() =>
      Promise.resolve(GROUPS_POLICY),
    );

    eventMock = {
      headers: {
        Authorization:
          'Bearer eyJraWQiOiJuT05JblRrZFVudXh1MFwvdXBhN204MmdpWGNpT2djb3Y3RkU0V1FhSENkOD0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiU2FKSDN6N2plSHZvN1JLNlhVTzhOQSIsInN1YiI6IjRjYWQwYjFjLWI3ZTAtNDM4Zi1hZjA3LTZkZjllZmMzYzdlYiIsImNvZ25pdG86Z3JvdXBzIjpbImFkbWluIl0sImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTFfUlp0aVpxcVJiIiwiY29nbml0bzp1c2VybmFtZSI6IjRjYWQwYjFjLWI3ZTAtNDM4Zi1hZjA3LTZkZjllZmMzYzdlYiIsImF1ZCI6IjQxdGo4dGJ2cDE3YnB0MTQ4cW44b2YxbHJhIiwiZXZlbnRfaWQiOiJjOTg4ZjcyMi1kYTdlLTQxMmMtYmY5Ny1jZjVhMzE2YTJmMDYiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTYzNjYyODE4MSwiZXhwIjoxNjM2NjMxNzgxLCJpYXQiOjE2MzY2MjgxODEsImp0aSI6IjBmNGM2Yjc3LWM2OGYtNGZmMC1hMDdhLTk3NDViNmU4ZTlhOSIsImVtYWlsIjoiam9zZUBmaWRlbC51ayJ9.TlPtkE5Q1bvQyn37Sx2RzNfsgR8okCbQGrfG59lYxmy8d90afre2YNENPA9x9HEMnYX6zHQYar-ok2cOvRYrzoLU9kYDfnBIXm2oFrd6PQBO124FjkwQLSGY5gwG8YEWNoCGl2ygfDCixv1MWRnZFlR1zbQFgOuo-RG6ofLfA3OPRtu4_DFbLUftsdceZeFzmZKIyKYwfLe9ZPgKkPbdvhAuX1RUIVLnTIwTFKjawYJk8lngMGObEuE5c5hhkIIrUNTARMje5mW6LxlXyuDdYrq6ZDzUboPmPZSK-K_hoAY-dIdKjGaptwtubVS9DVWn-nd_M0tg3qNihHHl1XHdig',
        'Content-Type': 'application/json',
      },
      httpMethod: 'POST',
      methodArn: '',
      multiValueHeaders: null,
      multiValueQueryStringParameters: null,
      path: RESOURCE_PATH,
      pathParameters: null,
      queryStringParameters: null,
      requestContext: {
        requestTimeEpoch: Date.now(),
      } as APIGatewayEventRequestContextWithAuthorizer<undefined>,
      resource: RESOURCE_PATH,
      stageVariables: {},
      type: 'REQUEST',
    };

    contextMock = Mocks.createContext();
  });

  afterEach((): void => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('Should throw an error when request event has no headers', async () => {
    eventMock.headers = null;
    await expect(authorizer(eventMock, contextMock)).resolves.toStrictEqual({
      context: {
        errorMessage: 'Event has no headers',
      },
      policyDocument: {
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: 'arn:aws:execute-api:*:*:*/ANY/*',
          },
        ],
        Version: '2012-10-17',
      },
      principalId: 'yyyyyyyy',
    });
  });

  test('Should throw an error when request event headers has no "Authorization" header', async () => {
    // @ts-ignore
    delete eventMock.headers.Authorization;
    await expect(authorizer(eventMock, contextMock)).resolves.toStrictEqual({
      context: {
        errorMessage: 'Event headers do not contain "Authorization"',
      },
      policyDocument: {
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: 'arn:aws:execute-api:*:*:*/ANY/*',
          },
        ],
        Version: '2012-10-17',
      },
      principalId: 'yyyyyyyy',
    });
  });

  test('Should throw an error when request event headers "Authorization" does not has a valid token', async () => {
    // @ts-ignore
    eventMock.headers.Authorization = 'abc';
    await expect(authorizer(eventMock, contextMock)).resolves.toStrictEqual({
      context: {
        errorMessage: 'Authorization does not has a valid token',
      },
      policyDocument: {
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: 'arn:aws:execute-api:*:*:*/ANY/*',
          },
        ],
        Version: '2012-10-17',
      },
      principalId: 'yyyyyyyy',
    });
  });

  test('Should throw an error when fails to validate jwt', async () => {
    const errorMessage = 'Failed';
    (validateJWT as jest.Mock).mockImplementation(() =>
      Promise.reject(new Error(errorMessage)),
    );
    await expect(authorizer(eventMock, contextMock)).resolves.toStrictEqual({
      context: {
        errorMessage: errorMessage,
      },
      policyDocument: {
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: 'arn:aws:execute-api:*:*:*/ANY/*',
          },
        ],
        Version: '2012-10-17',
      },
      principalId: 'yyyyyyyy',
    });
  });

  test('Should throw an error when could not find groups policy', async () => {
    (getGroupsPolicy as jest.Mock).mockImplementation(() =>
      Promise.resolve(undefined),
    );
    await expect(authorizer(eventMock, contextMock)).resolves.toStrictEqual({
      context: {
        errorMessage: 'User group(s) has no policy',
      },
      policyDocument: {
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: 'arn:aws:execute-api:*:*:*/ANY/*',
          },
        ],
        Version: '2012-10-17',
      },
      principalId: 'yyyyyyyy',
    });
  });

  test('Should successfully authorize', async () => {
    await expect(authorizer(eventMock, contextMock)).resolves.toStrictEqual({
      policyDocument: GROUPS_POLICY[0].policy,
      principalId: COGNITO_USERNAME,
    });
  });
});
