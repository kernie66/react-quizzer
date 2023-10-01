import React from "react";
import ReactDOM from "react-dom/client";
//import "bootswatch/dist/superhero/bootstrap.min.css";
// TODO: Note: Replace ^[theme]^ (examples: darkly, slate, cosmo, spacelab, and superhero. See https://bootswatch.com/ for current theme names.)
//import 'bootstrap/dist/css/bootstrap.min.css';
import "./services/i18n";
import "./index.css";
// core styles are required for all packages
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

// other css files are required only if
// you are using components from the corresponding package
// import '@mantine/dates/styles.css';
// import '@mantine/dropzone/styles.css';
// import '@mantine/code-highlight/styles.css';
// ...

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const theme = createTheme({
  /** Put your mantine theme override here */
});

if (typeof window !== "undefined") {
  console.log("Runs when the app starts");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <React.Suspense fallback="Loading...">
      <MantineProvider theme={theme}>
        <Notifications />
        <App />
      </MantineProvider>
    </React.Suspense>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
