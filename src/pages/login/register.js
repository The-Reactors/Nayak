import React, {useState} from 'react'
import swal from "sweetalert"
import "../../assets/css/login.css"
import google from "../../assets/images/Google.png"
import nayakShort from "../../assets/images/shortWhite.png"
import nayakLong from "../../assets/images/longWhite.png"
import register from "../../assets/images/register.png"
import { Redirect } from 'react-router'
import URL from '../../URL'

const Register = () => {

  const[redirect,setRedirect] = useState(null)
  const [userEnteredData, setuserEnteredData] = useState({
        username: "",
        email: "",
        phone: "",
        password: ""
    })

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
                'password':userEnteredData.password,
                'name':userEnteredData.username,
                'phoneNo':userEnteredData.phone
            }),  
            credentials: "include"
            };
            fetch(`${URL}/users`, requestOptions )
            .then(async response => {
                response.json().then(data =>  {
                  
                    if(response.ok){
                      
                        swal({
                          title: "Success!",
                          text: "User Created Successfully",
                          icon: "success",
                        });
                        setRedirect(<Redirect to="/login"/>)

                     }
                    else{
                      swal({
                        title: "Failed!",
                        text: data._message === undefined ? "Already registered With Email Address":data._message,
                        icon: "error",
                      });
                        //throw response.json();
                    }
                  });
                
              })
              .catch(async (error) => {
                const errorMessage = await error;
                console.log(errorMessage)
                
              })
    }

    return (
        <div className="background">
          {redirect}
    <div id="content" className="p-4 p-md-5 pt-5 align-login">
    <div class="login-wrapper">
<div class="login-container">
<div class="col-left">
 <div class="login-text">
 <span><img style={{maxWidth:"200px",maxHeight:"200px"}}src={nayakLong}/></span>
          <p>
           Take a step forward and be an active citizen. 
           Report anything by simply raising tickets and get your voice heard.<br/> <br/> <br/> <br/>  Create A <span> <img style={{maxWidth:"20px",maxHeight:"20px",margin:"2px"}} src={nayakShort}/></span>   Account To Start Raising Tickets And Make A Difference In The Society.
          </p>
          <img style={{maxWidth:"200px",maxHeight:"200px",marginTop:"10px"}}src={register}/>
 </div>
</div>
<div class="col-right">
 <div class="login-form">
   <h2 style = {{textAlign: "center"}}>Create An Account</h2>
   <form>
     <p>
       <label htmlFor="username">Full name</label>
       <input 
       type="text" 
       autoComplete = "off"
       value = {userEnteredData.username}
       onChange = {handleInput}
       name = "username"
       required/>
     </p>
     <p>
       <label htmlFor="email">E-mail</label>
       <input 
       type="email" 
       autoComplete = "off"
       value = {userEnteredData.email}
       onChange = {handleInput}
       name = "email"
       required />
     </p>
     <p>
      <label htmlFor="phone">Phone Number</label>
      <input 
      maxLength="10"
      type="number" 
      autoComplete = "off"
      value = {userEnteredData.phone}
      onChange = {handleInput}
      name = "phone"
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
       <input class="btn1" type="submit" value="Sign Up" />
       </a>
     </p>
     <p>
       <a href="/login">Sign In Instead</a>
       <a href="/">Back To Home</a>
     </p>
   </form>
   <div style={{textAlign:"center",lineHeight:"3rem",fontSize:"15px",fontWeight:"bold"}}><hr/> OR</div>
   <div style = {{textAlign:"center"}}>
    <a href = {`${URL}/login/google`}>
      <button className = "btn1 btn1-googleSignIn" >
      <span>Sign Up With  <img  style= {{maxHeight:"20px",maxHeight:"20px"}}src={google}/></span>
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

export default Register
