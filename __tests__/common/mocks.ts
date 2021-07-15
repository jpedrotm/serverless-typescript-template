import { JSONObject } from '@common/types';
import { Context } from 'aws-lambda';

export const Mocks = {
  createContext: (): Context => {
    return {
      awsRequestId: '7c11f22e-b808-11e8-90d7-354a599263ca',
      callbackWaitsForEmptyEventLoop: false,
      done: (): void => {},
      fail: (): void => {},
      functionName: 'test-function',
      functionVersion: '$LATEST',
      getRemainingTimeInMillis: (): number => 1,
      invokedFunctionArn:
        'arn:aws:lambda:eu-west-1:738417869583:function:test-function',
      logGroupName: '/aws/lambda/test-function',
      logStreamName: '2018/09/14/[$LATEST]4c0d09a40b974ddf8dd7baf4e18861aa',
      memoryLimitInMB: '512',
      succeed: (): void => {},
    };
  },

  setEnvironment: (environment: JSONObject): void => {
    environment.serviceName = 'service-accounts';
    environment.stage = 'test';
  },
};
