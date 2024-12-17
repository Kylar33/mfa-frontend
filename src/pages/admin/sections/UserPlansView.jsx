import { useQuery } from '@tanstack/react-query';
import { axiosPrivate } from '../../../api/axios';

export default function UserPlansView({ userId }) {
  const { data: userPlans, isLoading } = useQuery({
    queryKey: ['user-plans', userId],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/admin/users/${userId}/plans`);
      return response.data;
    }
  });

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      {/* Planes de Ejercicio */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Planes de Ejercicio</h3>
        {userPlans?.workout_plans?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userPlans.workout_plans.map(plan => (
              <div key={plan.id} className="border rounded-lg p-4">
                <h4 className="font-medium">{plan.name}</h4>
                <p className="text-sm text-gray-600">{plan.description}</p>
                <div className="mt-3">
                  <h5 className="text-sm font-medium">Ejercicios:</h5>
                  <ul className="mt-2 space-y-2">
                    {plan.exercises.map((exercise, idx) => (
                      <li key={idx} className="text-sm bg-gray-50 p-2 rounded">
                        <span className="font-medium">{exercise.name}</span>
                        <span className="text-gray-600"> - {exercise.sets}x{exercise.reps}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay planes de ejercicio asignados</p>
        )}
      </div>

      {/* Planes Nutricionales */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Planes Nutricionales</h3>
        {userPlans?.nutrition_plans?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userPlans.nutrition_plans.map(plan => (
              <div key={plan.id} className="border rounded-lg p-4">
                <h4 className="font-medium">{plan.name}</h4>
                <p className="text-sm text-gray-600">{plan.description}</p>
                <div className="mt-3">
                  <h5 className="text-sm font-medium">Comidas:</h5>
                  <ul className="mt-2 space-y-2">
                    {plan.meals.map((meal, idx) => (
                      <li key={idx} className="text-sm bg-gray-50 p-2 rounded">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{meal.name}</span>
                          <span className="text-sm text-green-600">{meal.calories} cal</span>
                        </div>
                        {meal.description && (
                          <p className="text-xs text-gray-500 mt-1">{meal.description}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay planes nutricionales asignados</p>
        )}
      </div>

      {/* Rutinas */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Rutinas</h3>
        {userPlans?.routines?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userPlans.routines.map(routine => (
              <div key={routine.id} className="border rounded-lg p-4">
                <h4 className="font-medium">{routine.name}</h4>
                <p className="text-sm text-gray-600">{routine.description}</p>
                <div className="mt-3">
                  <h5 className="text-sm font-medium">Ejercicios:</h5>
                  <ul className="mt-2 space-y-2">
                    {routine.exercises.map((exercise, idx) => (
                      <li key={idx} className="text-sm bg-gray-50 p-2 rounded">
                        <span className="font-medium">{exercise.name}</span>
                        <span className="text-gray-600"> - {exercise.sets}x{exercise.reps}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay rutinas asignadas</p>
        )}
      </div>
    </div>
  );
}