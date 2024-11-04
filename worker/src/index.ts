import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "outbox-procesor",
    brokers: ["localhost:9092"],
});

async function main() {
    const consumer = kafka.consumer({
        groupId: "outbox-procesor-groupId",
    });
    await consumer.connect();
    await consumer.subscribe({
        topic: "zap-events",
        fromBeginning: true,
    });

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                value: message.value.toString(),
                partition,
                offset: message.offset,
            });

            //do some work
            await consumer.commitOffsets([
                {
                    topic: "zap-events",
                    partition,
                    offset: (Number(message.offset) + 1).toString(),
                },
            ]);
        },
    });
}

main();
