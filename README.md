# Serverless - Typescript template

Service built using [Serverless framework](https://www.serverless.com/) template. It has
common logic and libs to be re-used across lambdas, in order to reduce boiler plate. Additionally,
it has a Cognito setup, to quickly perform authentication and authorization, to the API.

## Resources

- **CognitoUserPool**: Cognito user pool, responsible to handle authentication
  (manage users, groups).
- **CognitoUserPoolClient**: Cognito user pool client, created to configure
  authentication domain and interfaces for users sign-in/sign-up.
- **DynamoDBPolicyTable**: DynamoDB table used to store the IAM policies,
  per group.

## Components

### Authorizer

The service has a custom API Gateway Authorizers, responsible to validate the JWT
against Cognito. The authorization is based on Cognito users and groups. It
assumes that each user belongs to at least one group, extracts Cognito claims
(`cognito:username`, `cognito:group`) and queries the `policy` DynamoDB table,
to get the respective IAM policy, to authorize the request. If something fails
or the user does not belong to a valid group, the request is denied.

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npm run deploy` to deploy this stack to AWS
