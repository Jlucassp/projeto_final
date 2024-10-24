import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2'; 
import axios from 'axios';
import ResourceTable from '../components/ResourceTable';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '../hooks/useAuth';

// Registrar os componentes necessários do Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
  );

const DashboardPage = () => {
    useAuth(); // Garante que o usuário esteja autenticado antes de renderizar o Dashboard

    const [resourcesData, setResourcesData] = useState([]);
    const [selectedResource, setSelectedResource] = useState(null);
    const [editingResource, setEditingResource] = useState(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const token = localStorage.getItem('token'); // Assumindo que o token está armazenado no localStorage
                
                if (!token) {
                    console.error('Token JWT não encontrado no localStorage');
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/resources', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setResourcesData(response.data);
            } catch (error) {
                console.error('Erro ao obter dados dos recursos:', error);
                toast.error('Erro ao obter dados dos recursos.');
            }
        };

        fetchResources();
    }, []);

    const handleViewDetails = (resource) => {
        setSelectedResource(resource);
    };

    const handleEditResource = (resource) => {
        setEditingResource(resource);
    };

    const handleDeleteResource = async (resource) => {
        if (window.confirm(`Tem certeza que deseja remover o recurso "${resource.name}"?`)) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/resources/${resource._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setResourcesData((prevData) => prevData.filter((r) => r._id !== resource._id));

                // Verifica se a notificação já está ativa antes de exibir outra
                if (!toast.isActive('delete-success')) {
                    toast.success('Recurso removido com sucesso!', { toastId: 'delete-success' });
                }
            } catch (error) {
                console.error('Erro ao remover o recurso:', error);
                toast.error('Erro ao remover o recurso.');
            }
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingResource((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:5000/api/resources/${editingResource._id}`, editingResource, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Recurso atualizado:', response.data);
            setEditingResource(null);
            setResourcesData((prevData) =>
              prevData.map((resource) =>
                resource._id === editingResource._id ? editingResource : resource
              )
            );
            toast.success('Recurso atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar o recurso:', error);
            toast.error('Erro ao atualizar o recurso.');
        }
    };

    const resourceTypes = resourcesData.reduce((acc, resource) => {
        acc[resource.type] = (acc[resource.type] || 0) + 1;
        return acc;
    }, {});

    const chartData = {
        labels: Object.keys(resourceTypes),
        datasets: [
            {
                label: 'Quantidade de Recursos',
                data: Object.values(resourceTypes),
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(153, 102, 255, 0.6)'],
            },
        ],
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Dashboard de Visualização</h2>
            <div style={{ width: '600px', margin: '0 auto' }}>
                <Bar data={chartData} />
            </div>
            <div style={{ width: '400px', margin: '20px auto' }}>
                <Pie data={chartData} />
            </div>
            <ResourceTable resources={resourcesData} onViewDetails={handleViewDetails} onEdit={handleEditResource} onDelete={handleDeleteResource} />

            {selectedResource && (
              <div style={{ padding: '20px', border: '1px solid #ddd', marginTop: '20px' }}>
                <h3>Detalhes do Recurso</h3>
                <p><strong>Nome:</strong> {selectedResource.name}</p>
                <p><strong>Tipo:</strong> {selectedResource.type}</p>
                <p><strong>Quantidade:</strong> {selectedResource.quantity}</p>
                <p><strong>Descrição:</strong> {selectedResource.description}</p>
                <button onClick={() => setSelectedResource(null)}>Fechar Detalhes</button>
              </div>
            )}

            {editingResource && (
                <div style={{ padding: '20px', border: '1px solid #ddd', marginTop: '20px' }}>
                    <h3>Editar Recurso</h3>
                    <form onSubmit={handleEditSubmit}>
                        <div>
                            <label>Nome:</label>
                            <input type="text" name="name" value={editingResource.name} onChange={handleEditChange} />
                        </div>
                        <div>
                            <label>Tipo:</label>
                            <input type="text" name="type" value={editingResource.type} onChange={handleEditChange} />
                        </div>
                        <div>
                            <label>Quantidade:</label>
                            <input type="number" name="quantity" value={editingResource.quantity} onChange={handleEditChange} />
                        </div>
                        <div>
                            <label>Descrição:</label>
                            <input type="text" name="description" value={editingResource.description} onChange={handleEditChange} />
                        </div>
                        <button type="submit">Salvar Alterações</button>
                        <button type="button" onClick={() => setEditingResource(null)} style={{ marginLeft: '10px' }}>Cancelar</button>
                    </form>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default DashboardPage;