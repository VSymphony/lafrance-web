import React from "react";

const TableProducts = ({ products }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-center mb-3">Lista de Productos</h2>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Descripción</th>
            <th className="p-2 border">Precio</th>
            <th className="p-2 border">Categoría</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="p-2 border">{p.id}</td>
              <td className="p-2 border">{p.nombre}</td>
              <td className="p-2 border">{p.descripcion}</td>
              <td className="p-2 border">S/ {p.precio}</td>
              <td className="p-2 border">{p.categoria?.nombre || "Sin categoría"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableProducts;
