import validator from "@middleware-suite/validator";
import Pipeline from "../lambda/pipeline/index";

test('SQS Queue Created', async () => {
    const resolver = await Pipeline()
        .use(validator())
        // @ts-ignore
        .run({}, {}, {})
    console.log(resolver);
});
