import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosPrivate } from '../../api/axios';

export default function TrainerList({ onEdit }) {
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

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Email</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {trainers?.map((trainer) => (
            <tr key={trainer.id}>
              <td>{trainer.email}</td>
              <td>{trainer.full_name}</td>
              <td>
                <button
                  onClick={() => onEdit(trainer)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('¿Estás seguro?')) {
                      deleteMutation.mutate(trainer.id);
                    }
                  }}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}