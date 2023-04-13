const express = require('express')
const cors = require('cors')
const app = express()
const dotenv = require('dotenv');

dotenv.config();

app.use(express.json())
app.use(cors())

const route = require('./routes/index')
route(app)


const database = require('./config/db/index');
const db = new database();

console.log(process.env.ACCESS_TOKEN_LIFE);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listenting on port ${port}`);
  db.connect().then((err, result) => {
    if (err) throw err;
    console.log("database is connected");
  });
});