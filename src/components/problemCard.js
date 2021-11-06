import React, { useEffect, useState } from "react"
import {Card, CardColumns} from "react-bootstrap"
import swal from 'sweetalert';
import Carousel from "./carousel";
import ConfirmModal from './confirmModal'
import {useSelector} from "react-redux";
import URL from "../URL";

const ProblemCard = (props) => {
  const[upVotes,setUpVotes] = useState()
  const[downVotes,setDownVotes] = useState()
  const[image,setImage]=useState([])
  const[status,setStatus] = useState(props.status)
  const[showModal,setShowModal] = useState(false)
  const [upStatus,setUpStatus]= useState(false)
  const [downStatus,setDownStatus]= useState(false)

  const profileName = useSelector((state) => state.profile.value.name)

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);


  const noOfUpAndDownVotesUpdate = () =>{
    fetch(`${URL}/noOfUpAndDownVotes/${props.problemId}`)
    .then(async response => {
        if(response.ok){
            
            response.json().then(data => {
              setUpVotes(data[0])
              setDownVotes(data[1])
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

  const statusOfUpAndDownVotes = () =>{
    fetch(`${URL}/statusOfUpAndDownVotes/${props.problemId}`,{
      method:"GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache': 'no-cache'
      },
      credentials: 'include'
    })
    .then(async response => {
        if(response.ok){
            
            response.json().then(data => {
           
              setUpStatus(data[0])
              setDownStatus(data[1])
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

  const getStatus = () =>{
    fetch(`${URL}/getStatus/${props.problemId}`,{
      method:"GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        
      },
      credentials: 'include'
    })
    .then(async response => {
        
      
            response.json().then(data => {
             
              setStatus(data.status)
            });
         
        
      })
      .catch(async (error) => {
        const errorMessage = await error;
       
      })
  }


useEffect(() => {
 
  noOfUpAndDownVotesUpdate()
  statusOfUpAndDownVotes()
  getStatus()
  

  let imagesInitial = props.images
  //imagesInitial.map(image => {new Buffer(image).toString("base64")})

  

  let imagesFinal = []

  if(props.images !== undefined){

    for(let i = 0; i < props.images.length; i++){
      imagesFinal[i] = new Buffer(imagesInitial[i]).toString("base64")
    }
  
    setImage(imagesFinal)
  }
  
  
},[props.refreshCard])

const upvoteProblem = () => {



  if(upStatus === false){

    
    const Options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body:JSON.stringify({
          'problemTitle':props.title,
          'action':"Upvote",
          'creatorId':props.creatorId,
          'notifierName': profileName
      }),  
      credentials: "include"
      };
      fetch(`${URL}/notifyUser`, Options )
              .then(async response => {
                  if(response.ok){
                    
                    
                      response.json().then(data => {
                
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

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body:JSON.stringify({
        'problemId':props.problemId,
    }),  
    credentials: "include"
    };
    fetch(`${URL}/upvotesUpdate`, requestOptions )
            .then(async response => {
                if(response.ok){
                  statusOfUpAndDownVotes()
                  noOfUpAndDownVotesUpdate()
                    response.json().then(data => {
              
                    });
                    
                 }
                else{
                  swal({
                    title: "Unauthorized !",
                    text: "Please Login To Continue",
                    icon: "error",
                  });
                    throw response.json();
                }
              })
              .catch(async (error) => {
                const errorMessage = await error;
            
              })

}

const downvoteProblem = () => {


  
  if(downStatus === false){

    
    const Options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body:JSON.stringify({
          'problemTitle':props.title,
          'action':"Downvote",
          'creatorId':props.creatorId,
          'notifierName': profileName
      }),  
      credentials: "include"
      };
      fetch(`${URL}/notifyUser`, Options )
              .then(async response => {
                  if(response.ok){
                    
                    
                      response.json().then(data => {
                
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

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body:JSON.stringify({
        'problemId':props.problemId,
    }),  
    credentials: "include"
    };
    fetch(`${URL}/downvotesUpdate`, requestOptions )
            .then(async response => {
                if(response.ok){
                  statusOfUpAndDownVotes()
                  noOfUpAndDownVotesUpdate()
                    response.json().then(data => {

                      
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



  const updateStatus = () => {

    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body:JSON.stringify({
          'problemId':props.problemId,
      }),  
      credentials: "include"
      };
      
      fetch(`${URL}/updateStatus`, requestOptions )
            .then(async response => {
              
                if(response.ok){
                  
               
                  setStatus("Solved")
                    response.json().then(data => {

                      
                      
                    });
                    swal({
                      title: "Success!",
                      text: "Updated Successfully",
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
              handleClose()
  }

  const statusButton = (props.showStatusButton == true && status == "pending") ? <a style={{cursor:"pointer"}} onClick={handleShow}><span className="fa fa-check mr-3"></span>Mark as Solved</a> : null



    return <div>

      <ConfirmModal showModal={showModal} closeModal={()=>handleClose()} proceedingFxn={()=>updateStatus()}></ConfirmModal>
    
      <Card className="card-spacing" style={{ borderRadius: "15px",boxShadow:"rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}}  data-aos="fade-up" data-aos-delay="300">   
      <div className="container">
      <div className="col-md-6">
        <h1 className="position-card" style={{textAlign:"center"}}>{props.title}</h1>
      </div>
      <div className="col-md-6">
          <Carousel carouselId={props.problemId} images={image}/>
        
      </div>
    </div>
      <Card.Body>
     
        <Card.Text>
          <hr/>
          <span style={{fontWeight:"lighter",color:"gray"}}>
          Description
          </span>
          <h4>
          {props.description}
          </h4>
        </Card.Text>
        <Card.Text>
        <span style={{fontWeight:"lighter",color:"gray"}}>
          Category
          </span>
          <h4>
          {props.category}
          </h4>
        </Card.Text>
        <Card.Text>
        <span style={{fontWeight:"lighter",color:"gray"}}>
          Priority
          </span>
          <h4>
          {props.priority}
          </h4>
        </Card.Text>
        <Card.Text>
        <span style={{fontWeight:"lighter",color:"gray"}}>
          Status
          </span>
          <h4>
          {status}
          </h4>
        </Card.Text>
        <Card.Text>
        <span style={{fontWeight:"lighter",color:"gray"}}>
          Location
          </span>
          <h4>
          {props.location}
          </h4>
        </Card.Text>
        <a style={{fontWeight:"lighter",color:"gray"}}>
          Upvote And Downvote
          </a>
         {upStatus?<a style={{margin:"20px", cursor:"pointer",color:"blue"}} onClick={upvoteProblem}><span className="fa fa-thumbs-up mr-3"></span> {upVotes}</a>:<a style={{margin:"20px", cursor:"pointer"}} onClick={upvoteProblem}><span className="fa fa-thumbs-up mr-3"></span> {upVotes}</a>}
        {downStatus?<a style={{cursor:"pointer", marginRight : "10px",color:"red"}} onClick={downvoteProblem}><span className="fa fa-thumbs-down mr-3"></span> {downVotes}</a>:<a style={{cursor:"pointer", marginRight : "10px"}}onClick={downvoteProblem}><span className="fa fa-thumbs-down mr-3"></span> {downVotes}</a>}
        {statusButton}
      </Card.Body>
    </Card>
    </div>
}

export default ProblemCard