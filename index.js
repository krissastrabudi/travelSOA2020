const express = require('express');
const app = express();
const cors = require('cors');
const users = require('./routes/user');
const hotel = require('./routes/hotel');
const booking = require('./routes/booking');
const reschedule = require('./routes/reschedule');
const comment = require('./routes/comment');

app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use("/api/request",reschedule);
app.use('/api/user',users);
app.use('/api/hotel',hotel);
app.use("/api/booking",booking);
app.use("/api/comment",comment);

const port = process.env.PORT || 3000

app.get('/', (req, res) => res.send("Hello world"))

app.listen(port, () => console.log(`Listening on port ${port}!`))