import {Middleware, MiddlewareContext, MiddlewareFactory} from "@middleware";
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";

export class EmptyBodyError extends Error {
    constructor(message: string = 'The request body is empty.') {
        super(message);
        this.name = 'EmptyBodyError';
    }
}

const httpJsonBodyParser: MiddlewareFactory<APIGatewayProxyEvent, APIGatewayProxyResult, Context, undefined> =
    (): Middleware<APIGatewayProxyEvent, APIGatewayProxyResult, Context> => {
        return {
            onError(
                req: APIGatewayProxyEvent,
                context: Context,
                middlewareContext: MiddlewareContext,
                error: unknown
            ): Promise<APIGatewayProxyResult> {
                let response;

                if (error instanceof EmptyBodyError) {
                    response = {
                        statusCode: 400,
                        body: JSON.stringify({
                            error: "EmptyBodyError",
                            message: error.message,
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    };
                } else {
                    response =  {
                        statusCode: 400,
                        body: JSON.stringify({
                            error: "SyntaxError",
                            message: "Invalid JSON format in the request body.",
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    };
                }

                return Promise.resolve(response);
            },

            run(
                req: APIGatewayProxyEvent,
                context: Context,
                middlewareContext: MiddlewareContext,
            ): Promise<MiddlewareContext> {

                if (req.body) {
                    return Promise.resolve({
                        ...middlewareContext,
                        body: JSON.parse(req.body)
                    });
                }

                throw new EmptyBodyError();
            }
        };
    };

export default httpJsonBodyParser;
