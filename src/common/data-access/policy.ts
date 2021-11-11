import {
  BatchGetCommand,
  BatchGetCommandInput,
  BatchGetCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { environment } from '@common/environment';
import { AuthorizerPolicy } from '@common/types';
import { Logger } from '@libs/log';

import { docClient } from './dynamo/client';

export const getGroupsPolicy = async (
  groups: string[],
  log: Logger,
): Promise<AuthorizerPolicy[] | undefined> => {
  const params: BatchGetCommandInput = {
    RequestItems: {
      [environment.policyTable]: {
        Keys: groups.map((group) => ({
          group,
        })),
      },
    },
  };
  const command = new BatchGetCommand(params);
  log.info('Get policy', { params });

  const result: BatchGetCommandOutput = await docClient.send(command);
  return result.Responses
    ? (result.Responses[environment.policyTable] as AuthorizerPolicy[])
    : undefined;
};
