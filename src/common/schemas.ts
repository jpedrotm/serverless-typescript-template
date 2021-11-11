export const EnvironmentSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: true,
  properties: {
    cognitoAppClientId: { type: 'string' },
    cognitoUserPoolId: { type: 'string' },
    policyTable: { type: 'string' },
  },
  required: ['cognitoAppClientId', 'cognitoUserPoolId', 'policyTable'],
  type: 'object',
};
