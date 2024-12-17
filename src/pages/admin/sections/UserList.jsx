import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosPrivate } from '../../../api/axios';
import UserPlansView from './UserPlansView';
import AssignPlansModal from '../../../components/AssignPlansModal';

export default function UserList({ onEdit }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPlans, setShowPlans] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axiosPrivate.get('/admin/users/');
      return response.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosPrivate.delete(`/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {showPlans ? (
        <div>
          <button
            onClick={() => setShowPlans(false)}
            className="mb-4 text-blue-500 hover:text-blue-700 flex items-center"
          >
            <span className="mr-2">←</span> Volver a la lista
          </button>
          <UserPlansView userId={selectedUser.id} />
        </div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowPlans(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Ver Planes
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowAssignModal(true);
                      }}
                      className="text-green-500 hover:text-green-600 mr-4"
                    >
                      Asignar Planes
                    </button>
                    <button
                      onClick={() => onEdit(user)}
                      className="text-yellow-500 hover:text-yellow-600 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
                          deleteMutation.mutate(user.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-600"
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

      {showAssignModal && (
        <AssignPlansModal
          user={selectedUser}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}