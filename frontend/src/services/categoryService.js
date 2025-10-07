const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

class CategoryService {
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = "Erro na requisição";

      try {
        const errorData = await response.json();
        if (errorData.details) {
          errorMessage = errorData.details.map((d) => d.message).join(", ");
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        errorMessage = `Erro ${response.status}: ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    // Se a resposta for 204 (No Content), não tentar fazer parse do JSON
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  }

  async getCategories({ page = 1, limit = 10, search = "" } = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    return this.request(`/categories?${params}`);
  }

  async getCategory(id) {
    return this.request(`/categories/${id}`);
  }

  async createCategory(categoryData) {
    return this.request("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id, categoryData) {
    return this.request(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id) {
    return this.request(`/categories/${id}`, {
      method: "DELETE",
    });
  }
}

export const categoryService = new CategoryService();
