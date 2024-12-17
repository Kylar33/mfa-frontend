import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { axiosPrivate } from '../../api/axios';

export default function TrainerForm({ trainer, onClose }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: trainer || {}
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosPrivate.post('/admin/trainers/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['trainers']);
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosPrivate.put(`/admin/trainers/${trainer.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['trainers']);
      onClose();
    }
  });

  const onSubmit = (data) => {
    if (trainer) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Email</label>
        <input
          type="email"
          {...register('email', { required: true })}
          className="w-full border p-2 rounded"
        />
        {errors.email && <span className="text-red-500">Este campo es requerido</span>}
      </div>

      <div>
        <label>Nombre Completo</label>
        <input
          type="text"
          {...register('full_name', { required: true })}
          className="w-full border p-2 rounded"
        />
        {errors.full_name && <span className="text-red-500">Este campo es requerido</span>}
      </div>

      {!trainer && (
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            {...register('password', { required: !trainer })}
            className="w-full border p-2 rounded"
          />
          {errors.password && <span className="text-red-500">Este campo es requerido</span>}
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {trainer ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}