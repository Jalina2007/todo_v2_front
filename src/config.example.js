// Copy this file to `config.js` and fill in your own values.
// `config.js` is gitignored so your local config is never committed.

// Asgardeo (WSO2) configuration.
// Fill these in from your Asgardeo application's "Protocol" / "Info" tabs.
export const authConfig = {
  signInRedirectURL: "http://localhost:5173",
  signOutRedirectURL: "http://localhost:5173",
  clientID: "<your-asgardeo-client-id>",
  baseUrl: "https://api.asgardeo.io/t/<your-org>",
  scope: ["openid", "profile"]
};

// Base URL of the Ballerina backend.
export const API_URL = "http://localhost:9090/api";
