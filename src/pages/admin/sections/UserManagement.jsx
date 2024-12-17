import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { axiosPrivate } from '../../../api/axios';
import UserForm from './UserForm';

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const response = await axiosPrivate.get('/admin/users/');
      return response.data;
    }
  });

  const { data: trainers } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => {
      const response = await axiosPrivate.get('/admin/trainers/');
      return response.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosPrivate.delete(`/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-users']);
    }
  });

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Gestión de Usuarios</h2>
        <button
          onClick={() => {
            setSelectedUser(null);
            setShowForm(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Nuevo Usuario
        </button>
      </div>

      {showForm ? (
        <UserForm
          user={selectedUser}
          trainers={trainers}
          onClose={() => {
            setShowForm(false);
            setSelectedUser(null);
          }}
        />
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entrenador
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users?.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.full_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {trainers?.find(t => t.id === user.trainer_id)?.full_name || 'Sin asignar'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowForm(true);
                      }}
                      className="text-yellow-600 hover:text-yellow-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
                          deleteMutation.mutate(user.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}