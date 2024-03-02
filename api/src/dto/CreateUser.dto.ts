import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNumber, IsString } from "class-validator"


export class CreateUserDto {

    @ApiProperty({
        example: 'amit',
        description: "name of  the user",
        type:'string'
    })
    @IsString()
    name: string

    @ApiProperty({
        example: 'amit@gmail.com',
        description: "provide the email of the user",
        type:'string'
    })
    @IsEmail()
    email: string

    @ApiProperty({
        example: '123456',
        description: "provide the password of the user",
        type:'string'
    })
    @IsString()
    password: string;

    @ApiProperty({
        example: 'male',
        description: "provide the gender of the user",
        type:'string'
    })
    @IsString()
    gender: string;

    @ApiProperty({
        example: '6555434543',
        description: "provide the phone number of the user",
        type:'number'
    })
    @IsNumber()
    phone: number;

    @ApiProperty({
        example: 'path of profile pic',
        description: "path of profile pic",
        type:'string'
    })
    profile_pic: string;

    


}