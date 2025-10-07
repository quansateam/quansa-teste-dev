const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");

const router = express.Router();

// Schema de validação para criar/atualizar categoria
const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

const updateCategorySchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
});

// POST /categories - Criar categoria
router.post("/", async (req, res, next) => {
  try {
    const data = categorySchema.parse(req.body);

    const category = await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

// GET /categories - Listar com busca e paginação
router.get("/", async (req, res, next) => {
  try {
    const { search = "", page = "1", limit = "10" } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = search
      ? {
          name: {
            contains: search,
          },
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.count({ where }),
    ]);

    res.json({
      items,
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    next(error);
  }
});

// GET /categories/:id - Buscar por id
router.get("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      const error = new Error("Category not found");
      error.status = 404;
      throw error;
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
});

// PUT /categories/:id - Atualizar categoria
router.put("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = updateCategorySchema.parse(req.body);

    // Verifica se existe
    const exists = await prisma.category.findUnique({ where: { id } });
    if (!exists) {
      const error = new Error("Category not found");
      error.status = 404;
      throw error;
    }

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    res.json(category);
  } catch (error) {
    next(error);
  }
});

// DELETE /categories/:id - Excluir categoria
router.delete("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    // Verifica se existe
    const exists = await prisma.category.findUnique({ where: { id } });
    if (!exists) {
      const error = new Error("Category not found");
      error.status = 404;
      throw error;
    }

    await prisma.category.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
