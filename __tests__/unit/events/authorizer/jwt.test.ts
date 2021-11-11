import { environment } from '@common/environment';
import { validateJWT } from '@events/authorizer/jwt';
import { getCognitoKeys } from '@events/authorizer/keys';
import {
  JWTVerifyResult,
  ProtectedHeaderParameters,
  decodeProtectedHeader,
  importJWK,
  jwtVerify,
} from 'jose';

import { Mocks } from '../../../common';

jest.mock('axios');
jest.mock('jose');
jest.mock('@events/authorizer/keys');

const COGNITO_USERNAME = '1d26c3f1-dc63-4391-b92f-a5a9e4187ca5';
const JWT = 'asdsasdg.sdgsadg.sgrg';

const JWKEYS = [
  {
    alg: 'RS256',
    e: 'AQAB',
    kid: 'nONInTkdUnuxu0/upa7m82giXciOgcov7FE4WQaHCd8=',
    kty: 'RSA',
    n: 'yditDGvzT9gxQLwZDgMB0F50vol3bdhaXNjBr3NZh1aX8RDszYjXqViQtAtuSMTD16VFp9Zn0RRHo3opH6vvcdemHFAF_H9btX7vsRYv6AcHLkPqC6gRFfxhnik9OleV88uqE5fVY0B9577MIZP0FrWcjaisuF5HVqshPaq5xrHCB40KB1FJUus1GZX8McwWdzK3C_zr5pgynS--3mLOKGKf1sm12u_9d5khWibVfzxPhC5i3aQzWBEscgOfSC7yRQEefv-5XIeSkLMRtW9ZHpNahmxG5F5HOVEqhVCUKmGyyMg5CKq2sV6_1mQkKurjsYLkqmGESdZNjgj0GjhH8w',
    use: 'sig',
  },
];

const DECODED_HEADERS: ProtectedHeaderParameters = {
  alg: 'RS256',
  kid: 'nONInTkdUnuxu0/upa7m82giXciOgcov7FE4WQaHCd8=',
};

const JWT_VERIFIED: JWTVerifyResult = {
  payload: {
    aud: '41tj8tbvp17bpt148qn8of1lra',
    'cognito:groups': 'member',
    'cognito:username': COGNITO_USERNAME,
  },
  protectedHeader: {},
};

describe('Events - Authorizer - JWT', (): void => {
  beforeEach((): void => {
    Mocks.setEnvironment(environment);

    (getCognitoKeys as jest.Mock).mockImplementation(() =>
      Promise.resolve(JWKEYS),
    );

    (decodeProtectedHeader as jest.Mock).mockImplementation(
      () => DECODED_HEADERS,
    );
    (importJWK as jest.Mock).mockImplementation(() => Promise.resolve());
    (jwtVerify as jest.Mock).mockImplementation(() =>
      Promise.resolve(JWT_VERIFIED),
    );
  });

  afterEach((): void => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('Should throw an error when kid is missing from decoded headers', async () => {
    (decodeProtectedHeader as jest.Mock).mockImplementation(() => ({}));
    await expect(validateJWT(JWT)).rejects.toThrowError(
      new Error('Headers are missing kid'),
    );
    expect(importJWK).not.toHaveBeenCalled();
    expect(jwtVerify).not.toHaveBeenCalled();
  });

  test('Should throw an error when could not get keys to match token kid', async () => {
    (getCognitoKeys as jest.Mock).mockImplementation(() => Promise.resolve([]));
    await expect(validateJWT(JWT)).rejects.toThrowError(
      new Error('Could not find a key for jwt'),
    );
    expect(decodeProtectedHeader).toHaveBeenCalledWith(JWT);
    expect(importJWK).not.toHaveBeenCalled();
    expect(jwtVerify).not.toHaveBeenCalled();
  });

  test('Should throw an error when jwt is not valid', async () => {
    const error: Error = new Error('Failed to validate');
    (jwtVerify as jest.Mock).mockImplementation(() => Promise.reject(error));
    await expect(validateJWT(JWT)).rejects.toThrowError(error);
    expect(decodeProtectedHeader).toHaveBeenCalledWith(JWT);
    expect(importJWK).toHaveBeenCalled();
    expect(jwtVerify).toHaveBeenCalled();
  });

  test('Should throw an error when jwt payload aud is not equal to cognito app client id', async () => {
    (jwtVerify as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        payload: {
          aud: 'diff',
        },
      }),
    );
    await expect(validateJWT(JWT)).rejects.toThrowError(
      new Error('JWT was not issued for this audience'),
    );
    expect(decodeProtectedHeader).toHaveBeenCalledWith(JWT);
    expect(importJWK).toHaveBeenCalled();
    expect(jwtVerify).toHaveBeenCalled();
  });

  test('Should succeed validate jwt ', async () => {
    await expect(validateJWT(JWT)).resolves.toBe(JWT_VERIFIED);
    expect(decodeProtectedHeader).toHaveBeenCalledWith(JWT);
    expect(importJWK).toHaveBeenCalled();
    expect(jwtVerify).toHaveBeenCalled();
  });
});
