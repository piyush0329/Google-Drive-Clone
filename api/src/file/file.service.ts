/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createWriteStream, fstat } from 'fs';
import * as path from 'path';
import { Model } from 'mongoose'
import slugify from 'slugify'
// import x from '../public/'
import { Directory } from 'src/schema/directory.schema';
import { File } from 'src/schema/file.schema';
import { User } from 'src/schema/user.schema';
@Injectable()
export class FileService {

    constructor(
        @InjectModel(Directory.name) private directoryModel: Model<Directory>,
        @InjectModel(File.name) private fileModel: Model<File>,
        @InjectModel(User.name) private userModel: Model<User>
    ) { }

    async uploadFile(file: any, req: any) {
        try {
            const { path_name } = req.body
            
            let pathToFolder: string
            let dir_id: string
            if (!file) {
                throw new Error('No file uploaded');
            }
            if (path_name === '/') {
                pathToFolder = `C:/Users/HSTPL_LAP_008/Documents/Learnings/Gdrive/api/src/public/${req.user._id}`
                dir_id = req.user._id
            } else {
                const parentFolder = await this.directoryModel.findOne({ _id: path_name })
                pathToFolder = `C:/Users/HSTPL_LAP_008/Documents/Learnings/Gdrive/api/src/public` + parentFolder.path
                dir_id = path_name
            }
            const uniqueSuffix = Date.now() + '-'

            const filename = `${uniqueSuffix}${file.originalname}`;
            const extension = path.extname(file.originalname)
            const pathOfFile = `${pathToFolder}/${filename}`

            const writeStream = createWriteStream(pathOfFile)

            writeStream.write(file.buffer)
            writeStream.end()
            let newPath = pathOfFile
            newPath = newPath.replaceAll('\\', '/')
            const publicIndex = newPath.lastIndexOf('public/')
            newPath = newPath.substring(publicIndex).replace('public', '')
            const slug = slugify(file.originalname,{lower:true,trim:true})
            const fileUpload = await new this.fileModel({ name: file.originalname, type: file.mimetype, size: (file.size / (1024 * 1024)).toFixed(2), userid: req.user._id, path: newPath, dir_id: dir_id,slug:slug }).save()

            const user = await this.userModel.findOne({_id:req.user._id})
            const remainingStorage = user.storage -( file.size/1024)
           
            const updatedUser =await this.userModel.findOneAndUpdate({_id:user._id},{
                storage:remainingStorage
            },{new:true})

            
            return {
                success: true,
                message: "file uploaded successfully",
                fileUpload,
                updatedUser
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            throw new Error('Failed to upload file');
        }
    }

    async getFile(dir_id: any, req: any) {
        try {
            const file = await this.fileModel.find({ dir_id })

            return {
                success: true,
                message: "files fetched successfully",
                file
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success: false,
                message: 'Error in getting file'
            })

        }

    }

}
