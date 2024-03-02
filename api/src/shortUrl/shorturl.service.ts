/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ShortUrl } from 'src/schema/shortUrl.schema';
import {Model} from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import * as crc32 from 'crc32'
import { url } from 'inspector';

@Injectable()
export class ShorturlService {
    constructor(
        @InjectModel(ShortUrl.name) private shortUrlModel: Model<ShortUrl>,  
    ) { }

    async createShortUrl(req:any){
        try {
            const {url} =  req.body
            const object = await new this.shortUrlModel({url:url}).save()
            
            const shortUrl = crc32(object._id.toString())
            const  shorturl = await this.shortUrlModel.findOneAndUpdate({_id:object._id},{
                shortUrl:shortUrl
            },{new:true})
            return {
                success:true,
                message:'ShortUrl created successfully',
                shorturl
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success:false,
                message:"Error in creating short url"
            })
            
        }
    }

    async getShortUrl(shorturl:any, req:any){

        try {

            const data = await this.shortUrlModel.findOne({shortUrl:shorturl})
            if(data.expireAt>=(new Date())){
             data.count = data.count+1
             await data.save()
                return {
                    url: data.url,
                }
            }else{
                return {
                    
                    success:false,
                    message:'url expired'
                }
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success:false,
                message:'Error in getting url details'
            })
            
        }

    }




}
