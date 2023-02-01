import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class NoteObject {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    content: string;

    @IsNumber()
    @IsOptional()
    id?: number;
}
