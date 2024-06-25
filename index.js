const connectToMongo=require('./db')  //connection code was written in some other file

connectToMongo().then(console.log("connected to mongo"))
var cors=require('cors')

const express = require('express')
const app = express()
const port = 5000

app.use(express.json())
app.use(cors())
app.use(express.json())


//Routes
app.use('/auth',require('./routes/auth'))
app.use('/notes',require('./routes/notes.js'))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})