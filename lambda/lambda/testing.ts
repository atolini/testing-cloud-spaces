import Pipeline from "@pipeline";
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context,} from "aws-lambda";
import httpJsonBodyParser from "@middleware-suite/httpJsonBodyParser";
import {MiddlewareContext} from "@middleware";
import validator from "@middleware-suite/validator";

const lambda = async (req: APIGatewayProxyEvent,
                      res: APIGatewayProxyResult,
                      context: Context,
                      middlewareContext: MiddlewareContext): Promise<APIGatewayProxyResult> => {
    return {
        statusCode: 200,
        body: JSON.stringify({})
    }
}

export const handler = async (
    event: APIGatewayProxyEvent,
    context: Context,
): Promise<APIGatewayProxyResult> => {

    return await Pipeline()
        .use(httpJsonBodyParser())
        .use(validator())
        .handler(lambda)
        .run(event, context);
}