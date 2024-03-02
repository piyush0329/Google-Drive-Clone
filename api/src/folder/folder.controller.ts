/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { FolderService } from './folder.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateFolderDto } from 'src/dto/createFolder.dto';
import { RequireSignIn } from 'src/guards/RequireSignIn.guard';

@Controller('folder/api')
export class FolderController {
    constructor(private folderService: FolderService) { }

    @Post('create-folder')
    @UseGuards(RequireSignIn)
    @ApiOperation({
        summary:"for creating folder"
    })
    @ApiResponse({
        status:200,
        description:"Directory Created successfully"
    })
    @HttpCode(HttpStatus.OK) 
    createFolder(@Body() createFolderDto: CreateFolderDto, @Req() req:any) {
        return this.folderService.createFolder(createFolderDto,req)

    }
    @Get('get-folder/:par_dir')
    @UseGuards(RequireSignIn)
    @ApiOperation({
        summary:"for getting folder"
    })
    @ApiResponse({
        status:200,
        description:"Directory fetched successfully"
    })
    @HttpCode(HttpStatus.OK) 
    getFolder(@Param('par_dir') par_dir:string, @Req() req:any) {
        return this.folderService.getFolder(par_dir, req)

    }
    @Get('search/:keyword')
    @UseGuards(RequireSignIn)
    @ApiOperation({
        summary:"for searching folder/files"
    })
    @ApiResponse({
        status:200,
        description:"files folders fetched successfully"
    })
    @HttpCode(HttpStatus.OK) 
    searchFolderFiles(@Param('keyword') keyword:string, @Req() req:any) {
        return this.folderService.searchFolderFiles(keyword, req)

    }
    @Get('/filter')
    @UseGuards(RequireSignIn)
    @ApiOperation({
        summary:"for getting filtered folder/files"
    })
    @ApiResponse({
        status:200,
        description:"files folders fetched successfully"
    })
    @HttpCode(HttpStatus.OK) 
    getFilteredFolderFiles(@Query() query:any  ) {
        return this.folderService.getFilteredFoldersFiles(query)

    }


 }
