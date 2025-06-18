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
    // Consumindo dois tópicos
    await this.consumer.subscribe({ topic: 'topic-1', fromBeginning: true });
    await this.consumer.subscribe({ topic: 'topic-2', fromBeginning: true });
    this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        this.logger.log(
          `Tópico: ${topic} | Partição: ${partition} | Mensagem: ${message.value?.toString()}`
        );
        // Exemplo: processar só mensagens da partição 0 de topic-1
        if (topic === 'topic-1' && partition === 0) {
          this.logger.log('Processando mensagem da partição 0 de topic-1');
        }
      },
    });
  }

  async sendMessage(message: string, topic = 'topic-1', partition?: number) {
    await this.producer.send({
      topic,
      messages: [partition !== undefined ? { value: message, partition } : { value: message }],
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }
}
