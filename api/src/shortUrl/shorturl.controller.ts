/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { ShorturlService } from './shorturl.service';
import { RequireSignIn } from 'src/guards/RequireSignIn.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class ShorturlController { 
    constructor(private shortUrlService: ShorturlService) { }

    @Post('create-short-url')
    @UseGuards(RequireSignIn)
    @ApiOperation({
        summary:"create shorte url"
    })
    @ApiResponse({
        status:200,
        description:"short url created"
    })
    @HttpCode(HttpStatus.OK) 
    createShortUrl( @Req() req:any) {
        return this.shortUrlService.createShortUrl(req)

    }
    @Get(':shorturl')
    @ApiOperation({
        summary:"get shorte url"
    })
    @ApiResponse({
        status:200,
        description:"short url"
    })
    @Redirect()
    @HttpCode(HttpStatus.OK) 
    getShortUrl( @Param('shorturl') shorturl:any,  @Req() req:any, @Res() res:any) {
        
        return this.shortUrlService.getShortUrl(shorturl,req)
        

    }


}
