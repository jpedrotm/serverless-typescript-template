import { JSONObject } from '@common/types';

export interface APIErrorOptions {
  code: string;
  error?: Error;
  message: string;
  status: number;
  details?: JSONObject;
}
