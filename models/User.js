const mongoose = require('mongoose');

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
const User = mongoose.model('User', userSchema)
// 이 모델을 다른 파일에서 쓸 수 있도록 export를 해줌.
module.exports = {User}
