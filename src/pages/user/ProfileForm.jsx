import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { axiosPrivate } from '../../api/axios';

export default function ProfileForm({ profile, onSuccess }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      full_name: profile.full_name,
      email: profile.email
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosPrivate.put('/user/profile/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-profile']);
      onSuccess();
    }
  });

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre Completo
        </label>
        <input
          type="text"
          {...register('full_name', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.full_name && (
          <p className="mt-1 text-sm text-red-500">Este campo es requerido</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          {...register('email', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">Este campo es requerido</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={updateMutation.isLoading}
        >
          {updateMutation.isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
}
