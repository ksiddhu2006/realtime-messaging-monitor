## REAL TIME MESSAGING AND LATENCY MONITOR

A WebSocket-based real-time messaging application built to explore low-latency communication, multi-client messaging, connection resilience, latency monitoring, and automated testing.

## OVERVIEW

This project is a browser-based real-time communication system where multiple clients can connect to a Node.js WebSocket server and exchange messages instantly.

The application also measures message delivery latency and displays current, average, minimum, and maximum latency values.

The project was built as a practical exploration of real-time communication and software engineering concepts such as WebSockets, client-server architecture, connection recovery, input validation, and automated testing.

## FEATURES

- Real-time messaging using WebSockets
- Multi-client message broadcasting
- Unique client identification
- Connection status monitoring
- Automatic WebSocket reconnection
- Current message latency measurement
- Average, minimum, and maximum latency statistics
- Server-side message validation
- Safe frontend message rendering
- Automated unit tests with Jest
- WebSocket integration tests

## TECH STACK

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- WebSocket (`ws`)

### Testing
- Jest
- WebSocket integration testing

### Development Tools
- Visual Studio Code
- npm
- Git
- GitHub


## LATENCY MONITORING

-The application records a timestamp when a message is sent and compares it with the time when the broadcast message is received by the client.

- The dashboard displays:

i. Current latency
ii. Average latency
iii. Minimum latency
iv. Maximum latency

-Because the current implementation runs locally, the measured latency represents local message processing and WebSocket delivery rather than production network latency.

## RELIATBILITY

-The client monitors the WebSocket connection and automatically attempts to reconnect if the connection is lost.

-The reconnection delay increases between attempts and is capped to avoid continuously retrying at a very high frequency.

## VALIDATION AND SECURITY

-Incoming messages are validated on the server before being broadcast.

-The frontend also uses safe text rendering for user-generated messages rather than directly inserting message content as HTML.

## TESTING

The project includes automated tests using Jest. The test suite covers:

-Message latency calculation
-Valid message validation
-Empty message rejection
-Missing client ID rejection
-Invalid message type rejection
-WebSocket connection confirmation
-Multi-client message broadcasting

Run the tests with: npm test