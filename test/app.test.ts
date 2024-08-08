import { plainToInstance } from 'class-transformer';
import User from "@model/User";
import {validate} from "class-validator";

test('Criar item DynamoDB', async () => {
    const user = plainToInstance(User, {
        name: "Lucas",
        age: 25
    }, { excludeExtraneousValues: true });

    console.log(user);

    // Valida o objeto
    const errors = await validate(user,  {
        forbidUnknownValues: true,
        validationError: {
            target: false,
            value: false
        }
    });

    user.hashKey = "01";
    await user.save();
});

test('Atualizar item DynamoDB', async () => {
    const user = plainToInstance(User, {
        name: "Lucas",
        age: 25
    }, { excludeExtraneousValues: true });

    user.name = "Lucas Atolini";
    user.hashKey = "01";
    await user.update();
});

test('Deletar item no DynamoDB', async () => {
    const user = new User();
    user.hashKey = "02";
    await user.delete();
});

test('Testar função de construção do Params', async () => {
    const user = new User();
    user.name = "Lucas Atolini";
    user.age = 28;
    user.hashKey = "01";
    await user.update();
});

test('Testar getItem', async () => {
    const user = await User.getItem(User, "01");
    if (user) {
        user.name = "Lucas Atolini do Nascimento";
        await user.update()
    }
});