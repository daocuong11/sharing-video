import { BullModule, getQueueToken } from '@nestjs/bull';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { SharedVideo, SharedVideoDocument, SharedVideoSchema } from './shared-video.schema';
import { SharedVideoService } from './shared-video.service';

describe('SharedVideoService - Integration Test', () => {
  let service: SharedVideoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://root:123456@localhost:27017/sharing-video?authSource=admin&readPreference=primary'),
        MongooseModule.forFeature([{ name: SharedVideo.name, schema: SharedVideoSchema }]),
        BullModule.forRoot({
          redis: {
            host: 'localhost',
            port: 6379,
          },
        }),
        BullModule.registerQueue({
          name: 'sharing-video-queue'
        }), 
      ],
      providers: [SharedVideoService],
    }).compile();

    service = module.get<SharedVideoService>(SharedVideoService);
  });

  it('should be saved new sharing video and able to get list videos', async () => {
    const video: SharedVideo = {
      title: 'title',
      link: 'https://youtube.com/abc',
      sharedBy: 'user2@gmail.com',
      sharedTime: new Date()
    }

    const savedVideo = await service.shareVideo(video);

    expect(savedVideo).toBeTruthy();

    for (let i = 0; i < 6; i++) {
      await service.shareVideo(video);
    }

    const videosPage01 = await service.getShareVideos(2, 0);

    expect(videosPage01.length).toEqual(2);

    await service.removeVideos(video.sharedBy);
  });
});


describe('SharedVideoService - Unit Test', () => {
  let service: SharedVideoService;
  let mockSharedVideoModel: Model<SharedVideoDocument>;
  let video: SharedVideo;
  const mockedModel = {
    skip: jest.fn(() => []),
    limit: jest.fn(() => mockedModel),
    find: jest.fn(() => mockedModel),
    findOneAndUpdate: jest.fn(() => mockedModel)
  };
  const mockQueue: any = { 
    add: jest.fn(),
    process: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SharedVideoService,
        {
          provide: getModelToken(SharedVideo.name),
          useValue: mockedModel
        },
        {
          provide: getQueueToken('sharing-video-queue'),
          useValue: mockQueue
        }
      ],
    }).compile();

    service = module.get<SharedVideoService>(SharedVideoService);
    mockSharedVideoModel = module.get<Model<SharedVideoDocument>>(getModelToken(SharedVideo.name));
    video = {
      title: 'title',
      link: 'https://youtube.com/abc',
      sharedBy: 'user2@gmail.com',
      sharedTime: new Date()
    }
  });

  it('should be saved new sharing video', async () => {
    await service.shareVideo(video);
    expect(mockedModel.findOneAndUpdate).toBeCalledTimes(1);
  });

  it('should be get videos', async () => {
    await service.getShareVideos(1, 1);
    expect(mockedModel.find).toBeCalledTimes(1);
    expect(mockedModel.limit).toBeCalledTimes(1);
    expect(mockedModel.skip).toBeCalledTimes(1);
  });
});