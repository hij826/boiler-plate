//component 만들기
import React, {useEffect}  from 'react';
import Axios from 'axios';
//redux hook을 사용한 dispatch
import {useDispatch} from 'react-redux';
import {auth} from '../_actions/user_actions';

export default function(SpecificComponent, option, adminRoute = null){
  //!!option!!
  //null => 아무나 출입 가능
  //true => 로그인한 유저만 출입이 가능한 페이지
  //false => 로그인한 유저는 출입 불가능한 페이지
  function AuthenticationCheck(props){
    const dispatch = useDispatch();
    useEffect(()=>{
      dispatch(auth()).then(response=>{
        console.log(response)
        //막아주는 처리
        //로그인 하지 않은 상태
        if(!response.payload.isAuth){
          //로그인한 유저만 출입이 가능하면
          if(option){
            props.history.push('/login')
          }
        }else{
          //로그인한 상태
          //admin만 들어갈 수 있는 페이지 들어가려고 할 때 못 들어가게 해줘야함.
          if(adminRoute && !response.payload.isAdmin){
            props.history.push('/')
          }else{
            //로그인한 유저가 loginpage, registerpage 들어가려고 할 때
            //landingpage로 보냄.
            if(option === false)
              props.history.push('/')
          }
        }
      })
    }, [])

  return (
    <SpecificComponent{...props} />
  )
}
return AuthenticationCheck
}
