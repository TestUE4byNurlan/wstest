const http = require('http');
const { Server } = require('socket.io');

// Create an HTTP server
const httpServer = http.createServer();

// Define CORS options with a dynamic origin function
const corsOptions = {
  origin: (_origin, callback) => {
    // Allow all origins - you can customize this logic
    callback(null, true);
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Authorization', 'chat-id'],
  credentials: true,
};

// Create a new Socket.IO server instance with CORS options and custom `allowRequest`
const io = new Server(httpServer, {
  cors: corsOptions,
  allowRequest: (req, callback) => {
    const authHeader = req.headers['authorization'];

    if (authHeader && authHeader === 'Bearer 123') {
      // Allow the request if the Authorization header is exactly "Bearer 123"
      callback(null, true);
    } else {
      // Reject the request with a 401 status code
      callback('Unauthorized', false);
    }
  },
});

// Listen for connection events
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  // Handle events from the client
  socket.on('message', (data) => {
    console.log('Received message:', data);
    socket.emit('response', { message: 'Hello from server!' });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the HTTP server on port 3009
httpServer.listen(3009, () => {
  console.log('Server is running on http://localhost:3009');
});