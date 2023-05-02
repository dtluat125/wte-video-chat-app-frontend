import { Route, Switch } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/home/HomePage";
import ChatPage from "./pages/chat/ChatPage";

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
        <Route path="/*">Not found</Route>
      </Switch>
    </div>
  );
}

export default App;
