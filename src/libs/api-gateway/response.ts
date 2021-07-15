import { APIError } from '@common/errors';
import { ERROR_CODES } from '@common/errors/codes';
import { JSONObject } from '@common/types';
import { Logger } from '@libs/log';
import type { APIGatewayProxyResult } from 'aws-lambda';

export const handleErrorResponse = (
  error: Error,
  logger: Logger,
): APIGatewayProxyResult => {
  logger.error(error.message, error);

  const responseError: APIError =
    error instanceof APIError
      ? error
      : new APIError(ERROR_CODES.UNEXPECTED_ERROR);
  return formatJSONResponse(responseError, responseError.status);
};

export const formatJSONResponse = (
  response: JSONObject,
  statusCode: number,
): APIGatewayProxyResult => {
  return {
    body: JSON.stringify(response),
    statusCode: statusCode,
  };
};
