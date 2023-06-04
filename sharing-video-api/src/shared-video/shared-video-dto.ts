import { IsEmail, IsNotEmpty } from "class-validator";

export class ShareVideoDTO {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    link: string;
}