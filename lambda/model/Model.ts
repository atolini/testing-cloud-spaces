import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {
    DeleteCommand,
    DeleteCommandInput,
    DynamoDBDocumentClient,
    GetCommand,
    GetCommandInput,
    PutCommand,
    PutCommandInput,
    UpdateCommand,
    UpdateCommandInput
} from "@aws-sdk/lib-dynamodb";
import {plainToInstance} from "class-transformer";

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export interface DynamoDBItem {
    tableName: string;
    hashKey: string;
    sortKey?: string;
    hashKeyName: string;
    sortKeyName?: string;
    update: () => void;
}

export class Model implements DynamoDBItem {
    hashKey: string;
    sortKey?: string;
    readonly hashKeyName: string;
    readonly sortKeyName?: string;
    readonly tableName: string;
    private readonly _client;
    [key: string]: any;

    constructor(tableName: string,
                hashKeyName: string,
                sortKeyName?: string) {
        this.tableName = tableName;
        this.hashKeyName = hashKeyName;
        this.sortKeyName = sortKeyName;
        const client = new DynamoDBClient({});
        this._client = DynamoDBDocumentClient.from(client);

    }

    async save() {
        const params = this.getPutParams();
        return this._client.send(new PutCommand(params));
    }

    async delete() {
        const params = this.getDeleteParams();
        return this._client.send(new DeleteCommand(params));
    }

    async update() {
        const params = this.getUpdateParams();
        console.log(params);
        return this._client.send(new UpdateCommand(params));
    }

    getUpdateParams(): UpdateCommandInput {
        this.validate();

        // Construir UpdateExpression, ExpressionAttributeValues e ExpressionAttributeNames dinamicamente
        const updateExpressionParts: string[] = [];
        const expressionAttributeValues: { [key: string]: any } = {};
        const expressionAttributeNames: { [key: string]: string } = {};

        // Iterar sobre as propriedades do objeto e construir a expressão de atualização
        for (const key of Object.keys(this)) {
            // Ignorar propriedades internas e não serializáveis
            if (key.startsWith('_') || ['hashKey', 'sortKey', 'hashKeyName', 'sortKeyName', 'tableName'].includes(key)) {
                continue;
            }
            const attributeNameKey = `#attr_${key}`;
            const attributeValueKey = `:val_${key}`;

            updateExpressionParts.push(`${attributeNameKey} = ${attributeValueKey}`);
            expressionAttributeValues[attributeValueKey] = this[key];
            expressionAttributeNames[attributeNameKey] = key;
        }

        // Se não há propriedades a serem atualizadas, lançar um erro
        if (updateExpressionParts.length === 0) {
            throw new Error("No properties to update");
        }

        // Criar a expressão de atualização final
        const updateExpression = `SET ${updateExpressionParts.join(', ')}`;

        // Criar e retornar o objeto de parâmetros para o método update do DynamoDB
        return {
            TableName: this.tableName,
            Key: {
                [this.hashKeyName]: this.hashKey,
                ...(this.sortKeyName && this.sortKey ? { [this.sortKeyName]: this.sortKey } : {})
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames,
            ReturnValues: "UPDATED_NEW" // Retorna os novos valores atualizados
        };
    }


    private getPutParams(): PutCommandInput {
        this.validate();
        // Cria o objeto do item para inserção no DynamoDB
        const item: { [key: string]: any } = {
            [this.hashKeyName]: this.hashKey,
            ...(this.sortKeyName && this.sortKey ? {[this.sortKeyName]: this.sortKey} : {})
        };

        // Adiciona outras propriedades da instância (excluindo métodos e propriedades privadas)
        for (const key in this) {
            if (typeof this[key] !== 'function' && !key.startsWith('_') && !['hashKey', 'sortKey', 'hashKeyName', 'sortKeyName', 'tableName'].includes(key)) {
                item[key] = this[key];
            }
        }

        // Cria o objeto de parâmetros para o método put do DynamoDB
        return {
            TableName: this.tableName,
            Item: item
        };

    }

    private getDeleteParams(): DeleteCommandInput {
        this.validate();
        // Cria o objeto de parâmetros para o método delete do DynamoDB
        const key: { [key: string]: any } = {
            [this.hashKeyName]: this.hashKey,
            ...(this.sortKeyName && this.sortKey ? {[this.sortKeyName]: this.sortKey} : {})
        };

        return {
            TableName: this.tableName,
            Key: key
        };
    }

    private validate(): void {
        if (!this.hashKey || !this.hashKeyName) {
            throw new ValidationError('Validation failed: hashKey and hashKeyName are required.');
        }

        if (this.sortKeyName && !this.sortKey) {
            throw new ValidationError('Validation failed: sortKey is required when sortKeyName is provided.');
        }
    }

    static async getItem<T extends Model>(model: new (...args: any[]) => T, hashKey: string, sortKey?: string): Promise<T | null> {
        const instance = new model();
        const key: { [key: string]: any } = {
            [instance.hashKeyName]: hashKey,
            ...(instance.sortKeyName && sortKey ? { [instance.sortKeyName]: sortKey } : {})
        };

        const params: GetCommandInput = {
            TableName: instance.tableName,
            Key: key
        };

        const client = new DynamoDBClient({});
        const documentClient = DynamoDBDocumentClient.from(client);

        const result = await documentClient.send(new GetCommand(params));
        if (result.Item) {
            const instance = plainToInstance(model, result.Item, { excludeExtraneousValues: true });
            instance.hashKey = hashKey;
            if (sortKey) {
                instance.sortKey = sortKey;
            }
            return instance;
        } else {
            return null;
        }
    }
}