import React, { useState, useEffect, useCallback } from "react";
import ProductForm from "../components/products/ProductForm";
import ProductTable from "../components/products/ProductTable";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import { productsService } from "../services/productService";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await productsService.getProducts({
                page: currentPage,
                limit: itemsPerPage,
                search: searchTerm,
            });
            setProducts(data.items);
            setTotalItems(data.total);
        } catch (err) {
            setError("Erro ao carregar produtos: " + err.message);
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, searchTerm]);

    useEffect(() => {
        let ignore = false; // 👈 Evita setState durante o “fake unmount” do StrictMode

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await productsService.getProducts({
                    page: currentPage,
                    limit: itemsPerPage,
                    search: searchTerm,
                });
                if (!ignore) {
                    setProducts(data.items);
                    setTotalItems(data.total);
                }
            } catch (err) {
                if (!ignore) {
                    setError("Erro ao carregar produtos: " + err.message);
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            ignore = true;
        };
    }, [currentPage, itemsPerPage, searchTerm]);


    const handleCreateProduct = async (productData) => {
        try {
            await productsService.createProduct(productData);
            setEditingProduct(null);
            loadProducts();
        } catch (err) {
            setError("Erro ao criar produto: " + err.message);
        }
    };

    const handleUpdateProduct = async (id, productData) => {
        try {
            await productsService.updateProduct(id, productData);
            setEditingProduct(null);
            loadProducts();
        } catch (err) {
            setError("Erro ao atualizar produto: " + err.message);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Tem a certeza que deseja excluir este produto?")) {
            return;
        }
        try {
            await productsService.deleteProduct(id);
            loadProducts();
        } catch (err) {
            setError("Erro ao excluir produto: " + err.message);
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
    };

    const handleSearch = useCallback((term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    }, []);

    const handlePageChange = useCallback((newPage) => {
        setCurrentPage(newPage);
    }, []);


    return (
        <div className="container">
            <h1>Produtos</h1>

            {error && <div className="error">{error}</div>}

            <ProductForm
                product={editingProduct}
                onSubmit={
                    editingProduct
                        ? (data) => handleUpdateProduct(editingProduct.id, data)
                        : handleCreateProduct
                }
                onCancel={handleCancelEdit}
            />

            <SearchBar onSearch={handleSearch} />

            {loading ? (
                <div className="loading">A carregar...</div>
            ) : (
                <>
                    <ProductTable
                        products={products}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};

export default ProductsPage;