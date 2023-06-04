import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharingVideoProcessor } from './shared-video-processor';
import { SharedVideoController } from './shared-video.controller';
import { SharedVideoGateway } from './shared-video.gateway';
import { SharedVideo, SharedVideoSchema } from './shared-video.schema';
import { SharedVideoService } from './shared-video.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SharedVideo.name, schema: SharedVideoSchema }]),
    BullModule.registerQueue({
      name: 'sharing-video-queue'
    })
  ],
  controllers: [SharedVideoController],
  providers: [
    SharedVideoService,
    SharingVideoProcessor,
    SharedVideoGateway
  ]
})
export class SharedVideoModule { }
