import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

//import mongoose from "mongoose";

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema({timestamps:true})
export class User extends Document {

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ unique: true, required: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  phone: number;
  @Prop({ required: true })
  profile_pic: string;
  
  @Prop({ default:1048576, required: true })
  storage: number;



}

export const UserSchema = SchemaFactory.createForClass(User);




