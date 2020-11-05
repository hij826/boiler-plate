//express module을 가져옴.
const express = require('express')
const app = express()
const port = 3000

//mongoose와 mongodb 연결
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://hyein:yogurt59@boilerplate.5zedw.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
  //mongodb 연결 잘 되었는지 확인
}).then(() => console.log('MongoDB connected....'))
  .catch(err => console.log(err))
app.get('/', (req, res) => {
  res.send('Hello World! 다시 해보자!')
})


//listen을 하면 print를 함.
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
