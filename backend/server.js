if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server: SocketServer } = require("socket.io");
const UserUtil = require("./utils/users");
const ChatUtil = require("./utils/chats");
const { v4: uuidv4 } = require("uuid");

require("./passport-config")(
  passport,
  UserUtil.findUserByEmail,
  UserUtil.findUserById
);
app.listen(5000);
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(flash());
app.use(
  session({
    name: "token",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Routes

app.get("/user", (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(400).send();
  }
});

app.get("/users", (req, res) => {
  res.json(UserUtil.getUsers());
});

app.get("/chat", (req, res) => {
  const userId = req.user.id;
  const recipientId = Number(req.query.recipientId);
  let chat = ChatUtil.getChat(userId, recipientId);
  if (!chat) {
    chat = ChatUtil.createChat([userId, recipientId]);
  }
  res.json(chat);
});

app.post("/message", (req, res) => {
  const userId = req.user.id;
  const chatId = req.body.chatId;
  const text = req.body.text;
  ChatUtil.sendMessage(chatId, {
    text,
    senderId: userId,
  });
  res.send("Message sent!");
});

app.post("/login", (req, res, next) =>
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (info) res.status(400).send(info.message);
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
      });
    }
  })(req, res, next)
);

app.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      throw new Error("Passwords don't match");
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    UserUtil.addUser({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
    });
    res.status(200).send("User registered succesfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Websockets
let onlineUsers = [];
const io = new SocketServer(4000, {
  cors: "http://localhost:3000",
});
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("addNewUser", (userId, username) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({
        username,
        userId,
        socketId: socket.id,
      });
    }
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.userId !== message.senderId);

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket);
    io.emit("getOnlineUsers", onlineUsers);
  });
});
