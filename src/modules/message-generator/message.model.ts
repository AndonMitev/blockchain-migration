import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ types: String })
  address: string;

  @Prop({ type: Number })
  tokenId: number;

  @Prop({ type: String })
  uri: string;

  @Prop({ type: String })
  signature: string;

  @Prop({ type: Boolean, default: false })
  isMinted: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
