import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { User, UserDocument, UserSchema } from './user.schema';
import * as md5 from 'md5'

describe('AuthService - Integration Test', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://root:123456@localhost:27017/sharing-video?authSource=admin&readPreference=primary'),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '3600s' },
        }),
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be created and able to login', async () => {
    let user = {
      username: Math.random() + '@gmail.com',
      password: '123456'
    }
    const savedUser = await service.register(user.username, user.password);

    expect(savedUser).toBeTruthy();

    const token = await service.signIn(user.username, user.password);
    expect(savedUser).toBeTruthy();

    await service.removeUser(user.username);
  });
});


describe('AuthService - Unit Test', () => {
  let service: AuthService;
  let mockUserModel: Model<UserDocument>;
  let user: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '3600s' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: Model
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    user = {
      username: Math.random() + '@gmail.com',
      password: '123456'
    }
  });

  it('register should be saved', async () => {
    jest.spyOn(mockUserModel, 'findOne')
      .mockResolvedValue(null);

    jest.spyOn(mockUserModel, 'findOneAndUpdate')
      .mockResolvedValue(user as UserDocument);

    const savedUser = await service.register(user.username, user.password);
    expect(savedUser).toBeTruthy();
  });

  it('register should be throw exception', async () => {
    jest.spyOn(mockUserModel, 'findOne')
      .mockResolvedValue(user);

    expect(async () => {
      await service.register(user.username, user.password);
    }).rejects.toThrow(new HttpException('User already existed', HttpStatus.BAD_REQUEST));
  });

  it('signIn should be found the user', async () => {
    let userDoc: User = {
      username: user.username,
      password: md5(user.password + 'abc'),
      salt: 'abc'
    }

    jest.spyOn(mockUserModel, 'findOne')
      .mockResolvedValue(userDoc);

    const token = await service.signIn(user.username, user.password);
    expect(token).toBeTruthy();
  });

  it('signIn should be throw exception', async () => {
    jest.spyOn(mockUserModel, 'findOne')
      .mockResolvedValue(null);

    expect(async () => {
      await service.signIn(user.username, user.password);
    }).rejects.toThrow(new UnauthorizedException());
  });
});