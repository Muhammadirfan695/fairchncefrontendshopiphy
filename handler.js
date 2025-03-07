// const serverless = require("serverless-http");
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
var cors = require('cors');
const { errorHandler } = require('./backend/middleware/errorMiddleware');
// const { logger } = require('./backend/middleware/logMiddleware');
const db = require('./backend/config/db');
const colors = require('colors');
var busboy = require('connect-busboy');
const fileUpload = require('express-fileupload');
var path = require('path');
const morganBody = require('morgan-body');
const fs = require('fs');
var cron = require('node-cron');
const Conversation = require('./backend/schemas/Conversations');
app.use('/uploads', express.static('uploads'));
const mongoose = require('mongoose');
const {
  socketMongoPOST,
  getSocketUsingSocket_id,
  deleteAll,
  getuser_idFromSocket_id,
  getUserTypeByUserId,
  sendNotificationUserOffline,
  getUserByUserId,
} = require('./backend/controllers/socketController');
app.use(
  fileUpload({
    createParentPath: true,
  })
);
const moment = require('moment-timezone');
// load db
db();
const date = moment().format('YYYY-MM-DD');
const accessLogStream = fs.createWriteStream(
  path.join(__dirname + '/backend/logs/', `access_${date}.log`),
  { flags: 'a' }
);

app.use(express.json());
app.use(busboy());
app.use(express.urlencoded({ extended: false }));
morganBody(app, { logAllReqHeader: true, maxBodyLength: 5000, stream: accessLogStream });

app.use(cors());

app.use('/api/auth', cors(), require('./backend/routes/userRoutes').default);
app.use('/api/file', cors(), require('./backend/routes/OAuthCallback'));
app.use('/api/conversation', cors(), require('./backend/routes/conversationRoutes'));
app.use(errorHandler);
app.use((req, res, next) => {
  return res.status(404).json({
    error: 'Route Not Found',
  });
});

(async () => {
  const app = require('express')();
  const server = require('http').createServer(app);
  const io = require('socket.io')(server);

  io.on('connection', async (socket) => {
    console.log('Connected - Client socket io');

    const query = socket.handshake.query;
    const user_id = query.user_id;
    const socket_id = socket.id;

    if (!user_id) {
      socket.disconnect(true);
    }

    await socketMongoPOST(socket_id, user_id, 'create');

    socket.on('disconnect', async () => {
      await socketMongoPOST(socket_id, user_id, 'delete');
      console.log('Disconnected - Server');
    });

    socket.on('message', async (data) => {
      try {
        const sender_id = await getSocketUsingSocket_id(null, data.to);

        data.timesince = moment().fromNow();
        const messageObj = {
          sender: new mongoose.Types.ObjectId(user_id),
          message: data.payload,
          message_type: data.type,
        };

        let conversation = await Conversation.findOne({
          sender_id: user_id,
          receiver_id: data.to,
        });

        if (!conversation) {
          conversation = await Conversation.findOne({
            sender_id: data.to,
            receiver_id: user_id,
          });
        }

        await Conversation.updateOne(
          { _id: conversation._id },
          { $push: { messages: messageObj } }
        );

        if (sender_id && sender_id != null && sender_id != undefined) {
          io.to(sender_id)?.emit('message', data);
        } else {
          await getUserByUserId(user_id);
          // const notification_obj = { title: `${user.name}`, message: data.payload, body: data.payload, object: messageObj, type: "conversation", status: 4, color: "#fff" }
          // await sendNotificationUserOffline(data.to, notification_obj);
        }
      } catch (error) {
        console.error('Error ==== >>> ', error);
      }
    });
  });

  server.listen(process.env.PORT_SOCKETIO, () => {
    console.log(`socketio connected on port: ${process.env.PORT_SOCKETIO}`);
  });

  process.on('exit', async () => {
    await deleteAll();
  });
})();

app.listen(process.env.PORT, () =>
  console.log(
    `Server listening in port ${process.env.PORT} url: http://localhost:${process.env.PORT}`
  )
);

// module.exports.api = serverless(app);
