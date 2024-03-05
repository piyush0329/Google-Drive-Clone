import { FileService } from './file.service';
import { FileController } from './file.controller';
/*
https://docs.nestjs.com/modules
*/
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema } from 'src/schema/file.schema';
import { Directory, DirectorySchema } from 'src/schema/directory.schema';
import { User, UserSchema } from 'src/schema/user.schema';
// import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        
        MongooseModule.forFeature(
            [
                { name:File.name, schema:FileSchema },
                { name:Directory.name, schema:DirectorySchema },
                { name:User.name, schema: UserSchema }
            ]
        ),
    ],
    controllers: [
        FileController,],
    providers: [
        FileService,],
})
export class FileModule { }
