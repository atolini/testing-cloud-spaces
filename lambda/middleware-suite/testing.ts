import {Middleware, MiddlewareContext, MiddlewareFactory} from "@middleware";
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";

interface ValidatorProps {

}

const testing: MiddlewareFactory<APIGatewayProxyEvent, APIGatewayProxyResult, Context, ValidatorProps> =
    (): Middleware<APIGatewayProxyEvent, APIGatewayProxyResult, Context> => {

        return {
            onError(req: APIGatewayProxyEvent,
                    res: APIGatewayProxyResult,
                    context: Context,
                    error: unknown): Promise<APIGatewayProxyResult> {

                return Promise.resolve({
                    statusCode: 500,
                    body: 'erro lançado do testing middleware'
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

                //throw new Error();

                return next(req, res, context, middlewareContext);
            }
        }
    }

export default testing;