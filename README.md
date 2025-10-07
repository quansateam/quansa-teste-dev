# Mini CRUD de Produtos – Node + React + Express + Prisma (SQLite)

Um projeto para avaliação técnica júnior: API REST de categorias já implementada + **você deve implementar a funcionalidade de produtos** usando as categorias existentes.

## ✨ Stack

- **Node.js** (JavaScript)
- **Express** + CORS
- **Prisma ORM** + SQLite
- **Validação** com zod
- **React** (Frontend moderno)

## 🧰 Requisitos

- Node.js 18+
- Yarn

## 🚀 Como rodar

### 1. Fork do Repositório

1. **Acesse**: https://github.com/quansateam/quansa-teste-dev
2. **Clique em "Fork"** (canto superior direito)
3. **Clone seu fork**:

```bash
git clone git@github.com:SEU_USERNAME/quansa-teste-dev.git
cd quansa-teste-dev
```

### 2. Backend (API)

```bash
# Instale dependências do backend
yarn install

# Configure o banco (SQLite via Prisma)
# cria o arquivo dev.db e aplica a migração inicial
yarn migrate

# Suba o servidor em modo dev
yarn dev

# (Opcional) Popule com dados de teste
yarn seed
```

### 3. Frontend (React)

```bash
# Em outro terminal, navegue para a pasta frontend
cd frontend

# Instale dependências do frontend
yarn install

# Execute o frontend React
yarn start
```

**Interface:** http://localhost:3001 (React Frontend)

**API:** http://localhost:3000 (Backend Express)

**Saúde da API:** GET http://localhost:3000/health → `{ "ok": true }`

## 🗄️ Modelos (Prisma)

### Category (já implementado)

- `id` (Int, PK, autoincrement)
- `name` (String, obrigatório, único)
- `description` (String, opcional)
- `createdAt` (DateTime, default now())
- `updatedAt` (DateTime, auto-update)

### Product (você deve implementar)

- `id` (Int, PK, autoincrement)
- `name` (String, obrigatório)
- `price` (Decimal, default 0)
- `stock` (Int, default 0)
- `categoryId` (Int, FK para Category)
- `createdAt` (DateTime, default now())

## 🔌 Endpoints Existentes (Categorias)

### GET /health

Retorna `{ ok: true }`.

### POST /categories

**Body JSON:**

```json
{ "name": "Eletrônicos", "description": "Produtos eletrônicos" }
```

### GET /categories?search=&page=&limit=

Filtro por `name` (contains).  
Paginação simples (page default 1, limit default 10).

### GET /categories/:id

**Retornos:** 200 ou 404

### PUT /categories/:id

**Body JSON (parcial):**

```json
{
  "name": "Eletrônicos e Tecnologia",
  "description": "Produtos eletrônicos e tecnológicos"
}
```

### DELETE /categories/:id

**Retornos:** 204 (ou 404)

## 🎯 Sua Tarefa: Implementar CRUD de Produtos

Você deve implementar a funcionalidade completa de produtos que se relaciona com as categorias existentes.

### 1. Atualizar o Schema do Prisma

Adicione o modelo `Product` no arquivo `prisma/schema.prisma`:

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  price       Decimal  @default(0)
  stock       Int      @default(0)
  categoryId  Int
  category    Category @relation(fields: [categoryId], references: [id])
  createdAt   DateTime @default(now())
}
```

E adicione a relação no modelo `Category`:

```prisma
model Category {
  // ... campos existentes ...
  products    Product[]
}
```

### 2. Criar Rotas de Produtos

Crie o arquivo `src/routes/products.routes.js` com os endpoints:

- `POST /products` → Criação com validação (name obrigatório, price ≥ 0, stock ≥ 0, categoryId obrigatório)
- `GET /products` → Listagem com busca por name, filtro por categoryId, paginação
- `GET /products/:id` → Busca por ID
- `PUT /products/:id` → Atualização parcial
- `DELETE /products/:id` → Exclusão

### 3. Atualizar o Servidor

Adicione as rotas de produtos no `src/server.js`:

```javascript
const productsRoutes = require("./routes/products.routes");
app.use("/products", productsRoutes);
```

### 4. Criar Interface para Produtos

Crie uma nova página ou seção na interface para gerenciar produtos:

- Formulário para criar/editar produtos
- Campo de seleção de categoria (dropdown)
- Tabela com listagem de produtos
- Busca e paginação
- Ações de editar/excluir

### 5. Criar um menu

Crie um menu para Produtos e Categorias

### 6. Executar Migração

```bash
yarn migrate
```

## 🧪 Exemplos de Teste (cURL)

```bash
# Listar categorias
curl 'http://localhost:3000/categories'

# Criar produto (após implementar)
curl -X POST http://localhost:3000/products \
  -H 'Content-Type: application/json' \
  -d '{"name":"iPhone 15","price":5999.90,"stock":10,"categoryId":1}'

# Listar produtos (após implementar)
curl 'http://localhost:3000/products?categoryId=1&search=iPhone'
```

## 🖥️ Interface

### React Frontend

Acesse **http://localhost:3001** para gerenciar categorias com a interface React moderna.

**Para executar o frontend:**

```bash
cd frontend
yarn install
yarn start
```

**Funcionalidades implementadas:**

- ✅ CRUD completo de categorias
- ✅ Busca por nome
- ✅ Paginação
- ✅ Validação com Zod
- ✅ Interface responsiva
- ✅ **Interface React moderna e responsiva**

## 🧩 Scripts úteis

### Backend

```bash
yarn dev      # sobe com nodemon
yarn start    # modo produção
yarn migrate  # prisma migrate dev
yarn studio   # prisma studio (GUI do DB)
yarn seed     # popula o banco com dados de teste
```

### Frontend

```bash
cd frontend
yarn start    # inicia o servidor de desenvolvimento React
yarn build    # build para produção
yarn test     # executa os testes
```

## 🛠️ Solução de problemas

### Backend

- **Porta 3000 ocupada** → altere a porta no `src/server.js`.
- **Erro de migração** → delete `prisma/dev.db` e rode `yarn migrate` novamente.
- **Validação 400** → confira campos obrigatórios e tipos/valores.

### Frontend

- **Porta 3001 ocupada** → o React automaticamente tentará a próxima porta disponível.
- **Erro de conexão com API** → verifique se o backend está rodando na porta 3000.
- **Erro de build** → delete `node_modules` e rode `yarn install` novamente.

## 📝 Critérios de Avaliação

1. **Funcionalidade**: Todos os endpoints CRUD funcionando
2. **Validação**: Validação adequada com Zod
3. **Relacionamentos**: Produtos corretamente relacionados com categorias
4. **Interface**: Interface funcional para gerenciar produtos
5. **Código**: Código limpo, organizado e bem estruturado
6. **Tratamento de Erros**: Tratamento adequado de erros 400, 404, 500

## 💡 Dicas

### Backend

- Use o Prisma Studio (`yarn studio`) para visualizar os dados
- Teste os endpoints com cURL antes de implementar a interface
- Siga o mesmo padrão das rotas de categorias
- Implemente validações com Zod

### Frontend

- O React está configurado com proxy para a API (porta 3000)
- Use `yarn start` no frontend para desenvolvimento
- A interface é responsiva e moderna
- Considere a experiência do usuário na interface

## 📤 Como submeter sua solução

### 1. Commit e Push das alterações

```bash
# Adicione suas alterações
git add .

# Faça commit com uma mensagem descritiva
git commit -m "feat: implementa CRUD de produtos com interface React"

# Envie para seu fork
git push origin main
```

### 2. Criar Pull Request

1. **Acesse seu fork** no GitHub
2. **Clique em "Compare & pull request"**
3. **Preencha o título**: "Implementação do CRUD de Produtos"
4. **Descreva suas implementações** na descrição
5. **Envie o Pull Request**

### 3. O que será avaliado

- ✅ **Funcionalidade**: Todos os endpoints CRUD funcionando
- ✅ **Validação**: Validação adequada com Zod
- ✅ **Relacionamentos**: Produtos corretamente relacionados com categorias
- ✅ **Interface**: Interface funcional para gerenciar produtos
- ✅ **Código**: Código limpo, organizado e bem estruturado
- ✅ **Tratamento de Erros**: Tratamento adequado de erros 400, 404, 500

**Boa sorte! 🚀**

teste
