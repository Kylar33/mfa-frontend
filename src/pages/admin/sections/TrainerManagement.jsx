import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { axiosPrivate } from '../../../api/axios';
import TrainerForm from './TrainerForm';

export default function TrainerManagement() {
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: trainers, isLoading } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => {
      const response = await axiosPrivate.get('/admin/trainers/');
      return response.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosPrivate.delete(`/admin/trainers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['trainers']);
    }
  });

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este entrenador?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Gestión de Entrenadores</h2>
        <button
          onClick={() => {
            setSelectedTrainer(null);
            setShowForm(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Nuevo Entrenador
        </button>
      </div>

      {showForm ? (
        <TrainerForm
          trainer={selectedTrainer}
          onClose={() => {
            setShowForm(false);
            setSelectedTrainer(null);
          }}
        />
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {trainers?.map((trainer) => (
              <li key={trainer.id}>
                <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {trainer.full_name}
                    </h3>
                    <p className="text-sm text-gray-500">{trainer.email}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setSelectedTrainer(trainer);
                        setShowForm(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(trainer.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}