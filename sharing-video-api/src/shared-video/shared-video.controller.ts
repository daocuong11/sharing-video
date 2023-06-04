import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ShareVideoDTO } from './shared-video-dto';
import { SharedVideo } from './shared-video.schema';
import { SharedVideoService } from './shared-video.service';

@Controller('shared-video')
export class SharedVideoController {
    constructor(private sharedVideoService: SharedVideoService) {
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Post()
    sharingVideo(@Body() shareVideoDto: ShareVideoDTO, @Request() req) {
        const shareVideo: SharedVideo = {
            title: shareVideoDto.title,
            link: shareVideoDto.link,
            sharedBy: req.user.username,
            sharedTime: new Date()
        };

        return this.sharedVideoService.shareVideo(shareVideo);
    }

    @Get()
    getVideos(@Request() req, @Query("pageSize") pageSize, @Query("pageIndex") pageIndex) {
        pageSize = pageSize < 0 ? 50 : pageSize ?? 50;
        pageIndex = pageIndex < 0 ? 0 : pageIndex ?? 0;
        return this.sharedVideoService.getShareVideos(pageSize, pageIndex);
    }
}
