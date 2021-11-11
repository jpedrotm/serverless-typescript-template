import { environment } from '@common/environment';
import axios from 'axios';

import { JWKey } from './types';

let keys: JWKey[];

export const getCognitoKeys = async (): Promise<JWKey[]> => {
  if (!keys) {
    const response = await axios.get(
      `https://cognito-idp.eu-west-1.amazonaws.com/${environment.cognitoUserPoolId}/.well-known/jwks.json`,
    );
    keys = response.data.keys as JWKey[];
  }

  return keys;
};
