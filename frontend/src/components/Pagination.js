import React from "react";

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalItems === 0) {
    return (
      <div className="pagination">
        <div className="pagination-info">Mostrando 0 de 0 categorias</div>
      </div>
    );
  }

  return (
    <div className="pagination">
      <div className="pagination-info">
        Mostrando {start}-{end} de {totalItems} categorias (Página {currentPage}
        )
      </div>
      <div className="pagination-controls">
        <button
          className="secondary"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <button
          className="secondary"
          onClick={handleNext}
          disabled={currentPage >= totalPages}
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default Pagination;
