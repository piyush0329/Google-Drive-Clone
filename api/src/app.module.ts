import { ShorturlModule } from './shortUrl/shorturl.module';
import { FileModule } from './file/file.module';

import { CreateFolderModule } from './folder/folder.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';


@Module({
  imports: [
    ShorturlModule,
    FileModule,
    CreateFolderModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/Gdrive'),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../src', "public"),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        });
        return {
          store: () => store as any,
        };
      },
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
