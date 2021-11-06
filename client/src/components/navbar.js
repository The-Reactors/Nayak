import nayakWhite from "../assets/images/longWhite.png"
import nayakShort from "../assets/images/shortWhite.png"
import {useSelector} from "react-redux";
const Navbar = (props) => {

    const profile = useSelector((state) => state.profile.value)

    const homeActiveClass = props.activeElement.localeCompare("home") === 0 ? "active":"";
    const registerActiveClass = props.activeElement.localeCompare("register") === 0 ? "active":"";
    const loginActiveClass = props.activeElement.localeCompare("login") === 0 ? "active":"";
    const raiseTicketActiveClass = props.activeElement.localeCompare("raiseTicket") === 0 ? "active":"";
    const myTicketActiveClass = props.activeElement.localeCompare("myTickets") === 0 ? "active":"";
    const myAccountActiveClass = props.activeElement.localeCompare("myAccount") === 0 ? "active":"";
    let navElements=null;

    if(JSON.stringify(profile) !== JSON.stringify({}))
    {
        navElements=(
            <div>
                        <li name = "home" className={homeActiveClass}>
                            <a href="/"><span className="fa fa-home mr-3"></span> Home</a>
                        </li>
                        <li name = "raiseATicket" className={raiseTicketActiveClass}>
                            <a href="/createTicket"><span className="fa fa-ticket mr-3"></span> Raise a Ticket</a>
                        </li>
                        <li name = "myTickets" className={myTicketActiveClass}>
                            <a href="/myTickets"><span className="fa fa-ticket mr-3"></span> My Tickets</a>
                        </li>
                        <li name = "myAccount" className={myAccountActiveClass}>
                            <a href="/myAccount"><span className="fa fa-user mr-3"></span> My Account</a>
                        </li>
            </div>
        )
    }
    else{
        navElements=(
            <div>
                  <li name = "home" className={homeActiveClass}>
                            <a href="/"><span className="fa fa-home mr-3"></span> Home</a>
                        </li>
                        <li name = "register" className={registerActiveClass}>
                            <a href="/register"><span className="fa fa-user-plus mr-3"></span> Register</a>
                        </li>
                        <li name = "login" className={loginActiveClass}>
                            <a href="/login"><span className="fa fa-sign-in mr-3"></span> Login</a>
                        </li>
            </div>
        )
    }
    return (
            <div  className="wrapper d-flex align-items-stretch"  >
            <nav id="sidebar" >
                <div>
                <div className="custom-menu" >
                    <button type="button" id="sidebarCollapse" className="btn btn-primary" style={{zIndex:"2",position:"fixed",transform:"translate(-92%)"}}>
                        <i className="fa fa-bars"></i>
                        <span className="sr-only" >Toggle Menu</span>
                    </button>
                
                </div>
                <div style={{position:"fixed"}}>
                <div className="p-4" style={{width:"270px"}}>
                    <h1><a href="/" className="logo"><span><img style={{maxHeight:"165px",maxWidth:"165px"}}src={nayakWhite}/></span> <span>Community Help Service</span></a></h1>
                    <ul className="list-unstyled components mb-5">
                        {navElements}
                    </ul>
                    </div>
                
                <div className="mb-5" style={{margin:"10px"}}>
                    <h3 className="h6 mb-3">Contact the NAYAK  Team</h3>
                    <form action="#" className="subscribe-form">
                        <div className="form-group d-flex">
                            <div className="icon"><span className="icon-paper-plane"></span></div>
                            <input type="text" className="form-control" placeholder="Enter Email Address"  style={{border:"1px solid #3445B4"}}/>
                        </div>
                    </form>
                </div>
                </div>
                
                <div className="footer" style={{margin:"10px",transform:"translateY(450px)",position:"fixed"}}>
                    <p  style={{color:"white"}}>Copyright ©2021 All rights reserved | <span><img style={{maxHeight:"20px",maxWidth:"20px",margin:"5px"}}src={nayakShort}/></span> Team </p>
                </div>
                </div>   
            </nav>
            {props.children} 
	    </div>
        
    )
}

export default Navbar
