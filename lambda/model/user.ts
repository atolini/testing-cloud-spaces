import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";
import {Entity, number, schema, string, Table} from "dynamodb-toolbox";

const client = new DynamoDBClient();
const _client = DynamoDBDocumentClient.from(client);

export const UserTable = new Table({
    documentClient: _client,
    name: "User",
    partitionKey: {
        name: "userId",
        type: "string",
    }
});

export const UserSchema = schema({
    userId: string().key(),
    name: string().required(),
    age: number()
});

export const UserEntity = new Entity({
    name: 'USER',
    table: UserTable,
    schema: UserSchema
});