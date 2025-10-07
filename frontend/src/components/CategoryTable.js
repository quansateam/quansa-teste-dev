import React from "react";

const CategoryTable = ({ categories, onEdit, onDelete }) => {
  if (categories.length === 0) {
    return <div className="empty-state">Nenhuma categoria encontrada</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Descrição</th>
          <th>Criado em</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <tr key={category.id}>
            <td>{category.id}</td>
            <td>{category.name}</td>
            <td className="description-cell" title={category.description || ""}>
              {category.description || "-"}
            </td>
            <td>{new Date(category.createdAt).toLocaleDateString("pt-BR")}</td>
            <td>
              <div className="actions">
                <button onClick={() => onEdit(category)}>Editar</button>
                <button
                  className="danger"
                  onClick={() => onDelete(category.id)}
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

export default CategoryTable;
