import React, { useEffect,useState } from 'react'
import "../assets/css/profileNav.css"
import bell from "../assets/images/bell.png"
import ScriptTag from 'react-script-tag';
import silhouette from "../assets/images/profile.png"
import nayakShort from "../assets/images/shortLogo.png"
import {login, logout} from "../features/Profile"
import { useDispatch , useSelector} from "react-redux";
import URL from '../URL';

const ProfileNav = (props) => {
    const [notifications,setNotifications] = useState([])
    const [notifcationsClass, setNotificationClass] = useState("notifications")
    const profile = useSelector((state) => state.profile.value)
    const dispatch = useDispatch()
    const getProfile = () => {
        fetch(`${URL}/users/me`,  {credentials: "include"})
        .then(async response => {
            if(response.ok){
                response.json().then(data => {
                    console.log(data)
                        dispatch((login(data)))
                });
             }
            else{
                throw response.json();
            }
          })
          .catch(async (error) => {
           
            const errorMessage = await error;
            console.log(errorMessage)
          })
    }
    const notificationHandler = () => {
        {notifcationsClass.localeCompare("notifications") === 0 ? setNotificationClass("notifications active") : setNotificationClass("notifications")}
    }
    const getNotifications = () => {
        fetch(`${URL}/getNotifications`,  {credentials: "include"})
        .then(async response => {
            if(response.ok){
                response.json().then(data => {
                 
                   setNotifications(data)
                });
             }
            else{
                throw response.json();
            }
          })
          .catch(async (error) => {
           
            const errorMessage = await error;
            console.log(errorMessage)
          })
    }

          useEffect(() =>{
            getProfile()
            getNotifications()
        }, [])

        const markAsReadHandler = () => {

            const Options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
                };

            fetch(`${URL}/ticket/markAsRead`, Options)
            .then(async response => {
            if(response.ok){
                response.json().then(data => {
                      window.location.reload();
                });
             }
            else{
                throw response.json();
            }
          })
          .catch(async (error) => {
            const errorMessage = await error;
            console.log(errorMessage)
          })
        }
        let authPic;
        if(JSON.stringify(profile) === JSON.stringify({}))
        {
            authPic= (<img style={{borderRadius: "50%"}} src={silhouette} alt="profile_pic_loggedOut"/>)
            
        }
        else
        {
            if(profile.profilePicLink===undefined)
            {

                if(profile.profilePic === undefined){
                   
                    authPic=(<img style={{borderRadius: "50%"}} src={silhouette} alt="profile_pic_NativeImage"/>)
                }else{
                   
                    const profilePic = new Buffer(profile.profilePic.data).toString("base64")
                    authPic=(<img style={{borderRadius: "50%"}} src={`data:image/png;base64,${profilePic}`} alt="profile_pic_NativePresent"/>)

                }
            }
            else
            {
                authPic = (<img style={{borderRadius: "50%"}} src={profile.profilePicLink} alt="profile_pic_google"/> )
            }
        }
       
            
        
    return (
        <div>
             <ScriptTag type="text/javascript" src="/js/profileNav.js"/>
    <div className="wrapper">
    <div className="profileNav">
        <div className="profileNav_left">
             {props.activePage.localeCompare("home") === 0 ?<h1><span className="fa fa-map-marker"style={{marginRight:"5px",color:"#3445B4"}}></span>Trending Issues Near You</h1>:null } 
        </div>
        
        <div className="profileNav_right">
        <div className={notifcationsClass}>
           {JSON.stringify(profile) !== JSON.stringify({}) ? <div className="icon_wrap"><svg onClick ={notificationHandler} style={{width:"30px",height:"30px", marginBottom:"2.5vh"}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell" viewBox="0 0 16 16">
  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
</svg></div>:null} 
            <div className="notification_dd" style={{zIndex:"10"}}>
                <ul className="notification_ul">
                    {
                         notifications.map((notification, index) =>{
                           return <div key={index}>
                                      {notification.action.localeCompare("Upvote") === 0 ? 
                                      <li className="success">
                                          <div className="notify_icon">
                                                <span className="icon">
                                                    <img src={nayakShort}></img></span>  
                                            </div>
                                            <div className="notify_data">
                                                <div className="title">
                                                    <b>Title Of Ticket : </b>{notification.problemTitle} 
                                                </div>
                                                <div className="sub_title">
                                                {notification.notifierName} Upvoted Your Ticket With Title: <b>{notification.problemTitle}</b>
                                            </div>
                                            </div>
                                            <div className="notify_status">
                                            <span style={{color:"#6BDD8F"}} className="fa fa-thumbs-up fa-3x mr-3"></span>
                                            </div>
                                        </li>
                                        : <li className="failed">
                                            <div className="notify_icon">
                                                <span className="icon">
                                                <img src={nayakShort}></img></span>  
                                            </div>
                                            <div className="notify_data">
                                                <div className="title">
                                                <b>Title Of Ticket : </b> {notification.problemTitle}   
                                                </div>
                                                <div className="sub_title">
                                                {notification.notifierName} Downvoted Your Ticket With Title: <b>{notification.problemTitle}</b>
                                            </div>
                                            </div>
                                            <div className="notify_status">
                                            <span style={{color:"#FF1000"}} className="fa fa-thumbs-down fa-3x mr-3"></span>
                                            </div>
                                        </li>  
                                        } 
                                            
                                 </div>
                         })
                    }
                  <li className="show_all">
                        <p className="link" onClick={markAsReadHandler}><span style={{color:"#1E1E1E",cursor:"pointer"}} className="fa fa-check mr-3"></span>Mark As Read</p>
                    </li> 
                </ul>
            </div>
            
        </div>
        <div className="profile">
            <div className="icon_wrap">
            {JSON.stringify(profile) !== JSON.stringify({}) ? 
            authPic
            :<a href="/login"><img style={{borderRadius: "50%"}} src={silhouette} alt="profile_pic"/> </a>} 
            <span className="name">{JSON.stringify(profile) !== JSON.stringify({})  ? `Hello, ${profile.name} `: <a href="/login">Sign In</a>}</span>
            {JSON.stringify(profile) !== JSON.stringify({})  ? <i className="fa fa-chevron-down"></i> : <a href="/login"><i className="fa fa-chevron-down"></i></a>}
            </div>

           {JSON.stringify(profile) !== JSON.stringify({}) ?<div className="profile_dd" style={{zIndex:"1"}}>
            <ul className="profile_ul"> 
                <li className="profile_li"><a className="profile" href="#"><span className="picon"><i className="fa fa-user"></i>
                    </span>Profile</a>
                    <a href="/myAccount">
                <div className="btn">My Account</div>
                </a>
                </li>
                <li onClick={() => dispatch(logout())}><a className="logout" href={`${URL}/users/logout`}><span className="picon"><i className="fa fa-sign-out"></i></span>Logout</a></li>
            </ul>
            </div>:null} 
        </div>
        </div>
    </div>
    
    <div className="popup" style={{zIndex:"10"}}>
        <div className="shadow"></div>
       
    </div>
    
    </div>
        </div>
    )
}

export default ProfileNav
