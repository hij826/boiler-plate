//express module을 가져옴.
const express = require('express')
const app = express()
const port = 5000
//auth.js에서 auth를 가져옴.
const {auth} = require('./middleware/auth');
const {User} = require("./models/User");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const config = require('./config/key')
//client에서 오는 정보를 가져올 수 있게 해줌.
app.use(bodyParser.urlencoded({extended: true}));
//json type으로 된 것을 분석해서 가져오게 함.
app.use(bodyParser.json());
app.use(cookieParser());
//mongoose와 mongodb 연결
const mongoose = require('mongoose')
const bcrpyt = require('bcrypt');

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
  //mongodb 연결 잘 되었는지 확인
}).then(() => console.log('MongoDB connected....'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/api/hello', (req, res) => res.send('Hello World!'))



app.post('/api/users/register', (req, res)=>{
  //회원가입할 때 필요한 정보들을 client에서 가져오면
  //db에 넣어줌.
  //json 형식으로 되어 있는 req.body
  //id: aaa, pw: 1234
  //사용자가 입력한 정보를 모델에 넣었음.
  const user = new User(req.body)
  //비밀번호 암호화.
  console.log(user)
  //user 모델에 저장함.
  user.save((err, doc) =>{
    //err면 error message 함께 전달
    if(err) return res.json({success: false, err})
    //성공하면 json 형식으로 전달
    return res.status(200).json({
      success: true
    });
  });
});


app.post('/api/users/login', (req, res) => {

  //console.log('ping')
  //요청된 이메일이 DB에 있는지 찾음.
  User.findOne({email: req.body.email}, (err, user)=> {
    //이 이메일을 가진 유저가 한 명도 없다면,
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    //이메일이 같으면 비밀번호 확인
    //요청된 이메일이 DB에 있다면 비밀번호가 맞는 비밀번호인지 확인.
    user.comparePassword(req.body.password, (err, isMatch) =>{
      if(!isMatch) return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다."
      })
      //비밀번호까지 맞다면 토큰을 생성하기.
      //이 user는 user.js에서 받아온 user
      user.generateToken((err, user)=>{
        if(err) return res.status(400).send(err);
        // 토큰을 쿠키, 로컬 스토리지 등에 저장. -> 여러가지 방법 있음.
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id})
      })
    })
  })
})

//role 0--> 일반 유저
//role 0 아니면 --> 관리자
//auth라는 미들웨어 추가
app.get('/api/users/auth',auth ,(req, res) => {

  //여기까지 미들웨어를 통과해왔다는 얘기는 authentication이 true라는 뜻.
  //따라서 통과했다는 것을 client에 정보를 전달해줘야 함.
  res.status(200).json({
    //전달할 수 있는 이유는 auth.js에서 user를 request에 넣었기 때문에.
    _id: req.user._id,
    isAdmin: req.user.role == 0? false: true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

//logout
//login상태기 때문에 auth를 넣어줌.
app.get('/api/users/logout', auth, (req, res) => {
  //id를 찾아서 t 7 oken을 지워줌.
  User.findOneAndUpdate({_id:req.user._id},
  {token: ""}, (err, user)=>{
    if(err) return res.json({success: false, err});
    return res.status(200).send({
      success: true
    })
  })
})

//listen을 하면 print를 함.
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
