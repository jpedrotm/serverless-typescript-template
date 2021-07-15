import { APIErrorOptions } from './types';

export const ERROR_CODES: Record<string, APIErrorOptions> = {
  UNEXPECTED_ERROR: {
    code: 'unexpected-error',
    message: 'Unexpected error',
    status: 500,
  },
};
