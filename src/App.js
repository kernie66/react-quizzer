import "./App.scss";
// import "bootswatch/dist/quartz/bootstrap.min.css";

// import Container from 'reactstrap/Container';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import QuizPage from "./pages/QuizPage";
import ExplorePage from "./pages/ExplorePage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import { Container } from "reactstrap";
import ApiProvider from "./contexts/ApiProvider";
// import RegistrationPage from "./pages/RegistrationPage";
import FlashProvider from "./contexts/FlashProvider";
import UserProvider from "./contexts/UserProvider";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ResetRequestPage from "./pages/ResetRequestPage";
import ResetPage from "./pages/ResetPage";
import { lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";

const RegistrationPage = lazy(() => import("./pages/RegistrationPage.js"));

// Error logging function
function logErrorToService(error, info) {
  // Use your preferred error logging service
  console.error("Caught an error:", error, info);
}

// Error boundary render function
function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

export default function App() {
  return (
    <Container fluid className="App">
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={logErrorToService}>
        <BrowserRouter>
          <FlashProvider>
            <ApiProvider>
              <UserProvider>
                <Header />
                <Container className="p-0 MainBody">
                  <Routes>
                    <Route
                      path="/login"
                      element={
                        <PublicRoute>
                          <LoginPage />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/register"
                      element={
                        <PublicRoute>
                          <RegistrationPage />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/reset-request"
                      element={
                        <PublicRoute>
                          <ResetRequestPage />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/reset"
                      element={
                        <PublicRoute>
                          <ResetPage />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="*"
                      element={
                        <PrivateRoute>
                          <Routes>
                            <Route path="/" element={<QuizPage />} />
                            <Route path="/explore" element={<ExplorePage />} />
                            <Route path="/user/:username" element={<UserPage />} />
                            <Route path="/password" element={<ChangePasswordPage />} />
                            <Route path="*" element={<Navigate to="/" />} />
                          </Routes>
                        </PrivateRoute>
                      }
                    />
                  </Routes>
                </Container>
              </UserProvider>
            </ApiProvider>
          </FlashProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </Container>
  );
}
