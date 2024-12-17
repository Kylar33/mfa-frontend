import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { axiosPrivate } from '../../api/axios';
import Select from 'react-select';

export default function UserForm({ user, onClose }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, control } = useForm({
    defaultValues: user || {
      email: '',
      full_name: '',
      password: '',
      height: null,
      target_weight: null,
      fitness_goal: null,
      health_conditions: null,
      emergency_contact: null,
      weight_goal: null,
      body_fat_goal: null,
      muscle_mass_goal: null,
      activity_level_goal: null,
      calories_goal: null,
      protein_goal: null,
      carbs_goal: null,
      fat_goal: null,
      water_goal: null,
      steps_goal: null,
      workout_plan_ids: [],
      nutrition_plan_ids: []
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosPrivate.post('/trainer/users/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosPrivate.put(`/trainer/users/${user.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
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

  const { data: workoutPlans } = useQuery({
    queryKey: ['workout-plans'],
    queryFn: async () => {
      const response = await axiosPrivate.get('/trainer/workout-plans/');
      return response.data;
    }
  });
  
  const { data: nutritionPlans } = useQuery({
    queryKey: ['nutrition-plans'],
    queryFn: async () => {
      const response = await axiosPrivate.get('/trainer/nutrition-plans/');
      return response.data;
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="font-bold text-4xl pb-4">
        {user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          {...register('email', { required: true })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre Completo
        </label>
        <input
          type="text"
          {...register('full_name', { required: true })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.full_name ? 'border-red-500' : ''}`}
        />
        {errors.full_name && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          type="password"
          {...register('password')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Altura
        </label>
        <input
          type="number"
          {...register('height')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Planes de Ejercicio
        </label>
        <Controller
          name="workout_plan_ids"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={workoutPlans?.map((plan) => ({
                value: plan.id,
                label: plan.name
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          )}
        />
      </div>

      <div className='pb-12'>
        <label className="block text-sm font-medium text-gray-700">
          Planes Nutricionales
        </label>
        <Controller
          name="nutrition_plan_ids"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={nutritionPlans?.map((plan) => ({
                value: plan.id,
                label: plan.name
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          )}
        />
      </div>
      <h2 className='font-bold text-4xl pb-4'>Goals</h2>
      <div className="flex flex-wrap">
        
        <div className="w-1/2 pr-2">
          <label className="block text-sm font-medium text-gray-700">
            Peso Objetivo
          </label>
          <input
            type="number"
            {...register('target_weight')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="w-1/2 pr-2">
          <label className="block text-sm font-medium text-gray-700">
            Objetivo de Fitness
          </label>
          <input
            type="text"
            {...register('fitness_goal')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="w-1/2 pr-2">
          <label className="block text-sm font-medium text-gray-700">
            Condiciones de Salud
          </label>
          <input
            type="text"
            {...register('health_conditions')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="w-1/2 pr-2">
          <label className="block text-sm font-medium text-gray-700">
            Contacto de Emergencia
          </label>
          <input
            type="text"
            {...register('emergency_contact')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="w-1/2 pr-2">
          <label className="block text-sm font-medium text-gray-700">
            Objetivo de Peso
          </label>
          <input
            type="number"
            {...register('weight_goal')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="w-1/2 pr-2">
          <label className="block text-sm font-medium text-gray-700">
            Objetivo de Grasa Corporal
          </label>
          <input
            type="number"
            {...register('body_fat_goal')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="w-1/2 pr-2">
          <label className="block text-sm font-medium text-gray-700">
            Objetivo de Masa Muscular
          </label>
          <input
            type="number"
            {...register('muscle_mass_goal')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="w-1/2 pr-2">
          <label className="block text-sm font-medium text-gray-700">
            Objetivo de Nivel de Actividad
          </label>
          <input
            type="number"
            {...register('activity_level_goal')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="w-1/2 pr-2">
          <label className="block text-sm font-medium text-gray-700">
            Objetivo de Calorías
          </label>
          <input
            type="number"
            {...register('calories_goal')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="w-1/2 pr-2">
          <label className="block text-sm font-medium text-gray-700">
            Objetivo de Proteínas
          </label>
          <input
            type="number"
            {...register('protein_goal')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="w-1/2 pr-2">
          <label className="block text-sm font-medium text-gray-700">
            Objetivo de Carbohidratos
          </label>
          <input
            type="number"
            {...register('carbs_goal')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="w-1/2 pr-2">
          <label className="block text-sm font-medium text-gray-700">
            Objetivo de Grasas
          </label>
          <input
            type="number"
            {...register('fat_goal')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="w-1/2 pr-2">
          <label className="block text-sm font-medium text-gray-700">
            Objetivo de Agua
          </label>
          <input
            type="number"
            {...register('water_goal')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="w-1/2 pr-2">
          <label className="block text-sm font-medium text-gray-700">
            Objetivo de Pasos
          </label>
          <input
            type="number"
            {...register('steps_goal')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
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
            : user
            ? 'Actualizar'
            : 'Crear'}
        </button>
      </div>

      {(createMutation.isError || updateMutation.isError) && (
        <div className="text-red-500 text-sm mt-2">
          Error al {user ? 'actualizar' : 'crear'} el usuario. Por favor, intente nuevamente.
        </div>
      )}
    </form>
  );
}