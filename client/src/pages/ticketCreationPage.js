import React, { useEffect, useRef, useState } from 'react'
import URL from '../URL';
import {Modal} from "react-bootstrap"
import swal from 'sweetalert';
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input"
import FormHelperText from "@material-ui/core/FormHelperText"
import { Redirect } from 'react-router'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import ProfileNav from '../components/profileNav';
import { MenuItem, MenuList } from '@material-ui/core';
mapboxgl.accessToken = 'pk.eyJ1IjoiYXN1ciIsImEiOiJja3Q2ZXhkYW4waHJwMm5xbHVrZnE2YjZ2In0.pQ-92peoEdKmKFJAi6DoSg';

const useStyles = makeStyles({
  root: {
    display:"inline-block",
    minWidth: 1100,
    paddingLeft:"40px"
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  heading: {
    fontWeight: "bolder"
  },
  formEntry: {
    marginRight: "2rem"
  },
  helper: {
    fontSize: 10,
    color: "grey"
  }
});

const TicketCreationPage = () => {
    const [userEnteredData, setuserEnteredData] = useState({
        title : "",
        description : "",
        priority: "emergency",
        status : "pending",
        category : "land issue",
        location:"",
        kind : "issue",
    })
    const [imageState, setimageState] = useState()
    const [latitude, setLatitude] = useState(30.3420432)
    const [longitude, setLongitude] = useState(76.2895914)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const[redirect,setRedirect] = useState(null)
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
  
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
    let map = useRef(null);
    let mapContainer = useRef(null);

    const handleInput = (event) =>
    {
        const name = event.target.name;
        const value = event.target.value;

        setuserEnteredData({...userEnteredData, [name]:value })

    }
    const selectCategoryHandler = (e) => {
      setuserEnteredData((prev) => {
        return {
          ...prev,
          category : e.target.value,
        };
      });
    };
    const selectPriorityHandler = (e) => {
      setuserEnteredData((prev) => {
        return {
          ...prev,
          priority : e.target.value,
        };
      });
    };

    const getName = (name) => {
      const Names=name
    }
    const getLocation =  () =>{
      fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${userEnteredData.location}&apiKey=Bt-4s3hG9VlkF87RkELvh2Z1FVO3ih1i8GQ-keKlie8`, {credentials: "include"})
      .then((response) => {
        response.json().then((locationData) =>{
          if(locationData.items[0]===undefined)
          {
            swal({
              title: "Error!",
              text: "Invalid Location Entered, Please Enter The Location Again",
              icon: "error",
            });
          }
          else{


            setLongitude(locationData.items[0].position.lng)
            setLatitude(locationData.items[0].position.lat)
  
            setIsModalOpen(true)
            map.current = new mapboxgl.Map({
              container: mapContainer.current,
              style: 'mapbox://styles/mapbox/streets-v11',
              center: [locationData.items[0].position.lng,locationData.items[0].position.lat],
              zoom: 15
              });
  
              if(userEnteredData.title === ""||
              userEnteredData.description === ""||
              userEnteredData.location === "" ){
  
                swal({
                  title: "Error!",
                  text: "Please fill the required fields",
                  icon: "error",
                });
                setIsModalOpen(false)
                return new Error()
              }
          }
        })
      })
      
    }
      
    const fileHandler = (event) =>
    {
 
      const file = event.target.files;
      setimageState(file)
    }

    const fileSubmitHandler = (e) =>
    {
      e.preventDefault();

      getLocation()
      
    }
    const ticketConfirmHandler = (e) =>
    {


      let data = new FormData()

        data.append('title',userEnteredData.title)
        data.append('description',userEnteredData.description)
        data.append('priority',userEnteredData.priority)
        data.append('status',userEnteredData.status)
        data.append('location',userEnteredData.location)
        data.append('latitude',latitude)
        data.append('longitude',longitude)
        data.append('category',userEnteredData.category)
        data.append('kind',userEnteredData.kind)
        if(imageState !== undefined)
        {
            for(var x = 0; x<imageState.length; x++) {
              data.append('problemImage', imageState[x])
            }
        }

        



      const requestOptions = {
        method: 'POST',
        body:data,  
        credentials: "include"
        };
        fetch(`${URL}/problems`, requestOptions )
        .then(async response => {

         
            if(response.ok){
         
                swal({
                  title: "Success!",
                  text: "Ticket Raised Successfully",
                  icon: "success",
                })
                setIsModalOpen(false)
                setRedirect(<Redirect to="/"/>)
                
             }
             else if(response.status === 401){
              swal({
                title: "Unauthorised!",
                text: "Please Login",
                icon: "error",
              });
              setIsModalOpen(false)
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
                setIsModalOpen(false)
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
                  setIsModalOpen(false)
                }
              }
            }
           
          }) 




      
    }
    // const url="https://maps.google.com/maps?q=30.15787,84.20479&hl=es;z=14&amp;output=embed"
    return (
        
           <div id="content" className="p-4 p-md-5 pt-5">
             {redirect}
             <ProfileNav activePage="createTicket" getName={(name)=>getName(name)}/>
          <Modal  data-aos="fade-up" data-aos-delay="300" show = {isModalOpen}
          animation={false}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered>

<Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
        <h2>Confirm Ticket</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div data-aos="fade-up" data-aos-delay="300"  style={{textAlign:"center"}}>
          <br/>
          <div className= "col-md-6" style={{overflow:"hidden"}}>
              <div ref={mapContainer} style={{overflow:"hidden",borderRadius:"10%",height:"345px",width:"345px"}}  />
            </div>
            <div className= "col-md-6" >
            <p style= {{textAlign:"left", marginLeft:"30px",fontSize:"20px"}}>
            <b>Title</b> : {userEnteredData.title} <br/>
            <b>Decription</b> : {userEnteredData.description}<br/>
            <b>Location</b> : {userEnteredData.location}<br/>
            <b>Status</b> : {userEnteredData.status}<br/>
            <b>Priority</b> : {userEnteredData.priority}<br/>
            <b>Category</b> : {userEnteredData.category}<br/>
            </p>
            </div>
        <br/>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick = {ticketConfirmHandler}>Accept</Button>
        <Button onClick = {() =>{setIsModalOpen(false)}}>Reject</Button>
      </Modal.Footer>
            
          
            {/* <button onClick = {ticketConfirmHandler}>Confirm</button>
            <button onClick = {() =>{setIsModalOpen(false)}}>Reject</button> */}
            </Modal>
            

            {/* raise a ticket card */}

       
            <Card data-aos="fade-up" data-aos-delay="300" className={classes.root}>
      <CardContent>
        <Typography className = {classes.heading} color="textDark" gutterBottom variant="h4">
        <u> Raise a Ticket</u>
        </Typography>
        <br />
        <hr/>
        <Typography htmlFor="personal information" component="h2" >
          Personal Information <br/> <span style={{color:"red"}}>*= Required</span><br/>
        </Typography>
        <Typography align = "center">
        <FormControl>
        <InputLabel  htmlFor="name">Name</InputLabel>
        <Input className = {classes.formEntry} id="component-simple"/>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="phone number">Phone Number</InputLabel>
        <Input
          id="component-helper"
          aria-describedby="component-helper-text"
          type = "number"

        />
        <FormHelperText id="component-helper-text">Enter the number of the Point of Contact</FormHelperText>
      </FormControl>
      </Typography>
      <br/>
      <hr/>
        <Typography htmlFor="proximity" component="h2" >
          Ticket Information
          <br/> <span style={{color:"red"}}>* = Required</span><br/>
        </Typography>
        <Typography align = "center">
        <FormControl>
        <InputLabel  htmlFor="component-simple"> <span style={{color:"red"}}>*</span> Title</InputLabel>
        <Input 
        className = {classes.formEntry} 
        id="component-simple"  
        type = "text"
        name = "title"
        value = {userEnteredData.title}
        onChange = {handleInput}/>
        <br/>
        </FormControl>
        <FormControl>
        <InputLabel  htmlFor="component-simple"> <span style={{color:"red"}}>*</span> Description</InputLabel>
        <Input 
        className = {classes.formEntry} 
        id="component-simple"
        type="text" 
        autoComplete = "off"
        value = {userEnteredData.description}
        onChange = {handleInput}
        name = "description"/>
      </FormControl>
      </Typography>
      <br/>
      <Typography align = "center">
      <FormControl>
        <InputLabel  htmlFor="component-simple"> <span style={{color:"red"}}>*</span> Location</InputLabel>
        <Input 
        className = {classes.formEntry} 
        id="component-simple"
        type="text" 
        autoComplete = "off"
        onChange = {handleInput}
        value = {userEnteredData.location}
        name = "location"/>
      </FormControl>
      </Typography>
      <br/>
        <Typography align = "center">
        {/* <Typography htmlFor="category" component="h2" align="center">
          Select the Category
        </Typography> */}
        <br />
        <FormControl variant="filled" className={classes.formControl} style={{minWidth: 150,display:"flex",justifyContent:"center"}}>
          <InputLabel htmlFor="category"><span style={{color:"red"}}>*</span> Select Category</InputLabel>
          <Select
            
            onChange={(e) => selectCategoryHandler(e)}
            align="center"
          >
          <MenuItem value="none" name="category">None</MenuItem>
          <MenuItem value="land issue" name="category">Land Issue</MenuItem>
          <MenuItem value="water issue" name="category">Water Issue</MenuItem>
          <MenuItem value="public health" name="category">Public Health</MenuItem>
          <MenuItem value="sanitation"  name="category"> Sanitation</MenuItem>
          <MenuItem value="pollution" name="category">Pollution</MenuItem>
          <MenuItem value="healthcare issue" name="category">Healthcare Issue</MenuItem>
          <MenuItem value="electricity" name="category">Electricity</MenuItem>
          <MenuItem value="road blockage" name="category">Road Blockage</MenuItem>
          <MenuItem value="waste management" name="category">Waste Management</MenuItem>
          </Select>
          
        </FormControl>
        </Typography>
        <br />
        <Typography align = "center">
        {/* <Typography htmlFor="priority" component="h2" align="center">
          Select Priority
        </Typography> */}
    
        <FormControl variant="filled" className={classes.formControl} style={{minWidth: 150,display:"flex",justifyContent:"center"}}>
          <InputLabel htmlFor="priority"> <span style={{color:"red"}}>*</span> Select Priority</InputLabel>
          <Select
             
            onChange={(e) => selectPriorityHandler(e)}
            align="center"
          >
            <MenuItem value="none" name="category">None</MenuItem>
            <MenuItem value="emergency" name="category">Emergency</MenuItem>
            <MenuItem value="urgent" name="category">Urgent</MenuItem>
            <MenuItem value="not urgent" name="category">Not Urgent</MenuItem>
          </Select>
          <br />
        </FormControl>
        </Typography>
        <br/>
        <Typography align = "center">
          <formControl>
            <form encType = "multipart/form-data">
            <input type="file" id="uploads" name="uploads" accept=".jpg, .jpeg, .png, .svg, .gif" onChange = {fileHandler} multiple />
            </form>
          <Typography className = {classes.helper}><br/>Upload Upto 3 Images</Typography>
          </formControl>
        </Typography>
        <hr/> 
      </CardContent>
      <CardActions>
        <Typography align = "center">
          <Button
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            onClick={fileSubmitHandler}
          >
            Raise the ticket
          </Button>
        </Typography>
      </CardActions>
    </Card>
    </div>
         
    )
}

export default TicketCreationPage