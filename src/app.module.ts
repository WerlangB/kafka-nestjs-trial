import { Module } from '@nestjs/common';
import { KafkaController } from './controllers/kafka.controller';
import { KafkaConsumerController } from './controllers/kafka-consumer.controller';
import { KafkaJsModule } from './modules/kafkajs.module';
import { KafkaJsService } from './services/kafkajs.service';

@Module({
  imports: [KafkaJsModule],
  controllers: [KafkaController, KafkaConsumerController],
  providers: [KafkaJsService],
})
export class AppModule {}