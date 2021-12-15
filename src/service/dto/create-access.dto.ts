import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateAccessDto {
    @IsString()
    userId: string;

    @IsArray()
    @IsString({ each: true })
    permissions: [string];
}
