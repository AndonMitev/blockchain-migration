import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BingoMessageDocument = HydratedDocument<BingoMessage>;

@Schema()
export class BingoMessage {
  @Prop()
  signature: string;

  @Prop()
  symbol: string;

  @Prop()
  uri: string;

  @Prop()
  address: string;

  @Prop({ type: Number })
  tokenId: number;

  @Prop({ type: Number })
  season: number;

  @Prop({ type: Number })
  symbolId: number;

  @Prop({ type: Number })
  seasonSymbolId: number;

  @Prop({ type: Boolean, default: false })
  isMinted: boolean;

  @Prop()
  txHash: string;

  @Prop()
  owner: string;

  @Prop({ type: Number, default: 0 })
  lockedUntil: number;

  @Prop()
  requestedBy: string;

  @Prop({ default: 'OPN Network' })
  collectionName: string;
}

export const BingoMessageSchema = SchemaFactory.createForClass(BingoMessage);
