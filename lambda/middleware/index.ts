/**
 * Função que cria uma nova instância de um middleware.
 *
 * Essa função deve ser implementada para fornecer uma nova instância de um
 * middleware sempre que for chamada. A instância criada deve aderir à
 * interface `Middleware<T, Q>`.
 *
 * @param {P} props - Os parâmetros ou configurações necessários para criar o middleware.
 * @returns {Middleware<T, Q>} - A nova instância do middleware criada pela fábrica.
 */
export type MiddlewareFactory<T, Q, P>  = (props?: P) => Middleware<T, Q>;

/**
 * Tipo que representa a função de manipulação de erros.
 * @template T - Tipo da requisição.
 * @template Q - Tipo da resposta.
 */
export type ErrorHandler<T, Q> = (req: T, res: Q, context: Context, error: unknown) => Promise<Q>;

/**
 * Interface que define a estrutura de um middleware.
 * @template T - Tipo da requisição.
 * @template Q - Tipo da resposta.
 */
export interface Middleware<T, Q> {
    /**
     * Função chamada quando ocorre um erro durante a execução do middleware.
     * @param {T} req - O objeto de requisição.
     * @param {Q} res - O objeto de resposta.
     * @param {Context} context - O contexto compartilhado.
     * @param {Error} error - O erro que ocorreu.
     * @returns {Promise<Q>} - O objeto de resposta atualizado.
     */
    onError?: ErrorHandler<T, Q>;

    /**
     * Função que processa a requisição e a resposta, e chama o próximo middleware.
     * @param {T} req - O objeto de requisição.
     * @param {Q} res - O objeto de resposta.
     * @param {Context} context - O contexto compartilhado.
     * @param {(req: T, res: Q, context: Context) => Promise<Q>} next - Função que chama o próximo middleware.
     * @returns {Promise<Q>} - O objeto de resposta atualizado.
     */
    run: (req: T, res: Q, context: Context, next: (req: T, res: Q, context: Context) => Promise<Q>) => Promise<Q>;
}

/**
 * Tipo que representa o contexto compartilhado.
 */
export type Context = {
    data: any;
};

/**
 * Classe que gerencia e executa uma cadeia de middleware-suite.
 * @template T - Tipo da requisição.
 * @template Q - Tipo da resposta.
 */
export class Chain<T, Q> {
    /** @private {Middleware<T, Q>[]} - Lista de middleware-suite a serem executados. */
    private readonly middlewares: Middleware<T, Q>[];
    /** @private {ErrorHandler<T, Q>} - Manipulador de erros padrão. */
    private readonly defaultErrorHandler: ErrorHandler<T, Q>;

    /**
     * Cria uma nova instância da classe Chain.
     * @param {ErrorHandler<T, Q>} defaultErrorHandler - Função de manipulação de erros padrão.
     */
    constructor(defaultErrorHandler: ErrorHandler<T, Q>) {
        this.middlewares = [];
        this.defaultErrorHandler = defaultErrorHandler;
    }

    /**
     * Adiciona um middleware à cadeia.
     * @param {Middleware<T, Q>} middleware - O middleware a ser adicionado.
     * @returns {Chain<T, Q>} - A instância atual da classe Chain, permitindo encadeamento de métodos.
     */
    use(middleware: Middleware<T, Q>): Chain<T, Q> {
        this.middlewares.push(middleware);
        return this;
    }

    /**
     * Executa a cadeia de middleware com a requisição, resposta e contexto fornecidos.
     * @param {T} req - O objeto de requisição.
     * @param {Q} res - O objeto de resposta.
     * @param {Context} context - O contexto compartilhado.
     * @returns {Promise<Q>} - O objeto de resposta atualizado após a execução dos middleware-suite.
     */
    async run(req: T, res: Q, context: Context): Promise<Q> {
        let index = 0;

        /**
         * Função que chama o próximo middleware na cadeia.
         * @param {T} req - O objeto de requisição.
         * @param {Q} res - O objeto de resposta.
         * @param {Context} context - O contexto compartilhado.
         * @returns {Promise<Q>} - O objeto de resposta atualizado após o middleware ser executado.
         */
        const next = async (req: T, res: Q, context: Context): Promise<Q> => {
            if (index >= this.middlewares.length) return res;

            const middleware = this.middlewares[index];
            index++;

            try {
                return await middleware.run(req, res, context, next);
            } catch (error: unknown) {
                if (middleware.onError) {
                    return await middleware.onError(req, res, context, error);
                } else {
                    return await this.defaultErrorHandler(req, res, context, error);
                }
            }
        };

        return next(req, res, context);
    }
}
