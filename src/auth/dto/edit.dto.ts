import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditObject {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string;
}
