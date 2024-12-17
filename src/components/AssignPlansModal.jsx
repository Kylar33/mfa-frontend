// src/components/AssignPlansModal.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosPrivate } from '../api/axios';

export default function AssignPlansModal({ user, onClose }) {
  const [selectedWorkoutPlan, setSelectedWorkoutPlan] = useState('');
  const [selectedNutritionPlan, setSelectedNutritionPlan] = useState('');
  const queryClient = useQueryClient();

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

  const assignWorkoutMutation = useMutation({
    mutationFn: async () => {
      await axiosPrivate.post(`/trainer/assign-workout/${user.id}/${selectedWorkoutPlan}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });

  const assignNutritionMutation = useMutation({
    mutationFn: async () => {
      await axiosPrivate.post(`/trainer/assign-nutrition/${user.id}/${selectedNutritionPlan}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });

  const handleAssign = async () => {
    if (selectedWorkoutPlan) {
      await assignWorkoutMutation.mutateAsync();
    }
    if (selectedNutritionPlan) {
      await assignNutritionMutation.mutateAsync();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Asignar Planes a {user.full_name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan de Ejercicios
            </label>
            <select
              value={selectedWorkoutPlan}
              onChange={(e) => setSelectedWorkoutPlan(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar plan</option>
              {workoutPlans?.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan Nutricional
            </label>
            <select
              value={selectedNutritionPlan}
              onChange={(e) => setSelectedNutritionPlan(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar plan</option>
              {nutritionPlans?.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedWorkoutPlan && !selectedNutritionPlan}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Asignar Planes
          </button>
        </div>

        {(assignWorkoutMutation.isError || assignNutritionMutation.isError) && (
          <p className="mt-2 text-sm text-red-600">
            Error al asignar planes. Por favor, intente nuevamente.
          </p>
        )}
      </div>
    </div>
  );
}