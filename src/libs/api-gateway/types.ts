import { JSONObject } from '@common/types';
import { Logger } from '@libs/log';
import type { APIGatewayEvent, Context } from 'aws-lambda';
import { z } from 'zod';

export interface APIHandlerOptions<I, J> {
  context: Context;
  event: APIGatewayEvent;
  input: ValidateInput;
  execute: (
    event: APIGatewayEvent,
    body: I,
    pathParameters: J,
    log: Logger,
  ) => Promise<Result>;
  log?: Logger;
}

export interface ValidateInput {
  body?: z.AnyZodObject;
  pathParameters?: z.AnyZodObject;
}

export interface Result {
  body: JSONObject;
  statusCode: number;
}
