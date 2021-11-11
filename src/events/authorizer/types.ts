import { JWTPayload } from 'jose';

/**
 * JWK representation. More details can be found here
 * https://tools.ietf.org/id/draft-ietf-jose-json-web-key-00.html.
 */
export interface JWKey {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}

export interface CustomJWTPayload extends JWTPayload {
  'cognito:groups': string[];
  'cognito:username': string;
  auth_time?: string;
  email?: string;
}
