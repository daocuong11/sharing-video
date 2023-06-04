import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedVideoController } from './shared-video.controller';
import { SharedVideo, SharedVideoSchema } from './shared-video.schema';
import { SharedVideoService } from './shared-video.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SharedVideo.name, schema: SharedVideoSchema }]),
  ],
  controllers: [SharedVideoController],
  providers: [SharedVideoService]
})
export class SharedVideoModule {}
