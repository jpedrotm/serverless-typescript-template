import { Logger } from '@libs/log';
import { Context } from 'aws-lambda';

import { Mocks } from '../../../common';

describe('Libs - API Gateway - Request', (): void => {
  let contextMock: Context;

  beforeEach((): void => {
    contextMock = Mocks.createContext();
  });

  afterEach((): void => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('Should create log with right attributes without context', async () => {
    const log: Logger = new Logger('dev');
    expect(log.options).toEqual({
      tags: ['dev'],
    });
  });

  test('Should create log with right attributes with context', async () => {
    const log: Logger = new Logger('dev', contextMock);
    log.info('info');
    log.error('error');
    expect(log.options).toEqual({
      tags: ['dev', contextMock.awsRequestId, contextMock.functionName],
    });
  });
});
