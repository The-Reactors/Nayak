import React, { useEffect, useRef, useState } from 'react'
import URL from '../URL';
import {Modal} from "react-bootstrap"
import swal from 'sweetalert';
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { Redirect } from 'react-router'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import ProfileNav from '../components/profileNav';
import { MenuItem, MenuList } from '@material-ui/core';
import "../assets/css/ticket-creation.css"
import "animate.css"
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
    marginBottom: 10
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
    const [redirect,setRedirect] = useState(null)
    const [isSecondPage, setIsSecondPage] = useState("")
    
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

    const nextButtonHandler = (e) =>{
      e.preventDefault();

      if(userEnteredData.title === "" || userEnteredData.description === ""){
        swal({
          title: "Warning!",
          text: "Please fill the details",
          icon: "warning",
          buttons: {cancel:"OK"}
        });
      }else{

        setIsSecondPage("secondPage")
      }
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
        <ProfileNav
          activePage="createTicket"
          getName={(name) => getName(name)}
        />
        <Modal
          data-aos="fade-up"
          data-aos-delay="300"
          show={isModalOpen}
          animation={false}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              <h2>Confirm Ticket</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              data-aos="fade-up"
              data-aos-delay="300"
              style={{ textAlign: "center" }}
            >
              <br />
              <div className="col-md-6" style={{ overflow: "hidden" }}>
                <div
                  ref={mapContainer}
                  style={{
                    overflow: "hidden",
                    borderRadius: "10%",
                    height: "345px",
                    width: "345px",
                  }}
                />
              </div>
              <div className="col-md-6">
                <p
                  style={{
                    textAlign: "left",
                    marginLeft: "30px",
                    fontSize: "20px",
                  }}
                >
                  <b>Title</b> : {userEnteredData.title} <br />
                  <b>Decription</b> : {userEnteredData.description}
                  <br />
                  <b>Location</b> : {userEnteredData.location}
                  <br />
                  <b>Status</b> : {userEnteredData.status}
                  <br />
                  <b>Priority</b> : {userEnteredData.priority}
                  <br />
                  <b>Category</b> : {userEnteredData.category}
                  <br />
                </p>
              </div>
              <br />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={ticketConfirmHandler}>Accept</Button>
            <Button
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              Reject
            </Button>
          </Modal.Footer>

          {/* <button onClick = {ticketConfirmHandler}>Confirm</button>
            <button onClick = {() =>{setIsModalOpen(false)}}>Reject</button> */}
        </Modal>

        {/* raise a ticket card */}

        <div className="container-fluid">
            <div className="row">
              <div className="col-md-7 ml-3">
                <h1 className="ticket-creation-heading">Raise a Ticket</h1>

                <div className="ticket-creation-progress mt-5 ml-1">

                  <div className={`ticket-creation-first ${isSecondPage}`}>

                  </div>
                  <div className="ticket-creation-dash">

                  </div>
                  <div className={`ticket-creation-second ${isSecondPage}`}>

                  </div>
                  

                </div>
                <h1 className="ticket-creation-subheading">Basic Ticket Info</h1>
                <p className="ticket-creation-subheading-para mt-3">Fill in the details for the ticket. This will take couple of minutes</p>

                <form>
                <div  className={`ticket-creation-basic-container ${isSecondPage} mt-5 animate__animated animate__slideInRight animate__fast`}>
                  <h2 className="ticket-creation-form-heading">Ticket Overview</h2>
                  <p className="ticket-creation-form-subheading mt-1">Please provide correct data about the ticket</p>

                  <label for="exampleFormControlInput1" class="form-label mt-4">Ticket Title</label>
                  <input type="text"
                    name="title"
                    value={userEnteredData.title}
                    onChange={handleInput} class="form-control" id="exampleFormControlInput1" placeholder="Enter Title" required></input>

                  <label for="exampleFormControlTextarea1" class="form-label mt-4">Ticket Description</label>
                  <textarea class="form-control ticket-creation-form-desc" 
                    name="description"
                    value={userEnteredData.description}
                    onChange={handleInput} id="exampleFormControlTextarea1" placeholder="Enter Description" required></textarea> 
                </div>

                <div className={`ticket-creation-second-container ${isSecondPage} mt-5 animate__animated animate__slideInRight animate__fast`}>
                  <h2 className="ticket-creation-form-heading">Ticket Details</h2>
                  <p className="ticket-creation-form-subheading mt-1">Please provide correct data about the ticket</p>

                  <label for="exampleFormControlInput1" class="form-label mt-4">Ticket Location</label>
                  <input type="text"
                    name="location"
                    value={userEnteredData.location}
                    onChange={handleInput} class="form-control" id="exampleFormControlInput1" placeholder="Eg). Bench broken in the nearby park" required></input>
                  
                  <label class="form-label mt-4">Additional Information</label>
                  <div className="row ">
                    <div className = "col-md-6">
                    <FormControl
                
                className={classes.formControl}
                style={{
                  minWidth: 150,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <InputLabel htmlFor="category">
                   Select Category
                </InputLabel>
                <Select
                  onChange={(e) => selectCategoryHandler(e)}
                  
                >
                  <MenuItem value="none" name="category">
                    None
                  </MenuItem>
                  <MenuItem value="land issue" name="category">
                    Land Issue
                  </MenuItem>
                  <MenuItem value="water issue" name="category">
                    Water Issue
                  </MenuItem>
                  <MenuItem value="public health" name="category">
                    Public Health
                  </MenuItem>
                  <MenuItem value="sanitation" name="category">
                    {" "}
                    Sanitation
                  </MenuItem>
                  <MenuItem value="pollution" name="category">
                    Pollution
                  </MenuItem>
                  <MenuItem value="healthcare issue" name="category">
                    Healthcare Issue
                  </MenuItem>
                  <MenuItem value="electricity" name="category">
                    Electricity
                  </MenuItem>
                  <MenuItem value="road blockage" name="category">
                    Road Blockage
                  </MenuItem>
                  <MenuItem value="waste management" name="category">
                    Waste Management
                  </MenuItem>
                </Select>
              </FormControl>
                    </div>
                    <div className = "col-md-6">
                    <FormControl
                
                className={classes.formControl}
                style={{
                  minWidth: 150,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <InputLabel htmlFor="priority">
                  {" "}
                  Select Priority
                </InputLabel>
                <Select
                  onChange={(e) => selectPriorityHandler(e)}
                  
                >
                  <MenuItem value="none" name="category">
                    None
                  </MenuItem>
                  <MenuItem value="emergency" name="category">
                    Emergency
                  </MenuItem>
                  <MenuItem value="urgent" name="category">
                    Urgent
                  </MenuItem>
                  <MenuItem value="not urgent" name="category">
                    Not Urgent
                  </MenuItem>
                </Select>
                <br />
              </FormControl>
                    </div>
                  </div>   

                  <label class="form-label mt-4">Upload Upto 3 Images</label>  
                  <formControl>
                <form encType="multipart/form-data">
                  <input
                    type="file"
                    id="uploads"
                    name="uploads"
                    accept=".jpg, .jpeg, .png, .svg, .gif"
                    onChange={fileHandler}
                    multiple
                  />
                </form>
                
              </formControl>
                </div>


                {isSecondPage === "" ? <Button
                
                color="primary"
                size="large"
                type="submit"
                variant="contained"
                onClick={nextButtonHandler}
                style={{backgroundColor:"#0075FF", marginTop:"20px"}}
              >
                Go Next <i class="fa fa-arrow-right ml-2"></i>
              </Button> : 
              <Button
              
                color="primary"
                size="large"
                type="submit"
                variant="contained"
                onClick={fileSubmitHandler}
                style={{backgroundColor:"#0075FF", marginTop:"20px"}}
              >
                Submit <i class="fa fa-check ml-2"></i>
              </Button>}
                
                </form>
              </div>
            </div>
        </div>

       
      </div>
    );
}

export default TicketCreationPage


