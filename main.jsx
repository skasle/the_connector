import React from "react";
import ReactDOM from "react-dom/client";
import Issue001 from "./Issue001";
import Issue002 from "./Issue002";

const path = window.location.pathname;

let Component = Issue002; // default to latest
if (path.includes("001")) Component = Issue001;
if (path.includes("002")) Component = Issue002;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Component />
  </React.StrictMode>
);
