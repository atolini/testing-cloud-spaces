import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {mockAPIGatewayProxyEvent} from "./_helper/mockAPIGatewayProxyEvent";
import {MiddlewareContext} from "@middleware";
import {Pipeline} from "@pipeline";
import httpJsonBodyParser from "@middleware-suite/httpJsonBodyParser";
import validator from "@middleware-suite/validator";
import {mockContext} from "./_helper/mockContext";
import {schema, number, string} from "dynamodb-toolbox";

export const fakeSchema = schema({
    name: string().required(),
    age: number().required()
});

describe('Testando validator Middleware', () => {
    const context: Context = mockContext();

    test('Cenário de falha: falta de atributos', async () => {
        const body = {
            name: 'Lucas'
        };

        const event: APIGatewayProxyEvent = mockAPIGatewayProxyEvent(body);

        const res: MiddlewareContext | APIGatewayProxyResult = await Pipeline(true)
            .use(httpJsonBodyParser())
            .use(validator({
                schema: fakeSchema,
                mode: 'put'
            }))
            .run(event, context);

        // @ts-ignore
        expect(res.statusCode).toBe(400)

        const _body = JSON.parse(res.body);

        expect(_body.error).toBe('Missing Attribute');
    })
})