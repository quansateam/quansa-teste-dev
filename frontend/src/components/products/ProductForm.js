import React, { useState, useEffect } from "react";
import { categoryService } from "../../services/categoryService";

const ProductForm = ({ product, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        stock: "",
        categoryId: "",
    });

    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await categoryService.getCategories({ page: 1, limit: 100 });
            setCategories(data.items);
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                price: product.price?.toString() || "",
                stock: product.stock?.toString() || "",
                categoryId: product.categoryId || "",
            });
        } else {
            setFormData({ name: "", price: "", stock: "", categoryId: "" });
        }
    }, [product]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!formData.name.trim()) {
            setError("O nome é obrigatório.");
            return;
        }

        if (isNaN(Number(formData.price)) || formData.price.trim() === "") {
            setError("O preço deve ser um número válido.");
            return;
        }
        const priceNum = parseFloat(formData.price);
        if (priceNum < 0) {
            setError("O preço não pode ser negativo.");
            return;
        }

        // 2. Validar o Estoque
        if (isNaN(Number(formData.stock)) || formData.stock.trim() === "" || formData.stock.includes('.')) {
            setError("O estoque deve ser um número inteiro válido.");
            return;
        }
        const stockNum = parseInt(formData.stock, 10);
        if (stockNum < 0) {
            setError("O estoque não pode ser negativo.");
            return;
        }

        if (!formData.categoryId) {
            setError("A categoria é obrigatória.");
            return;
        }

        const payload = {
            ...formData,
            price: priceNum,
            stock: stockNum,
            categoryId: parseInt(formData.categoryId, 10),
        };

        onSubmit(payload);

        if (!isEditing) {
            setFormData({
                name: "",
                price: "",
                stock: "",
                categoryId: "",
            });
        }
    };

    const isEditing = !!product;

    return (
        <div className="form-section">
            <h2 id="formTitle">
                {isEditing && product ? `Editar Produto #${product.id}` : "Novo Produto"}
            </h2>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Nome *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Preço</label>
                    <textarea
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Ex: 29.99"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="stock">Quantidade em estoque</label>
                    <textarea
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="Ex: 50"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="categoryId">Categoria</label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione uma categoria</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-actions">
                    <button type="submit">{isEditing ? "Atualizar" : "Salvar"}</button>
                    {isEditing && (
                        <button type="button" className="secondary" onClick={onCancel}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ProductForm;

