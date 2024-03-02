import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNumber, IsString } from "class-validator"


export class CreateFolderDto {

    @ApiProperty({
        example: 'file name',
        description: "name of  the file",
        type:'string'
    })
    @IsString()
    name: string

    @ApiProperty({
        example: '.txt',
        description: "file type",
        type:'string'
    })
    type?: string

    @ApiProperty({
        example: '1024',
        description: "file size",
        type:'number'
    })
    size?: number

    @ApiProperty({
        example: 'objectid',
        description: "it contains the user id  of user",
        type:'string'
    })
    userid?: string

    @ApiProperty({
        example: 'path',
        description: "it contains the path of the file",
        type:'string'
    })
    path?: string
    
    @ApiProperty({
        example: 'path',
        description: "it contains the path of the file",
        type:'string'
    })
    dir_id?: string

}