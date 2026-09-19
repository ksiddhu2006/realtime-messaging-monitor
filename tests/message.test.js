function calculateLatency(sentTime, receivedTime) {
    return receivedTime - sentTime;
}

function validateMessage(data) {
    return (
        data &&
        data.type === "message" &&
        typeof data.message === "string" &&
        data.message.trim().length > 0 &&
        typeof data.clientId === "string" &&
        typeof data.timestamp === "number"
    );
}

describe("Real-Time Messaging System", () => {

    test("calculates message latency correctly", () => {
        const sentTime = 1000;
        const receivedTime = 1008;

        const latency = calculateLatency(sentTime, receivedTime);

        expect(latency).toBe(8);
    });

    test("accepts a valid message", () => {
        const message = {
            type: "message",
            clientId: "CLIENT-AB12",
            message: "Hello",
            timestamp: Date.now()
        };

        expect(validateMessage(message)).toBe(true);
    });

    test("rejects an empty message", () => {
        const message = {
            type: "message",
            clientId: "CLIENT-AB12",
            message: "",
            timestamp: Date.now()
        };

        expect(validateMessage(message)).toBe(false);
    });

    test("rejects a message without a client ID", () => {
        const message = {
            type: "message",
            message: "Hello",
            timestamp: Date.now()
        };

        expect(validateMessage(message)).toBe(false);
    });

    test("rejects an invalid message type", () => {
        const message = {
            type: "invalid",
            clientId: "CLIENT-AB12",
            message: "Hello",
            timestamp: Date.now()
        };

        expect(validateMessage(message)).toBe(false);
    });

});