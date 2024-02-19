import "./App.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage.js";
import ExplorePage from "./pages/ExplorePage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import ApiProvider from "./contexts/ApiProvider";
import UserProvider from "./contexts/UserProvider";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ResetRequestPage from "./pages/ResetRequestPage";
import ResetPage from "./pages/ResetPage";
import { lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BasicErrorFallback, logErrorToService } from "./helpers/errorHandlers.js";
import SSEProvider from "./contexts/SSEProvider.js";
import QuizzerShell from "./components/QuizzerShell.js";
import { IconContext } from "react-icons";

const RegistrationPage = lazy(() => import("./pages/RegistrationPage.js"));

//const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
//const endpoint = BASE_API_URL + "/api/connect";

const queryClient = new QueryClient();

const iconDefaults = { size: 30 };

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={BasicErrorFallback} onError={logErrorToService}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ApiProvider>
            <UserProvider>
              <SSEProvider>
                <ErrorBoundary FallbackComponent={BasicErrorFallback} onError={logErrorToService}>
                  <IconContext.Provider value={iconDefaults}>
                    <QuizzerShell>
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
                                <Route path="/" element={<MainPage />} />
                                <Route path="/explore" element={<ExplorePage />} />
                                <Route path="/user/:id" element={<UserPage />} />
                                <Route path="/password" element={<ChangePasswordPage />} />
                                <Route path="*" element={<Navigate to="/" />} />
                              </Routes>
                            </PrivateRoute>
                          }
                        />
                      </Routes>
                    </QuizzerShell>
                  </IconContext.Provider>
                </ErrorBoundary>
              </SSEProvider>
            </UserProvider>
          </ApiProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
