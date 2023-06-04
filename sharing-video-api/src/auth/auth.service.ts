import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as md5 from 'md5'

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectModel(User.name) private userModel: Model<User>
    ) { }

    async register(username: string, password: string): Promise<User> {
        let user = await this.getUser(username);

        if (!user) {
            let salt = Math.random();
            let hashPassword = md5(password + salt)

            const createdUser = {
                username: username,
                password: hashPassword,
                salt: salt
            };
            return this.userModel.findOneAndUpdate(
                { username },
                { $set: createdUser },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )
        } else {
            throw new HttpException('User already existed', HttpStatus.BAD_REQUEST);
        }
    }

    async signIn(username: string, password: string): Promise<any> {
        let user = await this.getUser(username);

        if (!user || md5(password + user.salt) !== user.password) {
            throw new UnauthorizedException();
        }

        const payload = { username: user.username };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async getUser(username: string) {
        var user = await this.userModel.findOne({
            username
        });
        return user;
    }

    async removeUser(username: string) {
        await this.userModel.findOneAndRemove({
            username
        });
    }
}