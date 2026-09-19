const WebSocket = require("ws");

const PORT = 8080;

function createServer(port = PORT) {
    const wss = new WebSocket.Server({ port });

    wss.on("connection", (socket) => {
        console.log("New client connected");

        socket.send(JSON.stringify({
            type: "system",
            message: "Connected to the real-time server!"
        }));

        socket.on("message", (data) => {
            try {
    const messageData = JSON.parse(data.toString());

    const isValidMessage =
        messageData &&
        messageData.type === "message" &&
        typeof messageData.clientId === "string" &&
        messageData.clientId.trim().length > 0 &&
        typeof messageData.message === "string" &&
        messageData.message.trim().length > 0 &&
        typeof messageData.timestamp === "number";

    if (!isValidMessage) {
        console.log("Rejected invalid message");
        return;
    }

    console.log(
        `Message received from ${messageData.clientId}:`,
        messageData.message
    );

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: "message",
                clientId: messageData.clientId,
                message: messageData.message,
                timestamp: messageData.timestamp
            }));
        }
    });

} catch (error) {
    console.error("Invalid message received:", error);
}
        });

        socket.on("close", () => {
    if (process.env.NODE_ENV !== "test") {
        console.log("Client disconnected");
    }
});
    });

    return wss;
}

if (require.main === module) {
    const wss = createServer();

    console.log(
        `WebSocket server running on ws://localhost:${PORT}`
    );
}

module.exports = { createServer };