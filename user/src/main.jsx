import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/index.js";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <Provider store={store}>
      <Suspense>
        <App />
        <Toaster
          toastOptions={{
            position: "top-center",
          }}
        />
      </Suspense>
    </Provider>
  // </StrictMode>
);
