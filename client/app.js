const clientId = "CLIENT-" + Math.random().toString(36).substring(2, 6).toUpperCase();

document.getElementById("clientId").textContent = clientId;

let socket;
let reconnectAttempts = 0;
let isReconnecting = false;
function connect() {
    socket = new WebSocket("ws://localhost:8080");

    socket.addEventListener("open", () => {
        reconnectAttempts = 0;
isReconnecting = false;
        statusText.textContent = "Connected";
        connectionStatus.classList.add("connected");

        
    });

    socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "system") {
            addMessage(data.message, "system");
            return;
        }

        if (data.type === "message") {
            receivedCount++;

            receivedCountElement.textContent = receivedCount;

            const latency = Date.now() - data.timestamp;

            latencyValues.push(latency);

            updateLatencyStats();

            addMessage(
    `${data.message} (${data.clientId})`,
    data.clientId === clientId ? "user" : "system"
);
        }
    });

    socket.addEventListener("close", () => {
    statusText.textContent = "Reconnecting...";
    connectionStatus.classList.remove("connected");

    if (!isReconnecting) {
        addMessage("Connection lost. Attempting to reconnect...", "system");
        isReconnecting = true;
    }

    reconnectAttempts++;

    const delay = Math.min(1000 * reconnectAttempts, 5000);

    setTimeout(connect, delay);
});

    socket.addEventListener("error", () => {
        statusText.textContent = "Connection Error";
    });
}

connect();

let latencyValues = [];

const connectionStatus = document.getElementById("connectionStatus");
const statusText = document.getElementById("statusText");

const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

const sentCountElement = document.getElementById("sentCount");
const receivedCountElement = document.getElementById("receivedCount");

let sentCount = 0;
let receivedCount = 0;



// Send message
function sendMessage() {

    const message = messageInput.value.trim();

    if (message === "") {
        return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
        alert("Not connected to server.");
        return;
    }

    
    socket.send(
    JSON.stringify({
        type: "message",
        clientId: clientId,
        message: message,
        timestamp: Date.now()
    })
);

    sentCount++;

    sentCountElement.textContent = sentCount;


    messageInput.value = "";
    messageInput.focus();
}


// Add message to screen
function addMessage(message, type) {

    const emptyState = document.querySelector(".empty-state");

    if (emptyState) {
        emptyState.remove();
    }

    const messageElement = document.createElement("div");

    messageElement.classList.add("message");

    if (type === "system") {
        messageElement.classList.add("system");
    }

    const metaElement = document.createElement("div");
    metaElement.classList.add("message-meta");
    metaElement.textContent = type === "user" ? "You" : "System";

    const textElement = document.createElement("div");
    textElement.classList.add("message-text");

    textElement.textContent = message;

    messageElement.appendChild(metaElement);
    messageElement.appendChild(textElement);

    messagesContainer.appendChild(messageElement);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
function updateLatencyStats() {

    if (latencyValues.length === 0) {
        return;
    }


    const total = latencyValues.reduce(
        (sum, value) => sum + value,
        0
    );

    const average = Math.round(
        total / latencyValues.length
    );


    const minimum = Math.min(...latencyValues);

    const maximum = Math.max(...latencyValues);
    const current = latencyValues[latencyValues.length - 1];

document.getElementById("currentLatency").textContent = current;


    document.getElementById("averageLatency").textContent = average;

    document.getElementById("minimumLatency").textContent = minimum;

    document.getElementById("maximumLatency").textContent = maximum;

}
// Button click
sendButton.addEventListener("click", sendMessage);


// Press Enter to send
messageInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        sendMessage();
    }

});