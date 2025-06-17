import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka) {}

  async onModuleInit() {
    // Assina o tópico ao iniciar
    this.kafkaClient.subscribeToResponseOf('test-topic');
    await this.kafkaClient.connect();
  }

  async sendMessage(message: string) {
    return this.kafkaClient.emit('test-topic', { message });
  }
}
