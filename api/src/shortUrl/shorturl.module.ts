import { ShorturlService } from './shorturl.service';
import { ShorturlController } from './shorturl.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortUrl, ShortUrlSchema } from 'src/schema/shortUrl.schema';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                { name:ShortUrl.name, schema:ShortUrlSchema },  
            ]
        ),

    ],
    controllers: [
        ShorturlController,],
    providers: [
        ShorturlService,],
})
export class ShorturlModule { }
