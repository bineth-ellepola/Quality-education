import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./Component/CourseManagement/AppProvider";

import './index.css'
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <AppProvider>

 <App />
  </AppProvider>
    
  </BrowserRouter>
);




 