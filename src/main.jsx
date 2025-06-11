import React from "react";
import ReactDOM from "react-dom/client";
import { Refine } from "@refinedev/core";
import { notificationProvider } from "@refinedev/antd";
import { BrowserRouter } from "react-router-dom";
import App from "./pages/App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Refine notificationProvider={notificationProvider}>
      <App />
    </Refine>
  </BrowserRouter>
);