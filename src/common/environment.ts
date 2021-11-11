const processEnv = process.env as Record<string, string>;
export const environment: Record<string, string> = {
  cognitoAppClientId: processEnv.cognitoAppClientId,
  cognitoUserPoolId: processEnv.cognitoUserPoolId,
  policyTable: processEnv.policyTable,
};
