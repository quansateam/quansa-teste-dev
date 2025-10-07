const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function seed() {
  try {
    // Ler dados de teste
    const testDataPath = path.join(__dirname, "../test-data.json");
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));

    // Limpar dados existentes
    await prisma.category.deleteMany();

    // Inserir dados de teste
    for (const category of testData.categories) {
      await prisma.category.create({
        data: category,
      });
    }

    console.log("✅ Dados de teste inseridos com sucesso!");
    console.log(`📊 ${testData.categories.length} categorias criadas`);
  } catch (error) {
    console.error("❌ Erro ao inserir dados de teste:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
