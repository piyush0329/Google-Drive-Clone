import { ShorturlModule } from './shortUrl/shorturl.module';
import { FileModule } from './file/file.module';

import { CreateFolderModule } from './folder/folder.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
    ShorturlModule,
    FileModule,
    CreateFolderModule,
    AuthModule,
    MongooseModule.forRoot('-- your database location--'),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../src', "public"),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
