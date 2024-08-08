import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new nodejs.NodejsFunction(this, "Testing", {
      entry: "./lambda/lambda/testing.ts",
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_20_X
    });

  }
}
