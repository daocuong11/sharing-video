import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SharedVideoModule } from './shared-video/shared-video.module';

@Module({
  imports: [
    AuthModule, 
    MongooseModule.forRoot('mongodb://root:123456@localhost:27017/sharing-video?authSource=admin&readPreference=primary'), SharedVideoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
