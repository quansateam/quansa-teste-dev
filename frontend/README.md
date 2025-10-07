# Frontend React - CRUD de Categorias

Este é o frontend React para o sistema de CRUD de categorias.

## Funcionalidades

- ✅ Listagem de categorias com paginação
- ✅ Busca por nome
- ✅ Criação de novas categorias
- ✅ Edição de categorias existentes
- ✅ Exclusão de categorias
- ✅ Interface responsiva e moderna

## Tecnologias

- React 18
- JavaScript ES6+
- CSS3
- Fetch API para comunicação com backend

## Como executar

1. Certifique-se de que o backend está rodando na porta 3000
2. Instale as dependências:

   ```bash
   yarn install
   ```

3. Execute o projeto:

   ```bash
   yarn start
   ```

4. Acesse http://localhost:3001

## Estrutura do projeto

```
src/
├── components/
│   ├── CategoryForm.js      # Formulário de criação/edição
│   ├── CategoryTable.js     # Tabela de listagem
│   ├── SearchBar.js         # Barra de busca
│   └── Pagination.js        # Controles de paginação
├── services/
│   └── categoryService.js   # Serviços de API
├── App.js                   # Componente principal
├── index.js                 # Ponto de entrada
└── index.css                # Estilos globais
```

## Configuração

O frontend está configurado para se comunicar com o backend em `http://localhost:3000` por padrão. Para alterar a URL da API, defina a variável de ambiente `REACT_APP_API_URL`.
