import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { KafkaJsService } from '../kafka/kafkajs.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly kafkaJsService: KafkaJsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('kafka/send')
  async sendKafkaMessage(@Body('message') message: string) {
    await this.kafkaJsService.sendMessage(message);
    return { status: 'sent', message };
  }
}
