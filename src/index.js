const express = require("express");
const app = express();
const cors = require('cors');
const routes = require('./routes');
const io = require('./sockets');
const port = process.env.port || 5000;


app.use(cors());
app.use(express.json());
app.use('/', routes);


app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
