//express module을 가져옴.
const express = require('express')
const app = express()
const port = 3000
const {User} = require("./models/User");
const bodyParser = require("body-parser");
const config = require('./config/key')
//client에서 오는 정보를 가져올 수 있게 해줌.
app.use(bodyParser.urlencoded({extended: true}));
//json type으로 된 것을 분석해서 가져오게 함.
app.use(bodyParser.json());
//mongoose와 mongodb 연결
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
  //mongodb 연결 잘 되었는지 확인
}).then(() => console.log('MongoDB connected....'))
  .catch(err => console.log(err))
app.get('/', (req, res) => {
  res.send('Hello World! 다시 해보자!')
})

app.post('/register', (req, res)=>{
  //회원가입할 때 필요한 정보들을 client에서 가져오면
  //db에 넣어줌.
  //json 형식으로 되어 있는 req.body
  //id: aaa, pw: 1234
  const user = new User(req.body)
  //user 모델에 저장함.
  user.save((err, doc) =>{
    //err면 error message
    if(err)  return res.json({success: false, err})
    //성공하면 json 형식으로 전달
    return res.status(200).json({
      success: true
    })
  })
})

//listen을 하면 print를 함.
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
