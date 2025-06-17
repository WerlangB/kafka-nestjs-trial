import { Module } from '@nestjs/common';
import { KafkaJsModule } from '../kafka/kafkajs.module';
import { KafkaJsService } from '../kafka/kafkajs.service';
import { AppService } from '../services/app.service';
import { AppController } from '../controllers/app.controller';

@Module({
  imports: [KafkaJsModule],
  controllers: [AppController],
  providers: [AppService, KafkaJsService],
})
export class AppModule {}
