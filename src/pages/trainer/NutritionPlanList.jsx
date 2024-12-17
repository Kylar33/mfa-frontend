import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosPrivate } from '../../api/axios';
import MealCard from '../../components/MealCard';


export default function NutritionPlanList({ onEdit }) {
  const queryClient = useQueryClient();

  const { data: nutritionPlans, isLoading } = useQuery({
    queryKey: ['nutrition-plans'],
    queryFn: async () => {
      const response = await axiosPrivate.get('/trainer/nutrition-plans/');
      return response.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosPrivate.delete(`/trainer/nutrition-plans/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['nutrition-plans']);
    }
  });

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="space-y-4">
      {nutritionPlans?.map((plan) => (
        <div key={plan.id} className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-gray-600">{plan.description}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => onEdit(plan)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Editar
              </button>
              <button
                onClick={() => {
                  if (window.confirm('¿Estás seguro de eliminar este plan?')) {
                    deleteMutation.mutate(plan.id);
                  }
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Comidas:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plan.meals?.map((meal, index) => (
                <MealCard key={meal.id || index} meal={meal} />
              ))}
            </div>
          </div>

          {plan.meals?.length === 0 && (
            <p className="text-gray-500 italic">No hay comidas en este plan</p>
          )}
        </div>
      ))}

      {nutritionPlans?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay planes nutricionales creados</p>
        </div>
      )}
    </div>
  );
}