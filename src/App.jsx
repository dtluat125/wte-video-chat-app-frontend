import { Route, Switch } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/home/HomePage";
import ChatPage from "./pages/chat/ChatPage";
import LoginPage from "./pages/login/LoginPage";
import SignupPage from "./pages/singup/SignupPage";

function App() {
  return (
    <div className="app">
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/chats">
          <ChatPage />
        </Route>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/signup">
          <SignupPage />
        </Route>
        <Route path="/*">Not found</Route>
      </Switch>
    </div>
  );
}

export default App;
