import { useQuery } from '@tanstack/react-query';
import { axiosPrivate } from '../../api/axios';

export default function UserPlansView({ userId }) {
  const { data: userPlans, isLoading } = useQuery({
    queryKey: ['user-workout-plans', userId],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/trainer/users/${userId}/workout-plans`);
      return response.data;
    }
  });

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Planes de Ejercicio Asignados</h2>
      {userPlans?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userPlans.map(plan => (
            <div key={plan.id} className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div>
                <h4 className="font-medium mb-2">Ejercicios</h4>
                <ul className="space-y-2">
                  {plan.exercises.map((exercise, index) => (
                    <li 
                      key={exercise.id || index}
                      className="bg-white p-3 rounded border"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{exercise.name}</span>
                        <span className="text-sm text-gray-600">
                          {exercise.sets} series x {exercise.reps} reps
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Este usuario no tiene planes de ejercicio asignados.</p>
      )}
    </div>
  );
}