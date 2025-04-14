import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./pages/home";
import Search from "./pages/search";

import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultLayout from "./layouts/default";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster richColors position="top-right" />
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <DefaultLayout>
              <Home />
            </DefaultLayout>
          }
        />
        <Route
          path="/search"
          element={
            <DefaultLayout>
              <Search />
            </DefaultLayout>
          }
        />
        <Route path="*" element={<div>Not found</div>} />
      </Routes>
    </Router>
  </StrictMode>
);
