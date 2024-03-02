/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dto/CreateUser.dto';
import { LoginDto } from 'src/dto/Login.dto';
import { comparePassword, hashPassword } from 'src/helper/authHelper';
import { User } from 'src/schema/user.schema';
import * as JWT from 'jsonwebtoken'
import * as fs from 'fs';
import * as path from 'path'

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>,) { }

    async register(file: any, createUserDto: CreateUserDto) {
        try {

            const existingUser = await this.userModel.findOne({ email: createUserDto.email });
            if (existingUser) {
                return {
                    success: false,
                    message: "User Already registered",
                    // status: HttpStatus.OK
                }
            }
            const pathToProfile = 'C:/Users/HSTPL_LAP_008/Documents/Learnings/Gdrive/api/src/public/Profile'
            const uniqueSuffix = Date.now() + '-'
            const pathOfFile = `${pathToProfile}/${uniqueSuffix}${file.originalname}`

            const writeStream = fs.createWriteStream(pathOfFile)
            writeStream.write(file.buffer)
            writeStream.end()
            let newPath = pathOfFile
            const publicIndex = newPath.lastIndexOf('public/')
            newPath = newPath.substring(publicIndex).replace('public', '')

            const hashedPassword = await hashPassword(createUserDto.password)
            const user = new this.userModel({
                ...createUserDto,
                profile_pic: newPath,
                password: hashedPassword,
            });

            const pathToPublic = 'C:/Users/HSTPL_LAP_008/Documents/Learnings/Gdrive/api/src/public';


            if (fs.existsSync(pathToPublic)) {
                const newDirectoryPath = path.join(pathToPublic, (user._id).toString());
                if (!fs.existsSync(newDirectoryPath)) {
                    fs.mkdirSync(newDirectoryPath);
                    console.log(`Directory '${user._id}' created inside '${pathToPublic}' successfully.`);
                } else {
                    console.log(`Directory '${user._id}' already exists inside '${pathToPublic}'.`);
                }
            } else {
                console.log(`The '${pathToPublic}' folder does not exist.`);
            }
            await user.save();
            return {
                success: true,
                message: "User registered successfully",
                status: HttpStatus.OK,
                user
            };
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success: false,
                message: "Registration failed",

                // status: HttpStatus.INTERNAL_SERVER_ERROR,
            })
        }
    }

    async login(loginDto: LoginDto) {
        try {
            const { email, password } = loginDto
            if (!email || !password) {
                throw new UnauthorizedException({
                    // status: HttpStatus.OK,
                    success: false,
                    message: "Invalid Email or Password"
                })

            }
            const user = await this.userModel.findOne({ email })
            if (!user) {
                throw new NotFoundException({
                    success: false,
                    message: "Email is not registered",
                })
            }
            const match = await comparePassword(password, user.password)
            if (!match) {
                throw new UnauthorizedException({
                    success: false,
                    message: "Invalid Password"
                })

            }
            let token = await JWT.sign({ _id: user._id }, "ASDFGHJUYTRDS", {
                expiresIn: '10d',
            })
            token = 'Bearer ' + token
            return {
                status: HttpStatus.OK,
                success: true,
                message: "Loggedin Successfully",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    gender: user.gender,
                    profile_pic: user.profile_pic,
                    storage:user.storage
                },
                token
            }
        } catch (error) {
            console.log(error)
            throw new BadRequestException({
                success: false,
                message: "Login failed",
                status: HttpStatus.BAD_REQUEST,
            })

        }
    }

    async auth(res: any) {
        res.status(200).send({ ok: true })
    }

    async updateUser(profilePic: any, req: any, res: any) {
        try {
            const { name, gender, phone, password } = req.body
            const pathToProfile = 'C:/Users/HSTPL_LAP_008/Documents/Learnings/Gdrive/api/src/public/Profile'
            const pathToDeleteFile = "C:/Users/HSTPL_LAP_008/Documents/Learnings/Gdrive/api/src/public"

            let newPath:string
            const user = await this.userModel.findOne({ _id: req.user._id })
            if (!password || password.length < 6) {
                return res.json({ error: "Password is required and 6 character long" })
            }
            if (profilePic) {
                fs.unlink(`${pathToDeleteFile}${user?.profile_pic}`, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err.message);
                    } else {
                        console.log('File deleted successfully.');
                        const uniqueSuffix = Date.now() + '-'
                        const pathOfFile = `${pathToProfile}/${uniqueSuffix}${profilePic.originalname}`
    
                        const writeStream = fs.createWriteStream(pathOfFile)
                        writeStream.write(profilePic.buffer)
                        writeStream.end()
                         newPath = pathOfFile
                        const publicIndex = newPath.lastIndexOf('public/')
                        newPath = newPath.substring(publicIndex).replace('public', '')
    
                    }
                }
                )
            } 
            const hashedPassword = password ? await hashPassword(password) : undefined
            const updatedUser = await this.userModel.findByIdAndUpdate(req.user._id, {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                gender: gender || user.gender,
                profile_pic: newPath || user.profile_pic

            }, { new: true })
            res.status(200).send({
                success: true,
                message: "Profile Updated Sucessfully",
                updatedUser
            })
        } catch
         (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success: false,
                message: 'Error in Updating Profile'
            })

        }

    }
}
