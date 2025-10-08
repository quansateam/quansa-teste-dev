import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Menu from "./components/menu/Menu";
import CategoriesPage from "./pages/CategoriesPage";
import ProductsPage from "./pages/ProductsPage";

function App() {
  return (
    <Router>
      <Menu />
      <main>
        <Routes>
          <Route path="/" element={<CategoriesPage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;