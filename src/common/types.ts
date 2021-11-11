import { PolicyDocument } from 'aws-lambda';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare type JSONObject = Record<string, any>;

export interface AuthorizerPolicy {
  group: string;
  policy: PolicyDocument;
}
