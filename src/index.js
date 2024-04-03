const express = require("express");
const cors = require('cors');
const routes = require('./routes');
const io = require('./sockets');
var  sessions = require('express-session');
const config = require('config');
const port = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
const app = express();

app.use(cors());
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(sessions({
  secret: '12221',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 
  }
}));

app.use('/', routes);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
