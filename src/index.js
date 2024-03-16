const express = require("express");
const app = express();
const cors = require('cors');
const routes = require('./routes');
const io = require('./sockets');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1000mb' })); // Set the limit here
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Adjusted for larger payloads

app.use('/', routes);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
