import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

//import mongoose from "mongoose";

export type ShortUrlDocument = mongoose.HydratedDocument<ShortUrl>;

@Schema({ timestamps: true })
export class ShortUrl extends Document {

    @Prop({ default: null })
    shortUrl: string;

    @Prop({ required: true, })
    url: string;

    @Prop({ default: 0, required: true, })
    count: number;

    @Prop({ default: new Date(new Date().getTime() + 10 * 60000), required: true, })
    expireAt: Date;


}

export const ShortUrlSchema = SchemaFactory.createForClass(ShortUrl);