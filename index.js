const express = require('express')
const app = express()
const cors = require("cors")

app.use(cors())
app.use(express.static(__dirname))

const menu = require('./routes/menu');
app.use("/menu", menu)

const meja = require('./routes/meja');
app.use("/meja", meja)

const user = require('./routes/user');
app.use("/user", user)

const transaksi = require('./routes/transaksi');
app.use("/transaksi", transaksi)

app.listen(8080, () => {
    console.log('server run on port 8080')
})