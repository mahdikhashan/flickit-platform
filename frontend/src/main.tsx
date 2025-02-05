import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toastDefaultConfig } from "@config/toastConfigs";
import { ServiceProvider } from "./providers/ServiceProvider";
import { ThemeProvider } from "@mui/material";
import { theme } from "@config/theme";
import { AppProvider } from "./providers/AppProvider";
import { AuthProvider } from "./providers/AuthProvider";
import CssBaseline from "@mui/material/CssBaseline";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { createRoot } from "react-dom/client";
import keycloakService from "@/service/keycloakService";

const renderApp = () =>
  createRoot(document.getElementById("root") as HTMLElement).render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Suspense fallback="loading...">
          <AppProvider>
            <AuthProvider>
              <ServiceProvider>
                <CssBaseline />
                <ToastContainer {...toastDefaultConfig} />
                <App />
              </ServiceProvider>
            </AuthProvider>
          </AppProvider>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );

keycloakService.initKeycloak(renderApp);
