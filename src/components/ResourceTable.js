import React from 'react';

const ResourceTable = ({ resources, onViewDetails, onEdit, onDelete }) => {
    return (
      <div style={{ padding: '20px' }}>
        <h3>Lista de Recursos</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nome</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Tipo</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Quantidade</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource._id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{resource.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{resource.type}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{resource.quantity}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button onClick={() => onViewDetails(resource)}>Visualizar Detalhes</button>
                  <button onClick={() => onEdit(resource)} style={{ marginLeft: '10px' }}>Editar</button>
                  <button onClick={() => onDelete(resource)} style={{ marginLeft: '10px', color: 'red' }}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
};

export default ResourceTable;