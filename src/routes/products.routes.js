const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");

const router = express.Router();

// Schema de validação para criar/atualizar produto
const productSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    price: z.number().nonnegative("O preço não pode ser negativo"),
    stock: z.number().int().nonnegative("O estoque não pode ser negativo"),
    categoryId: z.number().int().positive("O ID da categoria é obrigatório"),
});

const updateProductSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório").optional(),
    price: z.number().nonnegative("O preço não pode ser negativo").optional(),
    stock: z.number().int().nonnegative("O estoque não pode ser negativo").optional(),
    categoryId: z.number().int().positive("O ID da categoria é inválido").optional(),
});

// POST /products - Criar produto
router.post("/", async (req, res, next) => {
    try {
        const data = productSchema.parse(req.body);

        const product = await prisma.product.create({
            data: {
                name: data.name,
                price: data.price,
                stock: data.stock,
                categoryId: data.categoryId
            },
        });

        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
});

// GET /products - Listar com busca e paginação
router.get("/", async (req, res, next) => {
    try {
        const { search = "", page = "1", limit = "10", categoryId } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const where = {};

        // Filtro por nome
        if (search) {
            where.name = { contains: search }; // insensitive → ignora maiúsc/minúsc
        }

        // Filtro por categoria
        if (categoryId) {
            where.categoryId = Number(categoryId);
        }

        const [items, total] = await prisma.$transaction([
            prisma.product.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { createdAt: "desc" },
                include: {
                    category: {
                        select: { name: true },
                    },
                },
            }),
            prisma.product.count({ where }),
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

// GET /products/:id - Buscar por id
router.get("/:id", async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const products = await prisma.product.findUnique({
            where: { id },
        });

        if (!products) {
            const error = new Error("Category not found");
            error.status = 404;
            throw error;
        }

        res.json(products);
    } catch (error) {
        next(error);
    }
});

// PUT /products/:id - Atualizar produto
router.put("/:id", async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const data = updateProductSchema.parse(req.body);

        // Verifica se existe
        const exists = await prisma.product.findUnique({ where: { id } });
        if (!exists) {
            const error = new Error("Product not found");
            error.status = 404;
            throw error;
        }

        const product = await prisma.product.update({
            where: { id },
            data,
        });

        res.json(product);
    } catch (error) {
        next(error);
    }
});

// DELETE /products/:id - Excluir produto
router.delete("/:id", async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        // Verifica se existe
        const exists = await prisma.product.findUnique({ where: { id } });
        if (!exists) {
            const error = new Error("Product not found");
            error.status = 404;
            throw error;
        }

        await prisma.product.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

module.exports = router;

