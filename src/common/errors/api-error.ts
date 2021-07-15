import { APIErrorOptions } from '@common/errors/types';
import { JSONObject } from '@common/types';

export class APIError extends Error implements APIErrorOptions {
  code: string;
  date: string;
  error?: Error;
  errorMessage: string;
  message: string;
  status: number;
  details?: JSONObject;

  constructor(options: APIErrorOptions) {
    super(options.message);

    /** Capture stack trace, excluding this constructor */
    Error.captureStackTrace(this, this.constructor);

    this.code = options.code;
    this.error = options.error;
    this.errorMessage = options.message;
    this.date = new Date().toISOString();
    this.message = options.message;
    this.status = options.status;
    this.details = options.details;
  }
}
