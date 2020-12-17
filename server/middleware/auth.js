const {User} = require("../models/User")
let auth = (req, res, next)=>{
  //인증 처리를 하는 곳.

  //클라이언트 쿠키에서 토큰을 가져옴.
  let = token = req.cookies.x_auth;
  //토큰을 복호화 한 후 유저를 찾는다.
  //이 메소드는 User.js에서 만듦.
  User.findByToken(token, (err, user)=>{
    if(err) throw err;
    //유저가 없으면 인증 에러.
    if(!user) return res.json({isAuth: false, error: true})
    //유저가 있으면 인증 okay.
    //token과 user를 index.js에서 쓰기 위해 req에 넣어주는 것.
    req.token = token;
    req.user = user;
    next();
  })
}

//다른 파일에서도 쓸 수 있게 export시킴.
module.exports = {auth};
