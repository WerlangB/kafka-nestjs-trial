# Kafka NestJS Trial

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

## Description

This project is a practical example of integrating [NestJS](https://nestjs.com/) with Apache Kafka using [kafkajs](https://kafka.js.org/). It demonstrates how to produce and consume messages across multiple topics and partitions, includes PostgreSQL integration for data persistence, and exposes HTTP endpoints documented with Swagger for easy testing and integration.

## Features
- 🚀 Produce and consume Kafka messages via HTTP
- 🗃️ PostgreSQL integration with Kafka Connect
- 📊 Support for multiple topics and partitions
- 👥 Configurable consumer groups
- 📖 Automatic API documentation with Swagger
- 🐳 Complete Docker environment setup
- 🔧 Kafka Connect with JDBC connectors
- 📈 AKHQ web interface for Kafka monitoring

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   NestJS App    │    │   Apache Kafka  │    │  PostgreSQL DB  │
│   (Port 3000)   │◄──►│   (Port 9092)   │◄──►│   (Port 5432)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │ Kafka Connect   │              │
         └──────────────►│   (Port 8083)   │◄─────────────┘
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │      AKHQ       │
                        │   (Port 8080)   │
                        └─────────────────┘
```

## Services Overview

| Service | Port | Description |
|---------|------|-------------|
| **NestJS App** | 3000 | Main application with REST API |
| **Kafka Broker** | 9092 | Apache Kafka message broker |
| **PostgreSQL** | 5432 | Database for data persistence |
| **Kafka Connect** | 8083 | Data integration platform |
| **AKHQ** | 8080 | Web UI for Kafka management |
| **Zookeeper** | 2181 | Kafka coordination service |

## How to Run the Project

### 1. Start the complete environment with Docker Compose
```bash
docker compose up -d
```

This will start all services:
- ✅ Zookeeper
- ✅ Kafka Broker  
- ✅ PostgreSQL Database
- ✅ Kafka Connect
- ✅ AKHQ Web Interface

### 2. Install project dependencies
```bash
pnpm install
```

### 3. Start the application in development mode
```bash
pnpm run start:dev
```

### 4. Access the interfaces

**Swagger API Documentation:**
```
http://localhost:3000/api
```

**AKHQ Kafka Management:**
```
http://localhost:8080
```

## Database Setup

The PostgreSQL database comes pre-configured with:
- **Database:** `postgres`
- **User:** `postgres` 
- **Password:** `123`
- **Host:** `localhost:5432`

### Sample Table
A `users` table is automatically created for testing:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100), 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Kafka Topics

Pre-configured topics:
- `postgres-users` - For PostgreSQL data streaming
- Custom topics can be created via API endpoints

## Usage Examples

### Send a message to a topic/partition
```bash
curl -X POST http://localhost:3000/kafka/send \
  -H "Content-Type: application/json" \
  -d '{"message":"test message","topic":"postgres-users","partition":0}'
```

### Insert data into PostgreSQL (will be streamed to Kafka)
```bash
docker exec -it kafka-nestjs-trial-db-1 psql -U postgres -c \
  "INSERT INTO users (name, email) VALUES ('João Silva', 'joao@email.com');"
```

### View Kafka messages
Access AKHQ interface:
```
http://localhost:8080
```

### Test Kafka connectivity
```bash
# List topics
docker exec kafka-nestjs-trial-broker-1 kafka-topics \
  --bootstrap-server localhost:9092 --list

# Consume messages
docker exec kafka-nestjs-trial-broker-1 kafka-console-consumer \
  --bootstrap-server localhost:9092 --topic postgres-users --from-beginning
```

## Kafka Connect Configuration

The project includes JDBC connector configuration for PostgreSQL integration:

### Create JDBC Source Connector
```bash
curl -X POST -H "Content-Type: application/json" \
  --data @jdbc-source-connector.json \
  http://localhost:8083/connectors
```

### Check connector status
```bash
curl http://localhost:8083/connectors/postgres-source-connector/status
```

### List all connectors
```bash
curl http://localhost:8083/connectors
```

## Folder Structure
```
src/
  controllers/         # HTTP controllers for Kafka operations
    kafka.controller.ts           # Main Kafka REST endpoints
    kafka-consumer.controller.ts  # Consumer management endpoints
  services/            # Integration and business logic services
    kafka.service.ts             # Kafka producer/consumer service
    kafkajs.service.ts           # KafkaJS wrapper service
  modules/             # NestJS modules
    kafkajs.module.ts            # Kafka module configuration
  main.ts              # Application bootstrap
  app.module.ts        # Main module

kafka-plugins/         # Kafka Connect plugins
docker-compose.yml     # Complete environment setup
jdbc-source-connector.json  # JDBC connector configuration
```

## Environment Variables

The application supports the following environment variables:

```env
# Kafka Configuration
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=nestjs-kafka-client
KAFKA_GROUP_ID=nestjs-consumer-group

# Database Configuration  
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=123
```

## Troubleshooting

### Common Issues

**1. Kafka Connect fails to start**
- Check if all services are running: `docker compose ps`
- Verify plugin compatibility and versions
- Check logs: `docker compose logs kconnect`

**2. Database connection issues**
- Ensure PostgreSQL is running: `docker compose ps db`
- Verify connection parameters
- Test connection: `docker exec -it kafka-nestjs-trial-db-1 psql -U postgres`

**3. Port conflicts**
- Check if ports are already in use: `netstat -tulpn | grep :PORT`
- Modify port mappings in docker-compose.yml if needed

### Logs Access
```bash
# View all services logs
docker compose logs

# View specific service logs
docker compose logs broker
docker compose logs db
docker compose logs kconnect
```

## Requirements
- Node.js 18+
- pnpm
- Docker and Docker Compose
- Git (for cloning and version control)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

Made with ❤️ using NestJS, Apache Kafka, and PostgreSQL.
