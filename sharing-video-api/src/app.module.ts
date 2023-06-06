import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SharedVideoModule } from './shared-video/shared-video.module';

@Module({
  imports: [
    AuthModule, 
    MongooseModule.forRoot('mongodb://root:123456@mongodb:27017/sharing-video?authSource=admin&readPreference=primary'), 
    SharedVideoModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
