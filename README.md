# Kafka NestJS Trial

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

## Description

This project is a practical example of integrating [NestJS](https://nestjs.com/) with Apache Kafka using [kafkajs](https://kafka.js.org/). It demonstrates how to produce and consume messages across multiple topics and partitions, and exposes HTTP endpoints documented with Swagger for easy testing and integration.

## Features
- Produce and consume Kafka messages via HTTP
- Support for multiple topics and partitions
- Configurable consumer group
- Automatic API documentation with Swagger

## How to Run the Project

### 1. Start the Kafka environment with Docker Compose
```bash
docker compose up -d
```

### 2. Install project dependencies
```bash
pnpm install
```

### 3. Start the application in development mode
```bash
pnpm run start:dev
```

### 4. Access Swagger to test the endpoints
Open in your browser:
```
http://localhost:3000/api
```

## Usage Examples

### Send a message to a topic/partition
```bash
curl -X POST http://localhost:3000/kafka/send \
  -H "Content-Type: application/json" \
  -d '{"message":"test message","topic":"topic-1","partition":0}'
```

### View messages and topics
Access AKHQ (if using docker-compose):
```
http://localhost:8080
```

## Folder Structure
```
src/
  controllers/         # HTTP controllers
  services/            # Integration and business logic services
  modules/             # NestJS modules
  main.ts              # Application bootstrap
  app.module.ts        # Main module
```

## Requirements
- Node.js 18+
- pnpm
- Docker and Docker Compose

---

Made with ❤️ using NestJS and Kafka.
