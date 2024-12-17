import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFieldArray, useForm } from 'react-hook-form';
import { axiosPrivate } from '../../api/axios';

export default function WorkoutPlanForm({ plan, onClose }) {
  const queryClient = useQueryClient();
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: plan || {
      name: '',
      description: '',
      exercises: [{ name: '', sets: 0, reps: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises"
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosPrivate.post('/trainer/workout-plans/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['workout-plans']);
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosPrivate.put(`/trainer/workout-plans/${plan.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['workout-plans']);
      onClose();
    }
  });

  const onSubmit = (data) => {
    if (plan) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Nombre del Plan</label>
        <input
          {...register('name', { required: true })}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label>Descripción</label>
        <textarea
          {...register('description')}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label>Ejercicios</label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex space-x-2 mb-2">
            <input
              {...register(`exercises.${index}.name`)}
              placeholder="Nombre del ejercicio"
              className="flex-1 border p-2 rounded"
            />
            <input
              type="number"
              {...register(`exercises.${index}.sets`)}
              placeholder="Sets"
              className="w-20 border p-2 rounded"
            />
            <input
              type="number"
              {...register(`exercises.${index}.reps`)}
              placeholder="Reps"
              className="w-20 border p-2 rounded"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Eliminar
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ name: '', sets: 0, reps: 0 })}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Agregar Ejercicio
        </button>
      </div>

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
          {plan ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}