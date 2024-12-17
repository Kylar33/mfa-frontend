import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosPrivate } from '../../api/axios';

export default function AssignPlansModal({ user, onClose }) {
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);

  const handleWorkoutClick = () => {
    setShowWorkoutModal(true);
  };

  const handleNutritionClick = () => {
    setShowNutritionModal(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">
            Seleccionar tipo de plan para {user.full_name}
          </h2>

          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={handleWorkoutClick}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
            >
              Plan de Ejercicios
            </button>
            <button
              onClick={handleNutritionClick}
              className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
            >
              Plan Nutricional
            </button>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {showWorkoutModal && (
        <AssignPlanTypeModal
          user={user}
          onClose={() => setShowWorkoutModal(false)}
          type="workout"
        />
      )}
      {showNutritionModal && (
        <AssignPlanTypeModal
          user={user}
          onClose={() => setShowNutritionModal(false)}
          type="nutrition"
        />
      )}
    </>
  );
}

function AssignPlanTypeModal({ user, onClose, type }) {
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState('');

  const { data: plans } = useQuery({
    queryKey: [type === 'workout' ? 'workout-plans' : 'nutrition-plans'],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/trainer/${type === 'workout' ? 'workout-plans' : 'nutrition-plans'}/`);
      return response.data;
    }
  });

  const handleAssign = async () => {
    try {
      await assignMutation.mutateAsync();
      onClose();
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.detail);
      } else {
        alert('Error al asignar plan');
      }
    }
  };
  
  const assignMutation = useMutation({
    mutationFn: async () => {
      if (selectedPlan) {
        const response = await axiosPrivate.post(
          `/trainer/assign-${type}/${user.id}/${selectedPlan}`
        );
        return response.data;
      }
    }
  });

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          Asignar Plan {type === 'workout' ? 'de Ejercicios' : 'Nutricional'} a {user.full_name}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {type === 'workout' ? 'Plan de Ejercicios' : 'Plan Nutricional'}
            </label>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Seleccionar plan</option>
              {plans?.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedPlan}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Asignar
          </button>
        </div>
      </div>
    </div>
  );
}