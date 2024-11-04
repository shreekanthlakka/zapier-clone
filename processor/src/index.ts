import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";

const client = new PrismaClient();
const kafka = new Kafka({
    clientId: "outbox-processor",
    brokers: ["localhost:9092"],
});

async function main() {
    const producer = kafka.producer();
    await producer.connect();
    while (1) {
        const pendingRows = await client.zapRunOutBox.findMany({
            where: {},
            take: 10,
        });

        producer.send({
            topic: "zap-events",
            messages: pendingRows.map((ele) => ({
                value: ele.zapRunId,
            })),
        });

        await client.zapRunOutBox.deleteMany({
            where: {
                id: {
                    in: pendingRows.map((ele) => ele.id),
                },
            },
        });
    }
}

main();
