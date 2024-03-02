/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/dto/CreateUser.dto';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto/Login.dto';
import { RequireSignIn } from 'src/guards/RequireSignIn.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth/api')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @UseInterceptors(FileInterceptor('file', {
    }))
    @ApiOperation({
        summary: "for registering user"
    })
    @ApiResponse({
        status: 200,
        description: "User Registered Successfully"
    })
    @HttpCode(HttpStatus.OK)
    register(@UploadedFile() file: any, @Body() createUserDto: CreateUserDto) {
        return this.authService.register(file, createUserDto)
    }

    @Post('login')
    @ApiOperation({
        summary: "for user signin"
    })
    @ApiResponse({
        status: 200,
        description: "Loggedin Successfully"
    })
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }

    @Get('userauth')
    @ApiOperation({
        summary: "validate signin"
    })
    @ApiResponse({
        status: 200,
        description: "ok:true"
    })
    @UseGuards(RequireSignIn)
    auth(@Res() res: any) {
        return this.authService.auth(res)
    }


    @Put('user-update')
    @UseGuards(RequireSignIn)
    @UseInterceptors(FileInterceptor('profilePic', {
    }))
    @ApiOperation({
        summary: "for registering user"
    })
    @ApiResponse({
        status: 200,
        description: "User Registered Successfully"
    })
    @HttpCode(HttpStatus.OK)
    updateUser(@UploadedFile() profilePic: any, @Req() req:any, @Res() res:any) {
        return this.authService.updateUser(profilePic, req,res)
    }

}
