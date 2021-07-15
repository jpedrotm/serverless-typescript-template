import { APIError } from '@common/errors';
import { handleErrorResponse } from '@libs/api-gateway';
import { Logger } from '@libs/log';
import { APIGatewayProxyResult, Context } from 'aws-lambda';

import { Mocks, expectResponse } from '../../common';

describe('Libs - API Gateway - Response', (): void => {
  let contextMock: Context;

  beforeEach((): void => {
    contextMock = Mocks.createContext();
  });

  afterEach((): void => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('Should return unexpected error when catches a non API error', async () => {
    const handleError: Error = new Error('unexpected error');
    const response: APIGatewayProxyResult = handleErrorResponse(
      handleError,
      new Logger('dev', contextMock),
    );

    expectResponse(response, 500, {
      code: 'unexpected-error',
      errorMessage: 'Unexpected error',
    });
  });

  test('Should return catch API error', async () => {
    const handleError: APIError = new APIError({
      code: 'invalid-input',
      message: 'Invalid input',
      status: 404,
    });
    const response: APIGatewayProxyResult = handleErrorResponse(
      handleError,
      new Logger('dev', contextMock),
    );

    expectResponse(response, 404, {
      code: 'invalid-input',
      date: expect.anything(),
    });
  });
});
