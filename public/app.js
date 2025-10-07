const API_URL = "http://localhost:3000";

let currentPage = 1;
let currentLimit = 10;
let currentSearch = "";
let editingId = null;

// Elementos DOM
const categoryForm = document.getElementById("categoryForm");
const categoryIdInput = document.getElementById("categoryId");
const nameInput = document.getElementById("name");
const descriptionInput = document.getElementById("description");
const searchInput = document.getElementById("searchInput");
const categoriesBody = document.getElementById("categoriesBody");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const paginationInfo = document.getElementById("paginationInfo");
const formTitle = document.getElementById("formTitle");
const cancelBtn = document.getElementById("cancelBtn");

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();

  // Event listeners
  categoryForm.addEventListener("submit", handleSubmit);
  searchInput.addEventListener("input", debounce(handleSearch, 500));
  prevBtn.addEventListener("click", () => changePage(-1));
  nextBtn.addEventListener("click", () => changePage(1));
  cancelBtn.addEventListener("click", resetForm);
});

// Listar categorias
async function loadCategories() {
  try {
    const response = await fetch(
      `${API_URL}/categories?search=${currentSearch}&page=${currentPage}&limit=${currentLimit}`
    );
    const data = await response.json();

    renderCategories(data.items);
    updatePagination(data);
  } catch (error) {
    console.error("Error loading categories:", error);
    alert("Erro ao carregar categorias");
  }
}

// Renderizar tabela de categorias
function renderCategories(categories) {
  if (categories.length === 0) {
    categoriesBody.innerHTML =
      '<tr><td colspan="5" class="empty-state">Nenhuma categoria encontrada</td></tr>';
    return;
  }

  categoriesBody.innerHTML = categories
    .map(
      (category) => `
    <tr>
      <td>${category.id}</td>
      <td>${category.name}</td>
      <td class="description-cell" title="${category.description || ""}">${
        category.description || "-"
      }</td>
      <td>${new Date(category.createdAt).toLocaleDateString("pt-BR")}</td>
      <td>
        <div class="actions">
          <button onclick="editCategory(${category.id})">Editar</button>
          <button class="danger" onclick="deleteCategory(${
            category.id
          })">Excluir</button>
        </div>
      </td>
    </tr>
  `
    )
    .join("");
}

// Atualizar informações de paginação
function updatePagination(data) {
  const start = (data.page - 1) * data.limit + 1;
  const end = Math.min(data.page * data.limit, data.total);

  paginationInfo.textContent = `Mostrando ${start}-${end} de ${data.total} categorias (Página ${data.page})`;

  prevBtn.disabled = data.page === 1;
  nextBtn.disabled = data.page * data.limit >= data.total;
}

// Criar ou atualizar categoria
async function handleSubmit(e) {
  e.preventDefault();

  const categoryData = {
    name: nameInput.value,
    description: descriptionInput.value || null,
  };

  try {
    let response;

    if (editingId) {
      // Atualizar
      response = await fetch(`${API_URL}/categories/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });
    } else {
      // Criar
      response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.details
          ? error.details.map((d) => d.message).join(", ")
          : error.error || "Erro ao salvar categoria"
      );
    }

    resetForm();
    loadCategories();
  } catch (error) {
    console.error("Error saving category:", error);
    alert(error.message);
  }
}

// Editar categoria
async function editCategory(id) {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`);

    if (!response.ok) {
      throw new Error("Categoria não encontrada");
    }

    const category = await response.json();

    editingId = id;
    categoryIdInput.value = id;
    nameInput.value = category.name;
    descriptionInput.value = category.description || "";

    formTitle.textContent = `Editar Categoria #${id}`;
    cancelBtn.style.display = "inline-block";

    // Scroll para o formulário
    document
      .querySelector(".form-section")
      .scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.error("Error editing category:", error);
    alert(error.message);
  }
}

// Excluir categoria
async function deleteCategory(id) {
  if (!confirm("Tem certeza que deseja excluir esta categoria?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
    });

    if (!response.ok && response.status !== 204) {
      throw new Error("Erro ao excluir categoria");
    }

    loadCategories();
  } catch (error) {
    console.error("Error deleting category:", error);
    alert(error.message);
  }
}

// Resetar formulário
function resetForm() {
  editingId = null;
  categoryForm.reset();
  categoryIdInput.value = "";
  formTitle.textContent = "Nova Categoria";
  cancelBtn.style.display = "none";
}

// Busca
function handleSearch(e) {
  currentSearch = e.target.value;
  currentPage = 1;
  loadCategories();
}

// Mudar página
function changePage(delta) {
  currentPage += delta;
  loadCategories();
}

// Debounce para busca
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
