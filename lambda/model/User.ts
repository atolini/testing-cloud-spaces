import { IsString, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';
import {Model} from './Model';

class User extends Model {
    @IsString()
    @Expose()
    name: string;

    @IsNumber()
    @Expose()
    age: number;

    constructor() {
        super('USER', 'USER_ID');
    }
}

export default User;