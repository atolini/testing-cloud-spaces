import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {Context, ErrorHandler, Chain} from "@middleware";

/**
 * Handler de erro padrão para a aplicação, utilizado para retornar uma
 * resposta HTTP 500 em caso de falha inesperada.
 *
 * @param {APIGatewayProxyEvent} req - Objeto de evento de solicitação da API Gateway.
 * @param {APIGatewayProxyResult} res - Objeto de resultado de resposta da API Gateway.
 * @param {Context} context - Objeto de contexto fornecido pela função solicitante.
 * @param {unknown} error - Erro ocorrido durante o processamento da solicitação.
 * @returns {Promise<APIGatewayProxyResult>} Promessa que resolve em uma resposta HTTP 500 com uma mensagem de erro.
 */
const defaultErrorHandler: ErrorHandler<APIGatewayProxyEvent, APIGatewayProxyResult> =
    (req: APIGatewayProxyEvent,
     res: APIGatewayProxyResult,
     context: Context,
     error: unknown): Promise<APIGatewayProxyResult> => {

        return Promise.resolve({
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal Server Error"
            })
        })
    }

const Pipeline = () => {
    return new Chain<APIGatewayProxyEvent, APIGatewayProxyResult>(defaultErrorHandler);
}

export default Pipeline;