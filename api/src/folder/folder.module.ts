/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Directory, DirectorySchema } from 'src/schema/directory.schema';
import { File, FileSchema } from 'src/schema/file.schema';

@Module({
    imports: [ 
        MongooseModule.forFeature(
            [
                { name:Directory.name, schema:DirectorySchema },
                { name:File.name, schema:FileSchema }
            ]
        ),

    ],
    controllers: [FolderController],
    providers: [FolderService],
})
export class CreateFolderModule { }
