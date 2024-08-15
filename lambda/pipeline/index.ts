import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {Chain, ErrorHandler, MiddlewareContext} from "@middleware";

const defaultErrorHandler: ErrorHandler<APIGatewayProxyEvent, APIGatewayProxyResult, Context> =
    (req: APIGatewayProxyEvent,
     context: Context,
     middlewareContext: MiddlewareContext,
     error: unknown): Promise<APIGatewayProxyResult> => {
        return Promise.resolve({
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal Server Error"
            })
        });
    };

const defaultResponse: APIGatewayProxyResult = {
    statusCode: 200,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
        message: "Success",
    }),
};


export const Pipeline = (_debugger?: boolean): Chain<APIGatewayProxyEvent, APIGatewayProxyResult, Context> => {
    if (_debugger)
        return new Chain<APIGatewayProxyEvent, APIGatewayProxyResult, Context>(defaultErrorHandler, defaultResponse, true);

    return new Chain<APIGatewayProxyEvent, APIGatewayProxyResult, Context>(defaultErrorHandler, defaultResponse);
};


