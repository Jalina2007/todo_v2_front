import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "@asgardeo/auth-react";
import { authConfig } from "./config";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider config={authConfig}>
    <App />
  </AuthProvider>
);
