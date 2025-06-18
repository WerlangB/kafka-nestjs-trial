import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('kafka-consumer')
export class KafkaConsumerController {
  private readonly logger = new Logger(KafkaConsumerController.name);

  @MessagePattern('test-topic')
  async handleKafkaMessage(@Payload() message: any) {
    this.logger.log(`Mensagem recebida do Kafka: ${JSON.stringify(message.value)}`);
  }
}
