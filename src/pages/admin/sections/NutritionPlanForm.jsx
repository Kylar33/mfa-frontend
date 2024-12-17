import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFieldArray, useForm } from 'react-hook-form';
import { axiosPrivate } from '../../../api/axios';

export default function NutritionPlanForm({ plan, trainers, onClose }) {
  const queryClient = useQueryClient();
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: plan || {
      name: '',
      description: '',
      trainer_id: '',
      meals: [{ name: '', description: '', calories: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "meals"
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      // Convertir calorías a números
      data.meals = data.meals.map(meal => ({
        ...meal,
        calories: parseInt(meal.calories)
      }));
      const response = await axiosPrivate.post('/admin/nutrition-plans/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-nutrition-plans']);
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      data.meals = data.meals.map(meal => ({
        ...meal,
        calories: parseInt(meal.calories)
      }));
      const response = await axiosPrivate.put(`/admin/nutrition-plans/${plan.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-nutrition-plans']);
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
    <div className="bg-white shadow sm:rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {plan ? 'Editar Plan Nutricional' : 'Crear Plan Nutricional'}
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
            Nombre del Plan
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
          <label className="block text-sm font-medium text-gray-700">
            Entrenador Asignado
          </label>
          <select
            {...register('trainer_id', { required: 'Debe seleccionar un entrenador' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccionar entrenador</option>
            {trainers?.map((trainer) => (
              <option key={trainer.id} value={trainer.id}>
                {trainer.full_name}
              </option>
            ))}
          </select>
          {errors.trainer_id && (
            <p className="mt-1 text-sm text-red-600">{errors.trainer_id.message}</p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Comidas
            </label>
            <button
              type="button"
              onClick={() => append({ name: '', description: '', calories: '' })}
              className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Añadir Comida
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                  <input
                    {...register(`meals.${index}.name`, { required: 'Requerido' })}
                    placeholder="Nombre de la comida"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.meals?.[index]?.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.meals[index].name.message}
                    </p>
                  )}
                </div>

                <div>
                  <textarea
                    {...register(`meals.${index}.description`)}
                    placeholder="Descripción"
                    rows={2}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      {...register(`meals.${index}.calories`, {
                        required: 'Requerido',
                        min: { value: 0, message: 'No puede ser negativo' }
                      })}
                      placeholder="Calorías"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.meals?.[index]?.calories && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.meals[index].calories.message}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>
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
            {plan ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
}