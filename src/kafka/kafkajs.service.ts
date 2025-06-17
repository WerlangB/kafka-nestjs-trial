import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';

@Injectable()
export class KafkaJsService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka = new Kafka({ brokers: ['localhost:9092'] });
  private readonly producer: Producer = this.kafka.producer();
  private readonly consumer: Consumer = this.kafka.consumer({ groupId: 'nestjs-kafkajs-demo' });
  private readonly logger = new Logger(KafkaJsService.name);

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'test-topic', fromBeginning: true });
    this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        this.logger.log(`Mensagem recebida: ${message.value?.toString()}`);
      },
    });
  }

  async sendMessage(message: string) {
    await this.producer.send({
      topic: 'test-topic',
      messages: [{ value: message }],
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }
}
