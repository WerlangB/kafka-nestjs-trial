# Trying Kafka with NestJs, PostgreSQL e Apache Camel

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

## Description

This project is a comprehensive example of integrating [NestJS](https://nestjs.com/) with Apache Kafka using [kafkajs](https://kafka.js.org/), and includes an [Apache Camel](https://camel.apache.org/) consumer for advanced message processing. It demonstrates how to produce and consume messages across multiple topics and partitions, includes PostgreSQL integration with Kafka Connect for data streaming, and features a custom Camel consumer that processes messages and writes them to files.

## Features
- 🚀 Produce and consume Kafka messages via HTTP
- 🗃️ PostgreSQL integration with Kafka Connect
- � Apache Camel consumer for advanced message processing
- 📄 File output generation from Kafka messages
- �📊 Support for multiple topics and partitions
- 👥 Configurable consumer groups
- 📖 Automatic API documentation with Swagger
- 🐳 Complete Docker environment setup
- 🔧 Kafka Connect with JDBC connectors
- 📈 AKHQ web interface for Kafka monitoring
- 🔄 JSON message processing and filtering

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
                                 │
                        ┌─────────────────┐
                        │ Apache Camel    │
                        │   Consumer      │
                        │  (Containerized)│
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │  Output Files   │
                        │ (camel-output/) │
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
| **Camel Consumer** | - | File-based message processor |

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
- ✅ Apache Camel Consumer

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

## Apache Camel Consumer

The project includes a containerized Apache Camel consumer that:
- 📥 Consumes messages from the `postgres-users` topic
- 📄 Writes raw messages to `camel-output/kafka-messages.txt`
- 🔍 Processes JSON messages and extracts user data
- 📝 Writes filtered user data to `camel-output/processed-users.txt`

### Camel Routes Configuration
The consumer implements two routes:
1. **Raw Message Route**: Saves all messages with timestamps
2. **JSON Processing Route**: Filters messages containing email fields

### Viewing Output Files
```bash
# View raw messages
cat camel-output/kafka-messages.txt

# View processed user data
cat camel-output/processed-users.txt

# Monitor files in real-time
tail -f camel-output/*.txt
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

## Connector Configuration Files

The project includes pre-configured connector templates:

### JDBC Source Connector (`jdbc-source-connector.json`)
Streams data from PostgreSQL `users` table to `postgres-users` topic.

### JDBC Sink Connector (`postgres-sink-connector.json`)  
Writes Kafka messages back to PostgreSQL tables.

### File Sink Connector (`file-sink-connector.json`)
Alternative file-based sink connector (requires FileStreamSink plugin).

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

# Apache Camel Consumer
src/main/java/
    CamelKafkaConsumer.java      # Camel consumer implementation
pom.xml                          # Maven dependencies
Dockerfile.camel                 # Camel consumer Docker build

# Configuration Files
jdbc-source-connector.json       # JDBC source connector config
postgres-sink-connector.json     # JDBC sink connector config
file-sink-connector.json         # File sink connector config
docker-compose.yml               # Complete environment setup

# Output
camel-output/                    # Camel consumer output files
    kafka-messages.txt           # Raw messages with timestamps
    processed-users.txt          # Processed JSON user data

kafka-plugins/                   # Kafka Connect plugins (commented out)
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

**4. Camel consumer not processing messages**
- Check if topic exists: `docker exec kafka-nestjs-trial-broker-1 kafka-topics --bootstrap-server localhost:9092 --list`
- Verify consumer is running: `docker compose ps camel-consumer`
- Check Camel logs: `docker compose logs camel-consumer`
- Ensure output directory exists: `ls -la camel-output/`

### Logs Access
```bash
# View all services logs
docker compose logs

# View specific service logs
docker compose logs broker
docker compose logs db
docker compose logs kconnect
docker compose logs camel-consumer

# Follow logs in real-time
docker compose logs -f camel-consumer
```

## Testing the Complete Flow

### 1. Insert test data into PostgreSQL
```bash
docker exec -it kafka-nestjs-trial-db-1 psql -U postgres -c \
  "INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com');"
```

### 2. Check if message was sent to Kafka
```bash
# View messages in AKHQ
open http://localhost:8080

# Or use command line
docker exec kafka-nestjs-trial-broker-1 kafka-console-consumer \
  --bootstrap-server localhost:9092 --topic postgres-users --from-beginning
```

### 3. Verify Camel consumer processed the message
```bash
# Check output files
tail -f camel-output/*.txt
```

## Requirements
- Node.js 18+
- pnpm
- Docker and Docker Compose
- Git (for cloning and version control)
- Java 17+ (for Camel consumer development)
- Maven 3.8+ (for building Camel consumer)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

Made with ❤️ using NestJS, Apache Kafka, Apache Camel, and PostgreSQL.
