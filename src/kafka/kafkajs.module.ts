import { Module } from '@nestjs/common';
import { KafkaJsService } from './kafkajs.service';

@Module({
  providers: [KafkaJsService],
  exports: [KafkaJsService],
})
export class KafkaJsModule {}
