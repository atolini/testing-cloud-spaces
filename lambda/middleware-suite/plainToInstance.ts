import {MiddlewareContext, Middleware, MiddlewareFactory} from "@middleware";
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";

interface ValidatorProps {

}

const validator: MiddlewareFactory<APIGatewayProxyEvent, APIGatewayProxyResult, Context, ValidatorProps> =
    (): Middleware<APIGatewayProxyEvent, APIGatewayProxyResult, Context> => {

        return {
            onError(req: APIGatewayProxyEvent,
                    res: APIGatewayProxyResult,
                    context: Context,
                    middlewareContext: MiddlewareContext,
                    error: unknown): Promise<APIGatewayProxyResult> {

                return Promise.resolve({
                    statusCode: 200,
                    body: ''
                });
            },
            run(req: APIGatewayProxyEvent,
                res: APIGatewayProxyResult,
                context: Context,
                middlewareContext: MiddlewareContext,
                next: (req: APIGatewayProxyEvent,
                       res: APIGatewayProxyResult,
                       context: Context,
                       middlewareContext: MiddlewareContext) => Promise<APIGatewayProxyResult>): Promise<APIGatewayProxyResult> {

                middlewareContext.data = {
                    testing: true
                }

                return next(req, res, context, middlewareContext);
            }
        }
    }

export default validator;