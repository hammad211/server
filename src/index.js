const express = require("express");
const app = express();
const cors = require('cors');
const routes = require('./routes');
const io = require('./sockets');
const bodyParser = require('body-parser');

const port = process.env.port || 5000;


app.use(cors());
app.use(express.json());
app.use('/', routes);
app.use(bodyParser.json({ limit: '1000mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
