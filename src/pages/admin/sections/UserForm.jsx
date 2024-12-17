import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { axiosPrivate } from '../../../api/axios';

export default function UserForm({ user, trainers, onClose }) {
  const queryClient = useQueryClient();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    defaultValues: user ? {
      email: user.email,
      full_name: user.full_name,
      trainer_id: user.trainer_id
    } : {
      email: '',
      full_name: '',
      password: '',
      trainer_id: ''
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosPrivate.post('/admin/users/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-users']);
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      if (!data.password) delete data.password;
      const response = await axiosPrivate.put(`/admin/users/${user.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-users']);
      onClose();
    }
  });

  const onSubmit = (data) => {
    if (user) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register('email', {
              required: 'El email es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido'
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre Completo
          </label>
          <input
            type="text"
            {...register('full_name', { required: 'El nombre es requerido' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
          )}
        </div>

        {!user && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              {...register('password', {
                required: !user && 'La contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres'
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Entrenador Asignado
          </label>
          <select
            {...register('trainer_id')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccionar entrenador</option>
            {trainers?.map((trainer) => (
              <option key={trainer.id} value={trainer.id}>
                {trainer.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting 
              ? 'Guardando...' 
              : user 
                ? 'Actualizar' 
                : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
}