const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const PORT = process.env.PORT || 9000;
const app = express();
let server = http.createServer(app);
// const cors = require("cors");
const Users = require("./models/users");
const Test = require("./models/test");
const GlobalMessage = require("./models/globalMessages");
const ChatLog = require("./models/chatLog");
const mongoose = require("mongoose");
const morgan = require("morgan");
const fs = require("fs");
var accessLogStream = fs.createWriteStream("./access.log", { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));
// app.use(morgan('dev'))
// morgan('tiny')

let io = socketIO(server);
const session = require("express-session");
// var bodyParser = require("body-parser");
const serveStatic = require("serve-static");
const path = require("path");
const htmlpath = path.join(__dirname, "../../dist/");
// console.log(htmlpath);
var history = require("connect-history-api-fallback");
// app.get('/chat', function (req,res) {
//   res.sendFile(htmlpath+"index.html");
// });
// console.log("help");
// console.log(app._router.stack)
io.on("connection", (socket) => {
  console.log("connected!!!!!!!!!!!!!");
  socket.on("sendMessage", async (data) => {
    console.log(data);
    await GlobalMessage.create(data);
    console.log("message added to db");
    socket.emit("newMessage", data);
    socket.broadcast.emit("newMessage", data);
  });
  socket.on("newUser", (data) => {
    socket.emit("newUserJoined", "You joined");
    socket.broadcast.emit("newUserJoined", `${data} joined`);
  });
  socket.on("chatInput", async (data) => {
    console.log(data);
    await ChatLog.create(data);
  });
});
const serveMarkup = function(req,res,next){
  res.sendFile(htmlpath + "index.html");
  next();
}
const middleWare = function(req, res, next) {
  console.log('object');
  res.sendFile(htmlpath + "index.html");
  next();
};
const newmw = function(req, res, next) {
  console.log("i mido");
  next();
};
const d = function(req, res, next) {
  console.log("?????????????");
  next();
};
const checkLogin = function(req, res, next) {
  // let username
  console.log(req.session.authenticated);
  console.log('here');
  if (req.session.authenticated) {
  //   console.log('redirect');
  //   // username=req.session.username
    next()
     
     
  }else{
    console.log(req.session.authenticated);
    res.redirect('/')
  }
  
};

app.use(function(req, res, next) {
  console.log("Time:", Date.now());
  next();
});
// app.use(newmw)
// var jsonParser = bodyParser.json();
// app.use(
//   cors({
//     origin: "http://localhost:8080",
//     credentials: true,
//   })
// );
app.use(serveStatic(path.join(__dirname, "../../dist")));
// const staticFileMiddleware = express.static('../../dist');

// // 1st call for unredirected requests
// app.use(staticFileMiddleware);

// // Support history api
// app.use(history({
//   index: '../../dist/index.html'
// }));

// // 2nd call for redirected requests
// app.use(staticFileMiddleware);

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use(express.json());

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
// app.use(express.static('index.html'))
// app.use(express.static("public"));

mongoose
  .connect(
    "mongodb+srv://uchiha:uchiha123@cluster0.y4nte.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log("db connection error");
  });
app.post("/api/login", async (req, res) => {
  if (req.session.authenticated) {
    res.send({
      message: "already logined",
    });
  } else {
    const username = req.body.username;
    const password = req.body.password;
    Users.findOne({ username: username }, function(err, user) {
      if (err) {
        console.log(err);
        return;
      }
      if (user) {
        console.log(user.password, "user.pass");
        console.log(username + " and " + password);
        if (user.password === password) {
          req.session.authenticated = true;
          req.session.username = username;
          res.status(200).send({
            message: "login success",
            status: 1,
          });
        } else {
          res.status(200).send({
            message: "Wrong password",
            status: 13,
          });
        }
      } else {
        res.status(200).send({
          message: "user does not exist",
          status: 14,
        });
      }
    });
  }
});
app.post("/api/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  Users.findOne({ username: username }, function(err, user) {
    if (err) {
      console.log(error);
      return handleError(err);
    }
    if (user) {
      res.status(200).send({
        message: "username taken",
      });
    } else {
      Users.create(
        {
          username: username,
          password: password,
        },
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(200).send({
              msg: "error",
            });
            return;
          }
          res.status(200).send({
            newObj: result,
          });
        }
      );
    }
    // Prints "Space Ghost is a talk show host".
  });
});
app.get("/api/checkLogin", async (req, res) => {
  if (req.session.authenticated) {
    res.status(200).send({
      message: "login",
      status: 1,
      username: req.session.username,
    });
  } else {
    // setTimeout(() => {
    res.status(200).send({
      message: "nlogin",
      status: 13,
    });
    // }, 3000);
  }
});

// app.get('/', (req,res) => {
//   res.sendFile(path.join(__dirname, '../../dist/index.html'));
// });
app.get("/chat",checkLogin, serveMarkup,(req, res) => {
  

  console.log("hit");
  // res.sendFile(htmlpath+"index.html");
});

// app.get("/globalChat",serveMarkup,(req,res)=>{
//   let oop=app._router.stack.find((layer)=>{
//     return layer.path=="/globalChat"
//   })
//   let oops=oop.route.stack
//   console.log(oop)
//   console.log(oops)

//   console.log('done');
// })

app.get("/ko", middleWare, (req, res) => {
  console.log("hit");
  // res.sendFile(htmlpath+"index.html");
});

app.get("/yoyo", checkLogin, async (req, res) => {
  // Message.findOne({ username: username }, function(err, user) {
  // for (let index = 0; index < 10000; index++) {
  // const q= Math.round(Math.random() * 10000)
  // console.log(q);
  // await Test.create({ t: q });

  // }
  console.log("done");
  res.status(200).send({ msg: "done" });

  // })
  // Test.find()
  //   .limit(20)
  //   .sort({ $natural: -1 })
  //   .then((resolve) => {
  //     console.log(resolve);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // setTimeout(() => {
  //   console.log(qq);
  // }, 4000);
});

app.get("/add", async (req, res) => {
  const q = Math.round(Math.random() * 10000);
  console.log(q);
  await GlobalMessage.create({
    content: "yahallo",
    sender: "anonymous",
    time: q,
  });

  // }
  console.log("done zo");
});

app.get("/api/getMessage", async (req, res) => {
  let messages = await GlobalMessage.find()
    .limit(20)
    .sort({ $natural: -1 });
  // console.log(messages);
  res.status(200).send(messages);
});
