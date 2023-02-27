import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

import { Message, MessageSchema } from './message.model';
import { MessageGeneratorController } from './message-generator.controller';
import { MessageGeneratorService } from './message-generator.service';
import { BingoMessage, BingoMessageSchema } from './bingo-message.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      },
      {
        name: BingoMessage.name,
        schema: BingoMessageSchema,
      },
    ]),
    HttpModule,
  ],
  controllers: [MessageGeneratorController],
  providers: [MessageGeneratorService],
})
export class MessageGeneratorModule {}
