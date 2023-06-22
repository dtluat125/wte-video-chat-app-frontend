import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import store from "./plugins/redux-toolkit/store";
import { SocketProvider } from "./plugins/socket/SocketProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <SocketProvider>
          <ChakraProvider
            toastOptions={{
              defaultOptions: {
                position: "top-right",
                duration: 2000,
                isClosable: true,
              },
            }}
          >
            <App />
          </ChakraProvider>
        </SocketProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
