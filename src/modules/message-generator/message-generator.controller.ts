import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessageGeneratorService } from './message-generator.service';

@Controller('message-generator')
export class MessageGeneratorController {
  constructor(
    private readonly messageGeneratorService: MessageGeneratorService,
  ) {}

  @Post('/generate')
  generateMessage(@Body() data) {
    this.messageGeneratorService.generateMessage(data);
  }

  @Post('/generate-bingo')
  generateBingoMessage(@Body() data) {
    this.messageGeneratorService.generateBingoMessage(data);
  }

  @Post('/mint')
  async mint(@Body() data) {
    await this.messageGeneratorService.mint(data);
  }
}
