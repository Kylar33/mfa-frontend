import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFieldArray, useForm } from 'react-hook-form';
import { axiosPrivate } from '../../../api/axios';

export default function RoutineForm({ routine, onClose }) {
  const queryClient = useQueryClient();
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: routine || {
      name: '',
      description: '',
      exercises: [{ name: '', sets: '', reps: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises"
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      data.exercises = data.exercises.map(exercise => ({
        ...exercise,
        sets: parseInt(exercise.sets),
        reps: parseInt(exercise.reps)
      }));
      const response = await axiosPrivate.post('/admin/routines/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['routines']);
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      data.exercises = data.exercises.map(exercise => ({
        ...exercise,
        sets: parseInt(exercise.sets),
        reps: parseInt(exercise.reps)
      }));
      const response = await axiosPrivate.put(`/admin/routines/${routine.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['routines']);
      onClose();
    }
  });

  const onSubmit = (data) => {
    if (routine) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {routine ? 'Editar Rutina' : 'Crear Rutina'}
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
            Nombre de la Rutina
          </label>
          <input
            type="text"
            {...register('name', { required: 'El nombre es requerido' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Ejercicios
            </label>
            <button
              type="button"
              onClick={() => append({ name: '', sets: '', reps: '' })}
              className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Añadir Ejercicio
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex-1">
                  <input
                    {...register(`exercises.${index}.name`, { required: 'Requerido' })}
                    placeholder="Nombre del ejercicio"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.exercises?.[index]?.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.exercises[index].name.message}
                    </p>
                  )}
                </div>
                <div className="w-20">
                  <input
                    type="number"
                    {...register(`exercises.${index}.sets`, {
                      required: 'Requerido',
                      min: { value: 1, message: 'Mín. 1' }
                    })}
                    placeholder="Series"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.exercises?.[index]?.sets && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.exercises[index].sets.message}
                    </p>
                  )}
                </div>
                <div className="w-20">
                  <input
                    type="number"
                    {...register(`exercises.${index}.reps`, {
                      required: 'Requerido',
                      min: { value: 1, message: 'Mín. 1' }
                    })}
                    placeholder="Reps"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.exercises?.[index]?.reps && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.exercises[index].reps.message}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
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
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {routine ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
}