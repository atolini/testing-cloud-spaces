import {Context, Middleware, MiddlewareFactory} from "@middleware";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";

interface ValidatorProps {

}

const validator: MiddlewareFactory<APIGatewayProxyEvent, APIGatewayProxyResult, ValidatorProps> =
    (): Middleware<APIGatewayProxyEvent, APIGatewayProxyResult> => {

    return {
        onError(req: APIGatewayProxyEvent, res: APIGatewayProxyResult, context: Context, error: unknown): Promise<APIGatewayProxyResult> {
            return Promise.resolve({
                statusCode: 200,
                body: ''
            });
        },
        run(req: APIGatewayProxyEvent, res: APIGatewayProxyResult, context: Context, next: (req: APIGatewayProxyEvent, res: APIGatewayProxyResult, context: Context) => Promise<APIGatewayProxyResult>): Promise<APIGatewayProxyResult> {
            return Promise.resolve({
                statusCode: 200,
                body: ''
            });
        }
    }
}

export default validator;