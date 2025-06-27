import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.main.Main;
import org.apache.camel.CamelContext;
import org.apache.camel.impl.DefaultCamelContext;

public class CamelKafkaConsumer {
    
    public static void main(String[] args) throws Exception {
        CamelContext context = new DefaultCamelContext();
        
        context.addRoutes(new RouteBuilder() {
            @Override
            public void configure() throws Exception {
                
                // Route to consume from Kafka and save to file
                from("kafka:postgres-users?brokers=broker:29092&groupId=camel-consumer&autoOffsetReset=earliest")
                    .log("Message received from Kafka: ${body}")
                    .transform().simple("[${date:now:yyyy-MM-dd HH:mm:ss}] ${body}\n")
                    .to("file:/tmp/output?fileName=kafka-messages.txt&fileExist=Append")
                    .log("Message saved to file");
                    
                // Route to process JSON messages
                from("kafka:postgres-users?brokers=broker:29092&groupId=camel-processor&autoOffsetReset=earliest")
                    .log("Processing JSON message: ${body}")
                    .unmarshal().json()
                    .choice()
                        .when().jsonpath("$.email")
                            .log("Email found: ${header.CamelJsonPathResult}")
                            .transform().simple("ID: ${body[id]}, Name: ${body[name]}, Email: ${body[email]}, Timestamp: ${date:now:yyyy-MM-dd HH:mm:ss}\n")
                            .to("file:/tmp/output?fileName=processed-users.txt&fileExist=Append")
                        .otherwise()
                            .log("Message without valid email")
                    .end();
            }
        });
        
        System.out.println("=== Camel Kafka Consumer started ===");
        System.out.println("Waiting for messages from 'postgres-users' topic...");
        
        context.start();
        Thread.sleep(Long.MAX_VALUE); // Keep running
    }
}
