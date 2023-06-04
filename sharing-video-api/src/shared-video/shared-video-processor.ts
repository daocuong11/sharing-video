import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SharedVideoGateway } from 'src/shared-video/shared-video.gateway';

@Processor('sharing-video-queue')
export class SharingVideoProcessor {
  constructor(
    private readonly gateway: SharedVideoGateway
  ) { }

  @Process('share-video')
  async transcode(job: Job) {
    this.gateway.server.emit('message', job.data);
  }
}
