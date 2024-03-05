// src/files/files.controller.ts

// src/files/files.controller.ts

import { Controller, Post, UploadedFile, HttpException, HttpStatus, UseInterceptors, Body, Query, Req, UseGuards, Get, Param, HttpCode } from '@nestjs/common';

import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequireSignIn } from 'src/guards/RequireSignIn.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('files/api')
export class FileController {
    constructor(private fileService: FileService) { }

    @Post('upload')
    @UseGuards(RequireSignIn)
    @UseInterceptors(FileInterceptor('file', {
    }))
    async uploadFile(@UploadedFile() file: any, @Req() req: any) {
        return this.fileService.uploadFile(file, req)
    }

    @Get('get-file/:dir_id')
    @UseGuards(RequireSignIn)
    @ApiOperation({
        summary: "for getting file"
    })
    @ApiResponse({
        status: 200,
        description: "Files fetched successfully"
    })
    @HttpCode(HttpStatus.OK)
    getFolder(@Param('dir_id') dir_id: string, @Req() req: any) {
        return this.fileService.getFile(dir_id, req)

    }
}
