import {Middleware, MiddlewareContext, MiddlewareFactory} from "@middleware";
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {Schema, Parser, DynamoDBToolboxError} from 'dynamodb-toolbox'

interface ValidatorProps {
    schema: Schema<any>,
    mode: 'put' | 'update' | 'key'
}

const validator: MiddlewareFactory<APIGatewayProxyEvent, APIGatewayProxyResult, Context, ValidatorProps> =
    (props?: ValidatorProps): Middleware<APIGatewayProxyEvent, APIGatewayProxyResult, Context> => {

    return {
        onError(req: APIGatewayProxyEvent,
                context: Context,
                middlewareContext: MiddlewareContext,
                error: unknown): Promise<APIGatewayProxyResult> {
            let result;

            if (error instanceof DynamoDBToolboxError) {
                const { code, path, message, payload } = error;

                const statusCode = 400;

                switch (code) {
                    case 'parsing.attributeRequired':
                        result = {
                            statusCode,
                            body: JSON.stringify({
                                error: 'Missing Attribute',
                                path,
                                message
                            })
                        };
                        break;

                    case 'parsing.invalidAttributeInput':
                        result = {
                            statusCode,
                            body: JSON.stringify({
                                error: 'Invalid Attribute Input',
                                path,
                                ...payload
                            })
                        };
                        break;

                    default:
                        result = {
                            statusCode,
                            body: JSON.stringify({
                                error: 'Unknown',
                                message: 'Unknown parsing error. The server could not interpret your request.'
                            })
                        };

                        break;
                }
            } else {
                result = {
                    statusCode: 500,
                    body: JSON.stringify({
                        message: 'Internal Server Error.'
                    })
                }
            }

            return Promise.resolve(result);
        },
        run(req: APIGatewayProxyEvent,
            context: Context,
            middlewareContext: MiddlewareContext): Promise<MiddlewareContext> {
            const { body } = middlewareContext;

            const validated = props?.schema.build(Parser).parse(
                body,
                { mode: props?.mode }
            )

            return Promise.resolve({
                ...middlewareContext,
                body: validated
            });
        }
    }
}

export default validator;