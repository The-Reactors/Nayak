import React, { useState } from 'react'
import swal from 'sweetalert';
import { useEffect } from 'react';
import URL from '../URL';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { Card, CardContent, Typography,CardMedia, Input } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import silhouette from "../assets/images/profile.png"

const MyAccount = () =>{
    


  let AOS;
  useEffect(() => {
      const AOS = require("aos");
      AOS.init({
        once: true,
      });
    }, []);
  
    useEffect(() => {
      if (AOS) {
        AOS.refresh();
      }
    });

    const [imageState, setimageState] = useState()
    const [updatedName, setUpdatedName] = useState()
    const [updatedPhoneNo, setUpdatedPhoneNo] = useState()
    const [disabledName,setDisabledName] = useState(true)
    const [disabledNumber, setDisabledNumber] = useState(true)
    const [disabledImage,setdisabledImage] = useState(false)
    const [profileImage, setProfileImage] = useState()
    const [newImage, setNewImage] = useState(false)
    const[googleProfile,setGoogleProfile] = useState(false)


    const getProfile = () => {
      fetch(`${URL}/users/me`,  {credentials: "include"})
      .then(async response => {
          if(response.ok){
              response.json().then(profile => {
                if(profile.password === undefined)
                {
                  setGoogleProfile(true)
              }
                if(profile.profilePic !== undefined){
                  const profilePic = new Buffer(profile.profilePic.data).toString("base64")
                setProfileImage(profilePic)
                }
                
              });
           }
          else{
              throw response.json();
          }
        })
        .catch(async (error) => {
          const errorMessage = await error;
          
        })
  }
  useEffect(() =>{
    getProfile()
    
}, [newImage])

    const handleEditName = () => {
        setDisabledName(false)
       
    }
    const handleEditNumber  = ( ) => {
        setDisabledNumber(false)
        
    }
    const handleEditImage = () => {
      setdisabledImage(true)
    }

    const handleInputName = (event) =>
    {
       
        const value = event.target.value;

        setUpdatedName(value)

    }
    const handleInputPhoneNo = (event) =>
    {
       
        const value = event.target.value;

        setUpdatedPhoneNo(value)

    }

    const fileUpdateNameHandler = (event) =>{
        event.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({
                'name':updatedName
            }),  
            credentials: "include"
            };

            fetch(`${URL}/updateUserName`, requestOptions )
            .then(async response => {
                if(response.ok){
                  
                    response.json().then(data => {
                      
                      });
                    swal({
                      title: "Success!",
                      text: "Username updated Successfully",
                      icon: "success",
                    });
                 }
                else{
                  swal({
                    title: "Failed!",
                    text: "Login Credentials Could Not Be Verified",
                    icon: "error",
                  });
                    throw response.json();
                }
              })
              .catch(async (error) => {
                const errorMessage = await error;
               
              })
    }
    const fileUpdatePhoneNoHandler = (event) =>{
        event.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({
                'phoneNo':updatedPhoneNo
            }),  
            credentials: "include"
            };

            fetch(`${URL}/updateUserPhoneNo`, requestOptions )
            .then(async response => {
                if(response.ok){
                   
                    response.json().then(data => {
                       
                      });
                    swal({
                      title: "Success!",
                      text: "Phone Number Updated Successfully",
                      icon: "success",
                    });
                 }
                else{
                  swal({
                    title: "Failed!",
                    text: "Login Credentials Could Not Be Verified",
                    icon: "error",
                  });
                    throw response.json();
                }
              })
              .catch(async (error) => {
                const errorMessage = await error;
           
              })
    }

    const fileHandler = (event) =>
    {
  
      const file = event.target.files;
      setimageState(file)

    }


    const fileSubmitHandler = (event) =>{

        event.preventDefault()
        let data = new FormData()

        if(imageState !== undefined)
        {
            
            data.append('profilePic', imageState[0])
           
        }

    const requestOptions = {
        method: 'POST',
        body:data,  
        credentials: "include"
        };
        fetch(`${URL}/updateProfilePic`, requestOptions )
        .then(async response => {

          (newImage === false) ? setNewImage(true) : setNewImage(false)
            if(response.ok){
              
                
                swal({
                  title: "Success!",
                  text: "Profile Pic Updated Successfully",
                  icon: "success",
                })

                
               
                  
                
             }
             else if(response.status === 401){
              swal({
                title: "Unauthorised!",
                text: "Please Login",
                icon: "error",
              });
              
             }
            else{
                throw response.json();
            }
          })
          .catch(async (error) => {
            const errorMessage = await error;
          
            if( errorMessage.error !== undefined)
            {
              if(!(typeof errorMessage.error.code === 'string') && !(errorMessage.error.code instanceof String))  
              {
                swal({
                  title: "Error!",
                  text: "Unknown Error Has Occured !",
                  icon: "error",
                });
                
              }
              else
              {
                if((errorMessage.error.code.localeCompare("LIMIT_FILE_SIZE") === 0) ||(errorMessage.error.code.localeCompare("LIMIT_UNEXPECTED_FILE") === 0) )
                {
                  swal({
                    title: "Error!",
                    text: "Maximumm Number Of 3 Images Can Be Uploaded",
                    icon: "error",
                  });
                 
                }
              }
            }
           
          }) 

    }

    let updateImage;
    if(googleProfile)
    { 
      updateImage = null
    }
    else
    {
      if(profileImage == undefined)
      {
        updateImage=<img style={{borderRadius: "50%",maxHeight:"300px",maxWidth:"300px"}} src={silhouette} alt="profile_pic_NativeImage"/>
      }
      else
      {
        updateImage =  <img style={{borderRadius: "50%",maxHeight:"300px",maxWidth:"300px"}} src={`data:image/png;base64,${profileImage}`} alt="profile_pic_NativePresent"/>
      }
    }
    return <div>
     
      <div id="content" className="p-4 p-md-5 pt-5" style={{width:"210%"}}>
        <form data-aos="fade-up" data-aos-delay="300"  action="" encType = "multipart/form-data">
              
        {/* <label htmlFor="name">Name</label>
                <input 
                type="text" 
                autoComplete = "off"
                value = {updatedName}
                onChange = {handleInputName}
                name = "description"
                />
                <button onClick = {fileUpdateNameHandler}>Update</button>
        <label htmlFor="phoneNo">Phone Number</label>
                <input 
                type="text" 
                autoComplete = "off"
                value = {updatedPhoneNo}
                onChange = {handleInputPhoneNo}
                name = "description"
                />
                <button onClick = {fileUpdatePhoneNoHandler}>Update</button> */}
              {/* <p>
                <label htmlFor="uploads">
                Update Your Profile Picture
                </label>
                <input type="file" id="uploads" name="uploads" accept=".jpg, .jpeg, .png, .svg, .gif" onChange = {fileHandler} />
                <button onClick = {fileSubmitHandler}>Upload</button>
                </p> */}
                
           </form> 
         <Card style={{marginLeft:"10px"}}>
         <CardContent>
         <Typography style = {{fontWeight:"bolder"}} color="textDark" gutterBottom variant="h2">
        My Account
        </Typography>
         
    <Typography align="center">
        
               {updateImage}
               {googleProfile ? null : <Typography htmlFor="uploads">
               <h3 style={{marginTop:"20px"}}> Update Your Profile Picture by clicking on the edit icon </h3>
                </Typography>}
                {googleProfile?null:<IconButton onClick = {handleEditImage}>
                <EditIcon />
                </IconButton>}
                {disabledImage && <div><Typography align = "center"><input type="file" id="uploads" name="uploads" accept=".jpg, .jpeg, .png, .svg, .gif" multiple onChange = {fileHandler} />
                <Button variant = "contained" color = "primary" onClick = {fileSubmitHandler}>Upload</Button></Typography></div>}
                
        <br /> <br />
                <hr />
                <TextField
          disabled = {disabledName}
          id="outlined-disabled"
          label="Name"
          defaultValue={updatedName}
          autoComplete = "off"
          value = {updatedName}
          onChange = {handleInputName}
          name = "description"
          helperText = "Click on the edit icon to update your name"
        />
        <IconButton onClick = {handleEditName}>
          <EditIcon />
        </IconButton>
        <TextField
          disabled = {disabledNumber}
          id="outlined-number"
          label="Number"
          defaultValue={updatedPhoneNo}
          type="number"
          autoComplete = "off"
          value = {updatedPhoneNo} 
          onChange = {handleInputPhoneNo}
          name = "description"
          helperText = "Click on the edit icon to update your number"
        />
        <IconButton onClick = {handleEditNumber}>
          <EditIcon />
        </IconButton>
        <Typography>
        <Button hidden = {disabledName} variant = "contained" color = 'secondarary' onClick = {fileUpdateNameHandler} style = {{marginRight:'11rem'}}>Change Name</Button>
        <Button hidden = {disabledNumber} variant = "contained" color = 'secondarary' onClick = {fileUpdatePhoneNoHandler}>Change Number</Button>
        </Typography>
        </Typography>   
                </CardContent>
          </Card>

      </div>
           <div>
        </div>
           {/* <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" }
      }}
      noValidate
      autoComplete="off"
    > */}
        
    {/* </Box> */}
           </div>

}

export default MyAccount;