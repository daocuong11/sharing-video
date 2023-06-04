import { IsEmail, IsNotEmpty } from "class-validator";

export class UserDTO {
    @IsEmail()
    username: string;

    @IsNotEmpty()
    password: string;
}