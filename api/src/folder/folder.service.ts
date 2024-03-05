/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { Directory } from 'src/schema/directory.schema';
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { CreateFolderDto } from 'src/dto/createFolder.dto';
import * as fs from 'fs'
import * as path from 'path'
import slugify from 'slugify'
import { File } from 'src/schema/file.schema';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class FolderService {
    constructor(
        @Inject(Cache) private readonly cache: Cache,
        @InjectModel(Directory.name) private directoryModel: Model<Directory>,
        @InjectModel(File.name) private fileModel: Model<File>,
    ) { }

    private async pathArray(parent_dir: any, path_arr: any[]): Promise<any[]> {
        const directory = await this.directoryModel.findOne({ _id: parent_dir });

        if (directory) {
            path_arr.push(directory._id.toString());

            // Make a recursive call and concatenate the result
            const result = await this.pathArray(directory.parent_dir, path_arr);

            return result;
        } else {
            return path_arr;
        }
    }
    async createFolder(createFolderDto: CreateFolderDto, req: any) {
        try {
            const { name, path_name } = createFolderDto
            const slug = slugify(name, { lower: true, trim: true })
            let parent_dir: string
            let path_arr = []
            let pathToFolder: string
            if (path_name === '/') {
                pathToFolder = `C:/Users/HSTPL_LAP_008/Documents/Learnings/Gdrive/api/src/public/${req.user._id}`
                parent_dir = req.user._id
                path_arr.push(req.user._id)
            } else {
                const parentFolder = await this.directoryModel.findOne({ _id: path_name })
                pathToFolder = `C:/Users/HSTPL_LAP_008/Documents/Learnings/Gdrive/api/src/public` + parentFolder.path
                parent_dir = path_name
                const tempPath = (await this.pathArray(parent_dir, [])).reverse()
                path_arr.push(req.user._id)
                tempPath.forEach(element => {
                    path_arr.push(element)
                });
                console.log(path_arr)
            }
            if (fs.existsSync(pathToFolder)) {
                let newDirectoryPath = path.join(pathToFolder, name);
                if (!fs.existsSync(newDirectoryPath)) {
                    fs.mkdirSync(newDirectoryPath);
                    console.log(`Directory '${name}' created inside '${pathToFolder}' successfully.`);
                    newDirectoryPath = newDirectoryPath.replaceAll('\\', '/')
                    //    console.log(newDirectoryPath)
                    const publicIndex = newDirectoryPath.lastIndexOf('public/')

                    newDirectoryPath = newDirectoryPath.substring(publicIndex).replace('public', '')
                    const directory = await new this.directoryModel({
                        name: name,
                        userid: req.user._id,
                        path: newDirectoryPath,
                        parent_dir: parent_dir,
                        slug: slug,
                        path_arr: path_arr
                    }).save()
                    return {
                        success: true,
                        message: 'folder created successfully'
                    }
                } else {
                    console.log(`Directory '${name}' already exists inside '${pathToFolder}'.`);
                    return {
                        success: false,
                        message: "directory already present"
                    }
                }
            } else {
                console.log(`The '${pathToFolder}' folder does not exist.`);
                return {
                    success: false,
                    message: "folder does not exist"
                }
            }

        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success: false,
                message: 'Error in creating folder'
            })

        }
    }

    async getFolder(par_dir: string, req: any) {
        try {
            const parentFolder = await this.directoryModel.findOne({ _id: par_dir })
            const folders = await this.directoryModel.find({ parent_dir: par_dir })
            return {
                success: true,
                folders,
                parentFolder,
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success: false,
                message: "error in getting folder"
            })
        }
    }

    async searchFolderFiles(keyword: any, req: any) {
        try {

            const folders = await this.directoryModel.find({
                $or: [
                    { slug: { $regex: slugify(keyword, { lower: true }), $options: "i" } },
                ],
            })
            const files = await this.fileModel.find({
                $or: [
                    { slug: { $regex: slugify(keyword, { lower: true }), $options: "i" } },
                ],
            })

            return {
                folders, files
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success: false,
                message: 'Error in Searching'
            })

        }
    }

    async getFilteredFoldersFiles(query: any) {
        try {
            const { type } = query
            
            switch (type) {
                case 'Folders':
                    const cacheKey = `file:${type}`
                    const cachedFolder = await this.cache.get(cacheKey)
                    if (cachedFolder) {
                        return {
                            folders: cachedFolder
                        }
                    }
                    const folders = await this.directoryModel.find({})
                    await this.cache.set(cacheKey, folders, 60 * 60);
                    return {
                        folders
                    }
                    break

                case 'Image & Photos':

                    const cachedImage = await this.cache.get(`file:${type}`)
                    if (cachedImage) {
                        return {
                            files: cachedImage
                        }
                    }
                    const imageFiles = await this.fileModel.find({
                        $or: [
                            { type: 'image/png' }, { type: 'image/jpeg' }
                        ]
                    })
                    await this.cache.set(`file:${type}`, imageFiles, 60 * 60)
                    return {
                        files: imageFiles
                    }
                    break

                case 'Spreadsheet':
                    const cachedSpredsheet = await this.cache.get(`file:${type}`)
                    if (cachedSpredsheet) {
                        return {
                            files: cachedSpredsheet
                        }
                    }
                    const spreadsheetFiles = await this.fileModel.find({ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
                    await this.cache.set(`file:${type}`, spreadsheetFiles, 60 * 60)
                    return {
                        files: spreadsheetFiles
                    }
                    break

                case 'Pdf':
                    const cachedPdf = await this.cache.get(`file:${type}`)
                    if (cachedPdf) {
                        return {
                            files: cachedPdf
                        }
                    }
                    const pdfFile = await this.fileModel.find({ type: 'application/pdf' })
                    await this.cache.set(`file:${type}`, pdfFile, 60 * 60)
                    return {
                        files: pdfFile
                    }
                    break

                case 'Videos':
                    const cachedVideo = await this.cache.get(`file:${type}`)
                    if (cachedVideo) {
                        return {
                            files: cachedVideo
                        }
                    }
                    const videoFile = await this.fileModel.find({ type: 'video/mp4' })
                    await this.cache.set(`file:${type}`, videoFile, 60 * 60)
                    return {
                        files: videoFile
                    }

                    break
                case 'Audios':
                    break
                case 'Presentations':
                    break
                case 'Documents':
                    break

            }


        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success: true,
                message: 'Error in getting filtered files'
            })

        }

    }

}
