import { environment } from '@common/environment';
import {
  JWTVerifyResult,
  decodeProtectedHeader,
  importJWK,
  jwtVerify,
} from 'jose';

import { getCognitoKeys } from './keys';
import { JWKey } from './types';

export const validateJWT = async (token: string): Promise<JWTVerifyResult> => {
  const headers = decodeProtectedHeader(token);
  const kid: string | undefined = headers.kid;
  if (!kid) {
    throw new Error('Headers are missing kid');
  }

  const keys: JWKey[] = await getCognitoKeys();
  const key: JWKey | undefined = keys.find((key) => key.kid === kid);
  if (!key) {
    throw new Error('Could not find a key for jwt');
  }

  const publicKey = await importJWK({
    alg: key.alg,
    e: key.e,
    kid: key.kid,
    kty: key.kty,
    n: key.n,
    use: key.use,
  });

  /**
   * JWT is verified. Checks signature with public key,
   * and validates claims (e.g. expiration and others).
   */
  const jwtVerified = await jwtVerify(token, publicKey);

  if (environment.cognitoAppClientId !== jwtVerified.payload.aud) {
    throw new Error('JWT was not issued for this audience');
  }

  return jwtVerified;
};
