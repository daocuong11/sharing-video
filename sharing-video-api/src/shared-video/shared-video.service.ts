import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SharedVideo } from './shared-video.schema';
import { v4 as uuid } from 'uuid';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class SharedVideoService {
    constructor(
        @InjectModel(SharedVideo.name) private sharedVideoModel: Model<SharedVideo>,
        @InjectQueue('sharing-video-queue') private sharingVideoQueue: Queue
    ) { }

    async shareVideo(sharevideo: SharedVideo): Promise<SharedVideo> {
        const job = await this.sharingVideoQueue.add('share-video', {
            sharevideo
        });

        return this.sharedVideoModel.findOneAndUpdate(
            { sharedBy: uuid().toString() },
            { $set: sharevideo },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
    }

    async getShareVideos(pageSize: number, pageIndex: number): Promise<any> {
        return this.sharedVideoModel.find().limit(pageSize).skip(pageSize * pageIndex);
    }

    async removeVideos(sharedBy: string) {
        await this.sharedVideoModel.findOneAndRemove({
            sharedBy
        });
    }
}
