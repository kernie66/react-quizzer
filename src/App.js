import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { IconContext } from "react-icons";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { EventSourceProvider } from "react-sse-hooks";
import "./App.scss";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import QuizzerShell from "./components/QuizzerShell.js";
import ApiProvider from "./contexts/ApiProvider";
import QuizzerProvider from "./contexts/QuizzerProvider.js";
import SSEProvider from "./contexts/SSEProvider.js";
import UserProvider from "./contexts/UserProvider";
import { BasicErrorFallback, logErrorToService } from "./helpers/errorHandlers.js";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ExplorePage from "./pages/ExplorePage";
import GameListPage from "./pages/GameListPage.js";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage.js";
import ResetPage from "./pages/ResetPage";
import ResetRequestPage from "./pages/ResetRequestPage";
import UserPage from "./pages/UserPage";

const RegistrationPage = lazy(() => import("./pages/RegistrationPage.js"));

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global default is 20 minutes
      staleTime: 1000 * 60 * 20,
    },
  },
});

const iconDefaults = { size: 30 };

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={BasicErrorFallback} onError={logErrorToService}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ApiProvider>
            <UserProvider>
              <EventSourceProvider>
                <SSEProvider>
                  <QuizzerProvider>
                    <ErrorBoundary
                      FallbackComponent={BasicErrorFallback}
                      onError={logErrorToService}
                    >
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
                                    <Route path="/gamelist" element={<GameListPage />} />
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
                  </QuizzerProvider>
                </SSEProvider>
              </EventSourceProvider>
            </UserProvider>
          </ApiProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
