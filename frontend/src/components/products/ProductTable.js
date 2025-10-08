import React from "react";

const ProductTable = ({ products, onEdit, onDelete }) => {
    if (products.length === 0) {
        return <div className="empty-state">Nenhum produto encontrado</div>;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Quantidade no estoque</th>
                    <th>Categoria do produto</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.stock}</td>
                        <td>{product.category?.name}</td>
                        < td > {new Date(product.createdAt).toLocaleDateString("pt-BR")}</td>
                        <td>
                            <div className="actions">
                                <button onClick={() => onEdit(product)}>Editar</button>
                                <button
                                    className="danger"
                                    onClick={() => onDelete(product.id)}
                                >
                                    Excluir
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ProductTable;
