import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthObject {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;
}
