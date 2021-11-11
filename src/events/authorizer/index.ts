import { getGroupsPolicy } from '@common/data-access/policy';
import { environment } from '@common/environment';
import { AuthorizerPolicy } from '@common/types';
import { Logger } from '@libs/log';
import {
  APIGatewayAuthorizerEvent,
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEvent,
  Context,
  PolicyDocument,
} from 'aws-lambda';
import { JWTVerifyResult } from 'jose';

import { validateJWT } from './jwt';
import { CustomJWTPayload } from './types';

export const handler = async (
  event: APIGatewayAuthorizerEvent,
  context: Context,
): Promise<APIGatewayAuthorizerResult> => {
  const log: Logger = new Logger(environment.stage, context);
  log.info('Process authorization', { event });

  try {
    const jwt: string = parseEventJWT(
      event as APIGatewayRequestAuthorizerEvent,
    );

    const jwtValidated: JWTVerifyResult = await validateJWT(jwt);
    const jwtPayload = jwtValidated.payload as CustomJWTPayload;

    const groupsPolicy: AuthorizerPolicy[] | undefined = await getGroupsPolicy(
      jwtPayload['cognito:groups'],
      log,
    );

    if (!groupsPolicy) {
      throw new Error('User group(s) has no policy');
    }

    const authPolicy: PolicyDocument = {
      Statement: [],
      Version: groupsPolicy[0].policy.Version,
    };
    for (const groupPolicy of groupsPolicy) {
      authPolicy.Statement = [
        ...authPolicy.Statement,
        ...groupPolicy.policy.Statement,
      ];
    }

    return buildResponsePolicy(jwtPayload['cognito:username'], authPolicy);
  } catch (error) {
    log.error('Failed to validate JWT', { error });
    return buildDenyPolicy((error as Error).message);
  }
};

const parseEventJWT = (event: APIGatewayRequestAuthorizerEvent): string => {
  if (!event.headers) {
    throw new Error('Event has no headers');
  }

  if (!('Authorization' in event.headers)) {
    throw new Error('Event headers do not contain "Authorization"');
  }

  const authorization = event.headers['Authorization'] as string;
  const authorizationSplit = authorization.split(' ');

  if (authorizationSplit.length != 2 || authorizationSplit[0] != 'Bearer') {
    throw new Error('Authorization does not has a valid token');
  }

  return authorizationSplit[1];
};

const buildResponsePolicy = (
  principalId: string,
  policyDocument: PolicyDocument,
): APIGatewayAuthorizerResult => ({
  policyDocument,
  principalId,
});

const buildDenyPolicy = (errorMessage: string): APIGatewayAuthorizerResult => ({
  context: {
    errorMessage,
  },
  policyDocument: {
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: 'Deny',
        Resource: 'arn:aws:execute-api:*:*:*/ANY/*',
      },
    ],
    Version: '2012-10-17',
  },
  principalId: 'yyyyyyyy',
});
