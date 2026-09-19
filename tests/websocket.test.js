const WebSocket = require("ws");
const { createServer } = require("../server/server");

describe("WebSocket Server", () => {
    let server;
    let port;

    beforeEach((done) => {
        port = 9000 + Math.floor(Math.random() * 1000);

        server = createServer(port);

        server.on("listening", done);
    });

    afterEach((done) => {
        server.close(done);
    });

    test("client receives connection confirmation", (done) => {
        const client = new WebSocket(`ws://localhost:${port}`);

        client.on("message", (data) => {
            const message = JSON.parse(data.toString());

            expect(message.type).toBe("system");
            expect(message.message).toContain("Connected");

            client.close();
            done();
        });
    });

    test("server broadcasts messages to connected clients", (done) => {
        const clientA = new WebSocket(`ws://localhost:${port}`);
        const clientB = new WebSocket(`ws://localhost:${port}`);

        let clientAReady = false;
        let clientBReady = false;

        function trySendMessage() {
            if (clientAReady && clientBReady) {
                clientA.send(JSON.stringify({
                    type: "message",
                    clientId: "CLIENT-TEST",
                    message: "Hello WebSocket",
                    timestamp: Date.now()
                }));
            }
        }

        clientA.on("open", () => {
            clientAReady = true;
            trySendMessage();
        });

        clientB.on("open", () => {
            clientBReady = true;
            trySendMessage();
        });

        clientB.on("message", (data) => {
            const message = JSON.parse(data.toString());

            if (message.type !== "message") {
                return;
            }

            expect(message.message).toBe("Hello WebSocket");
            expect(message.clientId).toBe("CLIENT-TEST");

            clientA.close();
            clientB.close();
        });

        let closedClients = 0;

        function handleClose() {
            closedClients++;

            if (closedClients === 2) {
                done();
            }
        }

        clientA.once("close", handleClose);
        clientB.once("close", handleClose);
    });
});