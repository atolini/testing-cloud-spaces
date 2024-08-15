import {Context} from "aws-lambda/handler";

export function mockContext(): Context {
    return {
        callbackWaitsForEmptyEventLoop: true,
        functionName: 'myLambdaFunction',
        functionVersion: '$LATEST',
        invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:myLambdaFunction',
        memoryLimitInMB: '128',
        awsRequestId: 'c9d89b7e-xmpl-46b7-8967-50f1d6e51560',
        logGroupName: '/aws/lambda/myLambdaFunction',
        logStreamName: '2024/08/14/[$LATEST]abcdef1234567890abcdef1234567890',
        identity: undefined,
        clientContext: undefined,
        getRemainingTimeInMillis: () => 30000,
        done: (error?: Error, result?: any) => {},
        fail: (error: Error | string) => {},
        succeed: (messageOrObject: any) => {}
    }
}