import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNumber, IsString } from "class-validator"


export class CreateFolderDto {

    @ApiProperty({
        example: 'amit',
        description: "name of  the folder",
        type:'string'
    })
    @IsString()
    name: string
    @ApiProperty({
        example: 'path',
        description: "path of directory",
        type:'string'
    })
    @IsString()
    path_name: string

    


}