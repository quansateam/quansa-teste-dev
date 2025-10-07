const { ZodError } = require("zod");

function errorHandler(err, req, res, next) {
  // Erro de validação Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation error",
      details: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Erro 404 customizado
  if (err.status === 404) {
    return res.status(404).json({ error: err.message || "Not found" });
  }

  // Erro 400 customizado
  if (err.status === 400) {
    return res.status(400).json({ error: err.message || "Bad request" });
  }

  // Erro genérico 500
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
}

module.exports = errorHandler;
