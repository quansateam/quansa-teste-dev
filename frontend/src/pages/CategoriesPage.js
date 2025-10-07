import React, { useState, useEffect, useCallback } from "react";
import CategoryForm from "../components/CategoryForm";
import CategoryTable from "../components/CategoryTable";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import { categoryService } from "../services/categoryService";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getCategories({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
      });
      setCategories(data.items);
      setPagination((prev) => ({
        ...prev,
        total: data.total,
      }));
    } catch (err) {
      setError("Erro ao carregar categorias: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleCreateCategory = async (categoryData) => {
    try {
      await categoryService.createCategory(categoryData);
      setEditingCategory(null);
      loadCategories();
    } catch (err) {
      setError("Erro ao criar categoria: " + err.message);
    }
  };

  const handleUpdateCategory = async (id, categoryData) => {
    try {
      await categoryService.updateCategory(id, categoryData);
      setEditingCategory(null);
      loadCategories();
    } catch (err) {
      setError("Erro ao atualizar categoria: " + err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      return;
    }

    try {
      await categoryService.deleteCategory(id);
      loadCategories();
    } catch (err) {
      setError("Erro ao excluir categoria: " + err.message);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="container">
      <h1>Categorias</h1>

      {error && <div className="error">{error}</div>}

      <CategoryForm
        category={editingCategory}
        onSubmit={
          editingCategory
            ? (data) => handleUpdateCategory(editingCategory.id, data)
            : handleCreateCategory
        }
        onCancel={handleCancelEdit}
      />

      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <>
          <CategoryTable
            categories={categories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />

          <Pagination
            currentPage={pagination.page}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default CategoriesPage;
