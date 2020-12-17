import React, {useEffect} from 'react'
import axios from 'axios';
import { withRouter } from 'react-router-dom';
//landingpage에 들어오자마자 get request를 서버에 보냄.
function LandingPage(props) {
  useEffect(() =>{
    //서버로 보내고 다시 오는 response를 console로 보여줌.
    axios.get('/api/hello')
    .then(response => {console.log(response)})
  }, [])

  const onClickhandler = () =>{
    axios.get('/api/users/logout')
    .then(response=>{
      console.log(response.data)
      if(response.data.success){
        props.history.push('/login')
      }else{
        alert('로그아웃 실패')
      }
    })
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems:'Center'
      , width: '100%', height: '100vh'
    }}>
    <h2>시작 페이지</h2>
    <button onClick={onClickhandler}>
      로그아웃
    </button>
    </div>
  )
}

export default withRouter(LandingPage)
