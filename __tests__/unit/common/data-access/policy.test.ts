import { docClient } from '@common/data-access/dynamo/client';
import { getGroupsPolicy } from '@common/data-access/policy';
import { environment } from '@common/environment';
import { Logger } from '@libs/log';

jest.mock('@libs/log');

const GROUP = 'admin';

describe('Common - data-access - policy', (): void => {
  beforeEach((): void => {
    Logger.prototype.info = jest.fn();
    Logger.prototype.error = jest.fn();
  });

  afterEach((): void => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('Should throw an error when command fails to get policies', async () => {
    const error: Error = new Error('fail batch get');
    jest
      .spyOn(docClient as any, 'send')
      .mockImplementation(() => Promise.reject(error));

    await expect(getGroupsPolicy([GROUP], new Logger('dev'))).rejects.toThrow(
      error,
    );
  });

  test('Should return undefined when group has no policies', async () => {
    const expectedPolicies = [{}];
    jest
      .spyOn(docClient as any, 'send')
      .mockImplementation(() => Promise.resolve({}));

    await expect(
      getGroupsPolicy([GROUP], new Logger('dev')),
    ).resolves.toBeUndefined();
  });

  test('Should return policies when has group policies', async () => {
    const expectedPolicies = [{}];
    jest.spyOn(docClient as any, 'send').mockImplementation(() =>
      Promise.resolve({
        Responses: {
          [environment.policyTable]: expectedPolicies,
        },
      }),
    );

    await expect(getGroupsPolicy([GROUP], new Logger('dev'))).resolves.toBe(
      expectedPolicies,
    );
  });
});
