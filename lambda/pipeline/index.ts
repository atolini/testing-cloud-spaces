import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { MiddlewareContext, ErrorHandler, Chain } from "@middleware";

/**
 * Handler de erro padrão para a aplicação, utilizado para retornar uma
 * resposta HTTP 500 em caso de falha inesperada.
 *
 * @param {APIGatewayProxyEvent} req - Objeto de evento de solicitação da API Gateway.
 * @param {APIGatewayProxyResult} res - Objeto de resultado de resposta da API Gateway.
 * @param {Context} context - Contexto da função Lambda fornecido pelo AWS.
 * @param {MiddlewareContext} middlewareContext - Contexto adicional do middleware para tratamento de fluxo.
 * @param {unknown} error - Erro ocorrido durante o processamento da solicitação.
 * @returns {Promise<APIGatewayProxyResult>} Promessa que resolve em uma resposta HTTP 500 com uma mensagem de erro.
 */
const defaultErrorHandler: ErrorHandler<APIGatewayProxyEvent, APIGatewayProxyResult, Context> =
    (req: APIGatewayProxyEvent,
     res: APIGatewayProxyResult,
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

/**
 * Função que inicializa a cadeia de middlewares para o processamento de eventos.
 *
 * @returns {Chain<APIGatewayProxyEvent, APIGatewayProxyResult, Context>} Instância da cadeia de middlewares configurada com o handler de erro padrão e a resposta padrão.
 */
const Pipeline = (): Chain<APIGatewayProxyEvent, APIGatewayProxyResult, Context> => {
    return new Chain<APIGatewayProxyEvent, APIGatewayProxyResult, Context>(defaultErrorHandler, defaultResponse);
};

export default Pipeline;

