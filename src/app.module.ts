import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageGeneratorModule } from './modules/message-generator/message-generator.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MessageGeneratorModule,
  ],
})
export class AppModule {}
