const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require('dotenv').config();
const { dbConnect } = require('./utiles/db')
const { Server } = require('socket.io');

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174'
    ],
    credentials: true,
  }
});

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174'
    ],
    credentials: true,
  })
)

const users = [];
let adminSocketId = null;

const add_user = (userId, userSocketId) => {
  const checkUser = users.some((u) => u.userId === userId);
  if (!checkUser) {
    users.push({ userId, userSocketId });
  }
};

const remove_user_by_socket = (socketId) => {
  const index = users.findIndex((u) => u.userSocketId === socketId);
  if (index !== -1) {
    users.splice(index, 1);
  }
};

const get_user_socket_by_id = (userId) => {
  const user = users.find((u) => u.userId === userId);
  return user?.userSocketId;
};

io.on('connection', (socket) => {
  // console.log('Socket connected:', socket.id);

  socket.on('join_user', ({ userId }) => {
    add_user(userId, socket.id);
    io.emit('activeUser', users);
    if (adminSocketId) {
      io.emit('activeAdmin', true);
    }
  });

  socket.on('join_admin', () => {
    adminSocketId = socket.id;
    io.emit('activeAdmin', true);
    io.to(adminSocketId).emit('activeUser', users);
  });

  socket.on('send_message_user_to_admin', (msg) => {
    if (adminSocketId) {
      io.to(adminSocketId).emit('received_user_message', msg);
    }
  });

  socket.on('send_message_admin_to_user', (msg) => {
    const userSocketId = get_user_socket_by_id(msg.receverId);
    if (userSocketId) {
      io.to(userSocketId).emit('received_admin_message', msg);
    }
  });

  socket.on('admin_typing_status', (data) => {
    const userSocketId = get_user_socket_by_id(data.userId);
    if (userSocketId) {
      if (data.text && data.text.trim() !== '') {
        io.to(userSocketId).emit('admin_typing', true);
      } else {
        io.to(userSocketId).emit('admin_typing', false);
      }
    }
  });

  socket.on('user_typing_status', (data) => {
    if (data.text && data.text.trim() !== '') {
      io.emit('user_typing', data);
    } else {
      io.emit('user_typing', data);
    }
  });

  socket.on('update_delivery_status', (data) => {
    io.emit('update_order_status', data);
  });

  socket.on('disconnect', () => {
    // console.log('disconnect -- ', socket.id);
    remove_user_by_socket(socket.id);
    io.emit('activeUser', users);

    if (socket.id === adminSocketId) {
      adminSocketId = null;
      io.emit('activeAdmin', false);
    }
  });
});

// Middleware 
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())

// API routes
app.use("/api", require("./routes/authRoutes"));
app.use('/api', require('./routes/categoryRoutes'));
app.use('/api', require('./routes/productRoutes'));
app.use('/api', require('./routes/homeRoutes'));
app.use('/api', require('./routes/cardRoutes'));
app.use('/api', require('./routes/orderRoute'));
app.use('/api', require('./routes/wishlistRoutes'));
app.use('/api', require('./routes/chatRoute'));
app.use('/api', require('./routes/paymentRoutes'));

// Main route
app.get('/', (req, res) => { res.send('Hello World!') })

// Connect DB
dbConnect();

const PORT = process.env.PORT || 5000;


server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
