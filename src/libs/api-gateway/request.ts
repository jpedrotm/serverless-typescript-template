import { APIError } from '@common/errors';
import { Logger } from '@libs/log';
import type { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

import { formatJSONResponse, handleErrorResponse } from './response';
import { APIHandlerOptions, ValidateInput } from './types';

export async function apiHandler<I, J>({
  context,
  event,
  input,
  execute,
}: APIHandlerOptions<I, J>): Promise<APIGatewayProxyResult> {
  // create logger
  const logger: Logger = new Logger(process.env.stage || 'dev', context);

  logger.info('Request - Start execution', {
    body: event.body,
    context,
    event,
    pathParameters: event.pathParameters,
  });

  try {
    const { body, pathParameters }: { body: I; pathParameters: J } =
      validateEventInput(event, input);
    const response = await execute(event, body, pathParameters, logger);
    return formatJSONResponse(response.body, response.statusCode);
  } catch (error) {
    return handleErrorResponse(error as Error, logger);
  }
}

const validateEventInput = <I, J>(
  event: APIGatewayEvent,
  input: ValidateInput,
): { body: I; pathParameters: J } => {
  try {
    const body = JSON.parse(event.body || '');
    return {
      body: input.body?.parse(body) as I,
      pathParameters: input.pathParameters?.parse(event.pathParameters) as J,
    };
  } catch (error) {
    throw new APIError({
      code: 'invalid-input',
      error: error as Error,
      message: (error as Error).message,
      status: 404,
    });
  }
};
