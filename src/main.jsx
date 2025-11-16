import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { ErrorBoundary } from "react-error-boundary";

import "./index.css";
import App from "./App.jsx";
import ErrorPage from "./components/ErrorPage";
import { axiosAuth, createAuthInterceptor } from "./redux/api/axios.js";

createAuthInterceptor(axiosAuth, store);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#222222",
                colorInfo: "#222222",
                colorTextBase: "#0e1430",
                colorTextSecondary: "#545457",
                fontFamily: "Jura, sans-serif",
              },
              components: {
                Button: {
                  primaryShadow: "0 1px 2px 0 rgba(16,24,40,0.05)",
                  paddingInline: 16,
                  paddingInlineLG: 16,
                  controlHeight: 40,
                },
                Select: {
                  controlHeightLG: 42,
                  controlPaddingHorizontal: 16,
                  activeBorderColor: "#d6fadb",
                  hoverBorderColor: "#d6fadb",
                  activeOutlineColor: "#d6fadb",
                  optionSelectedBg: "#d6fadb",
                  optionSelectedColor: "#1f5226",
                  optionActiveBg: "#f0fdf4",
                  colorText: "#222222",
                  colorBgContainer: "#ffffff",
                  borderRadiusLG: 8,
                },
                Dropdown: {
                  menuBg: "#ffffff",
                  itemHoverBg: "#C3F4C9",
                  itemSelectedBg: "#C3F4C9",
                  itemSelectedColor: "#1f5226",
                  colorText: "#222222",
                  fontSize: 16,
                  borderRadiusLG: 8,
                },
                Input: {
                  controlHeight: 42,
                  controlPaddingHorizontal: 16,
                  activeBorderColor: "#d6fadb",
                  hoverBorderColor: "#d6fadb",
                  activeOutlineColor: "#d6fadb",
                },
                TextArea: {
                  controlHeight: 42,
                  controlPaddingHorizontal: 16,
                  activeBorderColor: "#d6fadb",
                  hoverBorderColor: "#d6fadb",
                  activeOutlineColor: "#d6fadb",
                },
                InputNumber: {
                  controlHeight: 42,
                  controlPaddingHorizontal: 16,
                  activeBorderColor: "#d6fadb",
                  hoverBorderColor: "#d6fadb",
                  activeOutlineColor: "#d6fadb",
                },
                Divider: {
                  colorSplit: "rgb(234,236,240)",
                },
                Pagination: {
                  colorText: "rgb(7,0,49)",
                  itemActiveBg: "#1f5226",
                  colorPrimary: "rgb(255,255,255)",
                },
                Checkbox: {
                  colorPrimary: "rgb(233,235,243)",
                  colorText: "#444444",
                  fontSize: 16,
                  colorWhite: "#1f5226",
                  colorBorder: "rgb(208,213,221)",
                  colorPrimaryBorder: "rgb(21,0,139)",
                  paddingXS: 12,
                  controlInteractiveSize: 20,
                  borderRadiusSM: 6,
                  algorithm: true,
                },
                DatePicker: {
                  algorithm: true,
                },
                Badge: {
                  colorError: "rgb(21,0,139)",
                },
                Collapse: {
                  contentBg: "rgba(255,255,255,0)",
                  headerBg: "rgba(0,0,0,0)",
                  colorBorder: "rgb(234,236,240)",
                  colorTextHeading: "rgb(16,24,40)",
                  colorText: "rgb(102,112,133)",
                  contentPadding: "16px 4px 32px 16px!important",
                  headerPadding: "16px 16px",
                },
                Radio: {
                  colorPrimary: "#00BC1A",
                  colorBorder: "rgb(208,213,221)",
                  colorText: "#444444",
                  fontSize: 16,
                  controlInteractiveSize: 20,
                  borderRadiusSM: 6,
                  paddingXS: 12,
                  algorithm: true,
                }
              },
            }}
          >
            <Toaster
              position="top-right"
              reverseOrder={true}
              toastOptions={{
                duration: 4000,
                success: {
                  style: {
                    background: "#07bc0c",
                    color: "#fff",
                  },
                },
                error: {
                  style: {
                    background: "#e74c3c",
                    color: "#fff",
                  },
                },
              }}
            />
            <ErrorBoundary FallbackComponent={ErrorPage}>
              <App />
            </ErrorBoundary>
          </ConfigProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
