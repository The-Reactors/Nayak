import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Homepage from './pages/homepage';
import TicketCreationPage from "./pages/ticketCreationPage";
import Login from "./pages/login/login";
import Register from "./pages/login/register";
import MyTickets from "./pages/myTickets";
import Navbar from "./components/navbar";
import RightCard from "./components/rightCard";
import MyAccount from "./pages/myAccount"


function App() {
  return (
    <div className="App">
        <Router>
          <Switch>
            <Route path="/" exact>
              <Homepage />
            </Route>
            <Route path="/createTicket">
            <Navbar activeElement="raiseTicket">
                <TicketCreationPage />
            </Navbar>
            </Route>
            <Route path="/login">
              <Navbar activeElement="login">
                <Login />
              </Navbar>
            </Route>
            <Route path="/register">
              <Navbar activeElement="register">
                <Register />
              </Navbar>
            </Route>
            <Route path="/myTickets">
              <Navbar activeElement="myTickets">
                <MyTickets />
              </Navbar>
            </Route>
            <Route path="/myAccount">
              <Navbar activeElement="myAccount">
                <MyAccount />
              </Navbar>
            </Route>
          </Switch>
        </Router>
    </div>
  );
}

export default App;
  