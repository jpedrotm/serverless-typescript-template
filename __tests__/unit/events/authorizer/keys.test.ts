import { environment } from '@common/environment';
import { getCognitoKeys } from '@events/authorizer/keys';
import axios from 'axios';

import { Mocks } from '../../../common';

jest.mock('axios');

const JWKEYS = {
  keys: [
    {
      alg: 'RS256',
      e: 'AQAB',
      kid: 'CfVKyLj4x56Cf3l8dIt4/6SGwg7Typ7aD1ubDRatZ/4=',
      kty: 'RSA',
      n: 'yditDGvzT9gxQLwZDgMB0F50vol3bdhaXNjBr3NZh1aX8RDszYjXqViQtAtuSMTD16VFp9Zn0RRHo3opH6vvcdemHFAF_H9btX7vsRYv6AcHLkPqC6gRFfxhnik9OleV88uqE5fVY0B9577MIZP0FrWcjaisuF5HVqshPaq5xrHCB40KB1FJUus1GZX8McwWdzK3C_zr5pgynS--3mLOKGKf1sm12u_9d5khWibVfzxPhC5i3aQzWBEscgOfSC7yRQEefv-5XIeSkLMRtW9ZHpNahmxG5F5HOVEqhVCUKmGyyMg5CKq2sV6_1mQkKurjsYLkqmGESdZNjgj0GjhH8w',
      use: 'sig',
    },
  ],
};

describe('Events - Authorizer - Keys', (): void => {
  beforeEach((): void => {
    Mocks.setEnvironment(environment);

    (axios.get as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        data: JWKEYS,
      }),
    );
  });

  afterEach((): void => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('Should throw an error axios request fails', async () => {
    const error: Error = new Error('Failed request');
    (axios.get as jest.Mock).mockImplementation(() => Promise.reject(error));
    await expect(getCognitoKeys()).rejects.toThrowError(error);
  });

  test('Should succeed when gets keys from cognito', async () => {
    await expect(getCognitoKeys()).resolves.toBe(JWKEYS.keys);
    await expect(getCognitoKeys()).resolves.toBe(JWKEYS.keys);
    expect(axios.get).toBeCalledTimes(1);
    expect(axios.get).toBeCalledWith(
      `https://cognito-idp.eu-west-1.amazonaws.com/${environment.cognitoUserPoolId}/.well-known/jwks.json`,
    );
  });
});
