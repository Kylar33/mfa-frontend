import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { axiosPrivate } from '../../../api/axios';
import NutritionPlanForm from './NutritionPlanForm';

export default function NutritionPlanManagement() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: nutritionPlans, isLoading } = useQuery({
    queryKey: ['all-nutrition-plans'],
    queryFn: async () => {
      const response = await axiosPrivate.get('/admin/nutrition-plans/');
      return response.data;
    }
  });

  const { data: trainers } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => {
      const response = await axiosPrivate.get('/admin/trainers/');
      return response.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosPrivate.delete(`/admin/nutrition-plans/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-nutrition-plans']);
    }
  });

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Planes Nutricionales
        </h2>
        <button
          onClick={() => {
            setSelectedPlan(null);
            setShowForm(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Nuevo Plan
        </button>
      </div>

      {showForm ? (
        <NutritionPlanForm
          plan={selectedPlan}
          trainers={trainers}
          onClose={() => {
            setShowForm(false);
            setSelectedPlan(null);
          }}
        />
      ) : (
        <div className="space-y-6">
          {nutritionPlans?.map((plan) => (
            <div
              key={plan.id}
              className="bg-white shadow overflow-hidden sm:rounded-lg"
            >
              <div className="px-4 py-5 sm:px-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {plan.name}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Creado por: {trainers?.find(t => t.id === plan.trainer_id)?.full_name || 'Desconocido'}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setSelectedPlan(plan);
                        setShowForm(true);
                      }}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('¿Estás seguro de eliminar este plan?')) {
                          deleteMutation.mutate(plan.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Descripción
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {plan.description}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 mb-2">
                      Comidas
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {plan.meals?.map((meal, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <h4 className="font-medium">{meal.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {meal.description}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              Calorías: {meal.calories}
                            </p>
                          </div>
                        ))}
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}