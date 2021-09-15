import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as lambda from "@aws-cdk/aws-lambda";
import * as rds from "@aws-cdk/aws-rds";
import * as appsync from "@aws-cdk/aws-appsync";
export class DemoAppSyncStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const api = new appsync.GraphqlApi(this, "api", {
      name: "cdk-blog-appsync-api",
      schema: appsync.Schema.fromAsset("graphql/schema.gql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
    });
    const awsLambda = new lambda.Function(this, "MyFunction", {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "welcome.handler",
    });
    const lambdaDataSource = api.addLambdaDataSource(
      "awsLambdaDataSource",
      awsLambda
    );
    lambdaDataSource.createResolver({
      typeName: "Query",
      fieldName: "welcome",
    });
    lambdaDataSource.createResolver({
      typeName: "Query",
      fieldName: "hello",
    });
    lambdaDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "addUser",
    });
    new cdk.CfnOutput(this, "graphQLURL", {
      value: api.graphqlUrl,
    });
    new cdk.CfnOutput(this, "graphQlKey", {
      value: api.apiKey || "",
    });
  }
}
