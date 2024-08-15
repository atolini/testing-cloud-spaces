import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {mockAPIGatewayProxyEvent} from "./_helper/mockAPIGatewayProxyEvent";
import {mockContext} from "./_helper/mockContext";
import {MiddlewareContext} from "@middleware";
import {Pipeline} from "@pipeline";
import httpJsonBodyParser from "@middleware-suite/httpJsonBodyParser";

describe('Testando httpJsonBodyParser', () => {
    const context: Context = mockContext();

    test('Corpo da requisição nulo', async () => {
        const event: APIGatewayProxyEvent = mockAPIGatewayProxyEvent();

        const res: MiddlewareContext | APIGatewayProxyResult = await Pipeline(true)
            .use(httpJsonBodyParser())
            .run(event, context);

        const resParsed = JSON.parse(res.body);

        expect(resParsed.error).toBe('EmptyBodyError');
    });

    test('Corpo da requisição mal formatado', async () => {
        const event: APIGatewayProxyEvent = mockAPIGatewayProxyEvent();

        const fakeBody = {
            language: "nodejs"
        }

        const _fakeBody = JSON.stringify(fakeBody);

        event.body = _fakeBody.replace(/"/, '*');

        const res: MiddlewareContext | APIGatewayProxyResult = await Pipeline(true)
            .use(httpJsonBodyParser())
            .run(event, context);

        // @ts-ignore
        expect(res.statusCode).toBe(400);

        // @ts-ignore
        expect(res.body).toContain("Invalid JSON format in the request body.");
    });

    test('Cenário de sucesso', async () => {
        const body = {
            language: "nodejs"
        };

        const event: APIGatewayProxyEvent = mockAPIGatewayProxyEvent(body);

        const res: MiddlewareContext | APIGatewayProxyResult = await Pipeline(true)
            .use(httpJsonBodyParser())
            .run(event, context);

        expect(res.body).toEqual(body);
    })
})