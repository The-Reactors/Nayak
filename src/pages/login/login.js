import React, { useState } from 'react'
import swal from "sweetalert"
import "../../assets/css/bootstrap.min.css"
import "../../assets/css/login.css"
import google from "../../assets/images/Google.png"
import logoShort from "../../assets/images/shortWhite.png"
import logoLong from "../../assets/images/longWhite.png"
import illus from "../../assets/images/login.png"
import { Redirect } from 'react-router'
import URL from '../../URL'
const Login = () => {
    const [userEnteredData, setuserEnteredData] = useState({
        email: "",
        password: ""
    })
    const[redirect,setRedirect] = useState(null)
    const handleInput = (event) =>
    {
        const name = event.target.name;
        const value = event.target.value;

        setuserEnteredData({...userEnteredData, [name]:value })

    }

    const submitHandler = (event) =>
    {
        event.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({
                'email':userEnteredData.email,
                'password':userEnteredData.password
            }),  
            credentials: "include"
            };
            fetch(`${URL}/localusers/login`, requestOptions )
            .then(async response => {
                if(response.ok){
                  
                    response.json().then(data => {
                   
                      });
                    swal({
                      title: "Success!",
                      text: "Logged in Successfully",
                      icon: "success",
                    });
                    setRedirect(<Redirect to="/"/>)
                 }
                else{
                  swal({
                    title: "Failed!",
                    text: "Login Credentials Could Not Be Verified, Please Try Again !",
                    icon: "error",
                  });
                    throw response.json();
                }
              })
              .catch(async (error) => {
                const errorMessage = await error;
           
              })
    }

    return (
        <div className="background">
          {redirect}
           <div id="content" className="p-4 p-md-5 pt-5 align-login" >
         
           <div class="login-wrapper shadow" >
    <div class="login-container">
      <div class="col-left">
        <div class="login-text">
          <span><img style={{maxWidth:"200px",maxHeight:"200px"}}src={logoLong}/></span>
          <p>
           Take a step forward and be an active citizen. 
           Report anything by simply raising tickets and get your voice heard.<br/> <br/> <br/> <br/>  Sign In To Your  <span> <img style={{maxWidth:"20px",maxHeight:"20px",margin:"2px"}} src={logoShort}/></span>   Account To Start Raising Tickets.
          </p>
          <img style={{maxWidth:"200px",maxHeight:"200px",marginTop:"10px"}}src={illus}/>
        </div>
    
   
        
      </div>
      <div class="col-right">
        <div class="login-form">
          <h2 style = {{textAlign: "center",lineHeight:"4rem"}}>Login To Your Account</h2>
          <form>
            <p>
              <label htmlFor="phone">Email Address</label>
              <input 
              type = "email"
              
              name = "email"
              value = {userEnteredData.email}
              onChange = {handleInput}
              required /> 
            </p>
            <p>
              <label htmlFor="password">Password</label>
              <input 
              type="password"
              autoComplete = "off"
              value = {userEnteredData.password}
              onChange = {handleInput}
              name = "password"
              required />
            </p>
            <p>
              <a onClick={submitHandler}>
              <input class="btn1" type="submit" value="Sign In" />
              </a>
            </p>
            <p>
              <a href="">Forget password?</a>
              <a href="/register">Create an account.</a>
            </p>
          </form>
          <div style={{textAlign:"center",lineHeight:"3rem",fontSize:"15px",fontWeight:"bold"}}><hr/> OR </div>
          <div style = {{textAlign:"center"}}>
           <a href={`${URL}/login/google`}>
           <button type = "submit" class = "btn1 btn1-googleSignIn">
             <span> Sign In With <img style= {{maxHeight:"20px",maxHeight:"20px"}}src={google}/></span>
            </button>
           </a>
          </div>
        </div>
      </div>
    </div>
    
  </div>
           </div>
          
        </div>
    )
}

export default Login
