import React from "react";
import ReactDOM from "react-dom/client";
import "./services/i18n";

// core styles are required for all packages
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css"; //if using mantine date picker features
import "mantine-react-table/styles.css"; //import MRT styles
// other css files are required only if
// you are using components from the corresponding package
// import '@mantine/dates/styles.css';
// import '@mantine/dropzone/styles.css';
// import '@mantine/code-highlight/styles.css';
// ...

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
// import LogRocket from "logrocket";

const theme = createTheme({
  /** Put your mantine theme override here */
});

// LogRocket.init("iyyx8v/quizzer_dev");

if (typeof window !== "undefined") {
  console.log("Runs when the app starts");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <React.Suspense fallback="Loading...">
      <ColorSchemeScript defaultColorScheme="light" />
      <MantineProvider theme={theme} defaultColorScheme="light">
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
