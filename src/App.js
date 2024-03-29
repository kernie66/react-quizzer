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
import { Container } from "@mantine/core";
import { BasicErrorFallback, logErrorToService } from "./helpers/errorHandlers.js";

const RegistrationPage = lazy(() => import("./pages/RegistrationPage.js"));

const queryClient = new QueryClient();

export default function App() {
  return (
    <Container fluid className="App" mx={{ base: 0, md: 16 }} px={{ base: 8, md: 16 }}>
      <ErrorBoundary FallbackComponent={BasicErrorFallback} onError={logErrorToService}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <ApiProvider>
              <UserProvider>
                <ErrorBoundary FallbackComponent={BasicErrorFallback} onError={logErrorToService}>
                  <Container fluid="md" className="p-0 MainBody">
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
                  </Container>
                </ErrorBoundary>
              </UserProvider>
            </ApiProvider>
            <ReactQueryDevtools />
          </QueryClientProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </Container>
  );
}
