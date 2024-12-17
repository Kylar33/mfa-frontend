import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFieldArray, useForm } from 'react-hook-form';
import { axiosPrivate } from '../../api/axios';

export default function NutritionPlanForm({ plan, onClose }) {
  const queryClient = useQueryClient();
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: plan || {
      name: '',
      description: '',
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
      const response = await axiosPrivate.post('/trainer/nutrition-plans/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['nutrition-plans']);
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      // Convertir calorías a números
      data.meals = data.meals.map(meal => ({
        ...meal,
        calories: parseInt(meal.calories)
      }));
      const response = await axiosPrivate.put(`/trainer/nutrition-plans/${plan.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['nutrition-plans']);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {plan ? 'Editar Plan Nutricional' : 'Crear Plan Nutricional'}
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre del Plan
          </label>
          <input
            type="text"
            {...register('name', {
              required: 'El nombre es requerido'
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
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
              Comidas
            </label>
            <button
              type="button"
              onClick={() => append({ name: '', description: '', calories: '' })}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
            >
              Agregar Comida
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Comida {index + 1}</h4>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre
                    </label>
                    <input
                      type="text"
                      {...register(`meals.${index}.name`, {
                        required: 'El nombre es requerido'
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.meals?.[index]?.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.meals[index].name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Calorías
                    </label>
                    <input
                      type="number"
                      {...register(`meals.${index}.calories`, {
                        required: 'Las calorías son requeridas',
                        min: {
                          value: 0,
                          message: 'Las calorías deben ser positivas'
                        }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.meals?.[index]?.calories && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.meals[index].calories.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Descripción
                    </label>
                    <textarea
                      {...register(`meals.${index}.description`)}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={createMutation.isLoading || updateMutation.isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {createMutation.isLoading || updateMutation.isLoading
            ? 'Guardando...'
            : plan
            ? 'Actualizar Plan'
            : 'Crear Plan'}
        </button>
      </div>

      {(createMutation.isError || updateMutation.isError) && (
        <div className="mt-2 text-red-500 text-sm">
          Error al {plan ? 'actualizar' : 'crear'} el plan. Por favor, intente nuevamente.
        </div>
      )}
    </form>
  );
}