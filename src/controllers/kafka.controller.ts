import { Controller, Post, Body } from '@nestjs/common';
import { KafkaJsService } from '../services/kafkajs.service';

@Controller('kafka')
export class KafkaController {
  constructor(private readonly kafkaJsService: KafkaJsService) {}

  @Post('send')
  async sendKafkaMessage(
    @Body('message') message: string,
    @Body('topic') topic?: string,
    @Body('partition') partition?: number,
  ) {
    await this.kafkaJsService.sendMessage(message, topic, partition);
    return { status: 'sent', message, topic: topic ?? 'topic-1', partition };
  }
}
