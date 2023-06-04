import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SharedVideoDocument = HydratedDocument<SharedVideo>;

@Schema()
export class SharedVideo {
  @Prop()
  title: string;

  @Prop()
  link: string;

  @Prop()
  sharedBy: string;

  @Prop()
  sharedTime: Date;
}

export const SharedVideoSchema = SchemaFactory.createForClass(SharedVideo);