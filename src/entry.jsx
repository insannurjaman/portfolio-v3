import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./main.jsx";
import { PortfolioAnalytics } from "./portfolio-analytics.jsx";

if (import.meta.env.DEV && new URLSearchParams(location.search).has("audit")) import("./performance-audit.js");

// Keep one root through entry-module updates during local design work.
const root = import.meta.hot?.data.reactRoot ?? createRoot(document.getElementById("root"));
if (import.meta.hot) import.meta.hot.data.reactRoot = root;
root.render(<React.StrictMode><BrowserRouter><App/><PortfolioAnalytics/></BrowserRouter></React.StrictMode>);
