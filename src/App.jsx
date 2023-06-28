import { Route, Switch } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/home/HomePage";
import ChatPage from "./pages/chat/ChatPage";
import LoginPage from "./pages/login/LoginPage";
import SignupPage from "./pages/singup/SignupPage";
import { PageRoute } from "./common/constants";
import Room from "./features/chat/components/VideoCall/Room";
import CreateRoom from "./features/chat/components/VideoCall/CreateRoom";
import UpdateInfoPage from './pages/update_user/UpdateInfoPage';
function App() {
  return (
    <div className="app">
      <Switch>
        <Route exact path={PageRoute.HOME_PAGE}>
          <HomePage />
        </Route>
        <Route exact path={PageRoute.CHAT_PAGE}>
          <ChatPage />
        </Route>
        <Route exact path={PageRoute.LOGIN_PAGE}>
          <LoginPage />
        </Route>
        <Route exact path={PageRoute.SIGNUP_PAGE}>
          <SignupPage />
        </Route>
        <Route exact path={PageRoute.UPDATE_USER_PAGE}>
          <UpdateInfoPage />
        </Route>
        <Route exact path={"/create-room"}>
          <CreateRoom />
        </Route>
        <Route exact path={"/room/:roomID"}>
          <Room />
        </Route>
        <Route path="/*">Not found</Route>
      </Switch>
    </div>
  );
}

export default App;
