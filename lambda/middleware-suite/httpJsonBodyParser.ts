import {MiddlewareContext, Middleware, MiddlewareFactory} from "@middleware";
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
/**
 * Fábrica de middleware que cria um middleware para parsing de corpo JSON em AWS Lambda.
 * Ele analisa o corpo JSON da requisição e o adiciona ao contexto do middleware.
 * Se ocorrer um erro durante o parsing, retorna uma resposta 400 Bad Request.
 *
 * @returns {Middleware<APIGatewayProxyEvent, APIGatewayProxyResult, Context>}
 *  O middleware com os métodos `run` e `onError`.
 */
const httpJsonBodyParser: MiddlewareFactory<APIGatewayProxyEvent, APIGatewayProxyResult, Context, undefined> =
    (): Middleware<APIGatewayProxyEvent, APIGatewayProxyResult, Context> => {

        return {
            /**
             * Manipulador de erros para o middleware.
             * Lida com erros de sintaxe ao analisar JSON e retorna uma resposta 400.
             *
             * @param {APIGatewayProxyEvent} req - O evento de requisição do API Gateway.
             * @param {APIGatewayProxyResult} res - O objeto de resposta do API Gateway.
             * @param {Context} context - O objeto de contexto da AWS Lambda.
             * @param {MiddlewareContext} middlewareContext - O contexto do middleware.
             * @param {unknown} error - O erro que ocorreu.
             * @returns {Promise<APIGatewayProxyResult>} O objeto de resposta.
             */
            onError(
                req: APIGatewayProxyEvent,
                res: APIGatewayProxyResult,
                context: Context,
                middlewareContext: MiddlewareContext,
                error: unknown
            ): Promise<APIGatewayProxyResult> {

                const response: APIGatewayProxyResult = {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: "SyntaxError",
                        message: "Formato de JSON inválido no corpo da requisição.",
                        details: "Token inesperado no JSON na posição 10"
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                };

                return Promise.resolve(response);
            },

            /**
             * Função `run` do middleware que analisa o corpo JSON da requisição.
             *
             * @param {APIGatewayProxyEvent} req - O evento de requisição do API Gateway.
             * @param {APIGatewayProxyResult} res - O objeto de resposta do API Gateway.
             * @param {Context} context - O objeto de contexto da AWS Lambda.
             * @param {MiddlewareContext} middlewareContext - O contexto do middleware.
             * @param {function} next - O próximo middleware ou handler a ser executado.
             * @returns {Promise<APIGatewayProxyResult>} O objeto de resposta.
             */
            run(
                req: APIGatewayProxyEvent,
                res: APIGatewayProxyResult,
                context: Context,
                middlewareContext: MiddlewareContext,
                next: (
                    req: APIGatewayProxyEvent,
                    res: APIGatewayProxyResult,
                    context: Context,
                    middlewareContext: MiddlewareContext
                ) => Promise<APIGatewayProxyResult>
            ): Promise<APIGatewayProxyResult> {

                if (req.body) {
                    middlewareContext.data = {
                        ...middlewareContext.data,
                        body: JSON.parse(req.body)
                    };
                }

                return next(req, res, context, middlewareContext);
            }
        };
    };

export default httpJsonBodyParser;
