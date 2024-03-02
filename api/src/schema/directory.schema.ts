import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

//import mongoose from "mongoose";

// export type DirectoryDocument = mongoose.HydratedDocument<DirectoryDocument>;

@Schema({ timestamps: true })
export class Directory extends Document {

    @Prop({ required: true, })
    name: string;

    @Prop({ required: true })
    parent_dir: string;

    @Prop({ required: true })
    userid: string;

    @Prop({ required: true })
    path: string;

    @Prop({ required: true })
    slug: string;

    @Prop({ required: true })
    path_arr: any[];


}

export const DirectorySchema = SchemaFactory.createForClass(Directory);