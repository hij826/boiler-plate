const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//salt 몇 자리인지 나타냄.
const saltRounds = 10;
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type:String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlengh: 50
  },
  role: {
    //number에 따라 관리자와 사용자를 나눔.
    type: Number,
    default: 0
  },
  image: String,
  //유효성 관리
  token: {
    type: String,
  },
  //token 유효기간
  tokenExp: {
    type: Number
  }
})



//저장하기 전에 실행하고 다 끝나면
//next function으로 register(post)로 보냄.
userSchema.pre('save', function(next){
  //위에 스키마를 가리킴.
  var user = this;

// 비밀번호 암호화
//비밀번호를 바꿀때에만 암호화 해야 함. 그래서 조건을 검.
if(user.isModified('password')){

  //1) salt 만들기
  bcrypt.genSalt(saltRounds, function(err, salt) {
    //에러 나면 next로 보내버림.
    if(err) return next(err);
    //2) hash된 비밀번호로 모델에 있는 비번 바꿔줌.
    //user.password: 사용자가 입력한 비밀번호(모델에 저장되어 있음)
    //hash: 암호화된 비밀번호
      bcrypt.hash(user.password, salt, function(err, hash) {
          // Store hash in your password DB.
          if(err) return next(err);
          //hash 암호 만드는데 성공했다면
          //hash된 비밀번호로 바꿔줌.
          user.password = hash;
          next();
    })
  })
//비밀번호 바꾸는거 아니면 그냥 넘어감.
}else{
  next();
}
});

userSchema.methods.comparePassword = function(plainPassword, cb){
  //plainPassword: abced   암호화된 비밀번호: $2b$10$Bc3MAlYenqd3TdQN/tr4wessYsw/UDNYT9EN0NvpivMc0dHbiuzNS
  //둘이 같은지 확인
  //이미 암호화된 번호를 복호화하는 것은 불가능함.
  //따라서 plainpassword를 암호화하여 비교.
  bcrypt.compare(plainPassword, this.password, function(err, isMatch){
    //일치하지 않는 경우(에러)
    if(err) return cb(err);
    //에러 없고 비밀 번호 같은 경우 isMatch(true) 반환
    cb(null, isMatch)
  })
}


//index.js에서 사용하기 위한 함수 만들기
userSchema.methods.generateToken = function(cb){
  var user = this;
  //jsonwebtoken을 이용해서 token을 생성하기
  var token = jwt.sign(user._id.toHexString(), 'secretToken')
  //user._id + 'secretToken' = token
  user.token = token
  //토큰 생성 후 user에 넣어줌.
  user.save(function(err, user){
    if(err) return cb(err);
    cb(null, user);
  })
}

userSchema.statics.findByToken = function(token, cb){
  var user = this;
  //user._id + 'secretToken' = token
  //토큰을 decode 한다.
  //decode 시키면 userid가 나올 것.
  jwt.verify(token, 'secretToken', function(err, decoded){
    //유저 아이디를 이용해서 유저를 찾은 다음에
    //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({"_id": decoded, "token": token}, function(err, user){
      if(err) return cb(err);
      cb(null, user);
    })
  })
}



const User = mongoose.model('User', userSchema)
// 이 모델을 다른 파일에서 쓸 수 있도록 export를 해줌.
module.exports = {User}
