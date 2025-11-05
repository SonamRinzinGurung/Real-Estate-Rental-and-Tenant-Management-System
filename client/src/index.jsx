import React from "react";
import ReactDOM from "react-dom/client";
import "normalize.css";
import "./index.css";
import store from "./app/store";
import { Provider } from "react-redux";
import { injectStore } from "./utils/axiosCreate";
import App from "./App";
import { ToastContainer, Slide } from 'react-toastify';

injectStore(store);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer
        position="bottom-right"
        autoClose={3500}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
      />
    </Provider>
  </React.StrictMode>
);
