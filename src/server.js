const express = require("express");
const cors = require("cors");
const path = require("path");
const categoriesRoutes = require("./routes/categories.routes");
const errorHandler = require("./middlewares/error");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Rotas de categorias
app.use("/categories", categoriesRoutes);

// Middleware de erro (deve ser o último)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
