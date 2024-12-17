import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosPrivate } from '../../api/axios';

const UserGoalsSection = ({ data }) => {
  const [editMode, setEditMode] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: updateUserGoals } = useMutation({
    mutationFn: async (updatedGoals) => {
      const response = await axiosPrivate.put('/goals/user/goals/', updatedGoals);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-goals']);
      setEditMode(false);
    }
  });

  const handleSaveGoals = () => {
    updateUserGoals(data);
  };

  return (
    <div>
      {editMode ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="weight-goal" className="block text-sm font-medium text-gray-700">
                Objetivo de Peso
              </label>
              <input
                id="weight-goal"
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                defaultValue={data.weight_goal}
              />
            </div>
            <div>
              <label htmlFor="body-fat-goal" className="block text-sm font-medium text-gray-700">
                Objetivo de Grasa Corporal
              </label>
              <input
                id="body-fat-goal"
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                defaultValue={data.body_fat_goal}
              />
            </div>
          </div>
          {/* Add more goal inputs here */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveGoals}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Objetivo de Peso</label>
              <p className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                {data.weight_goal ?? 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Objetivo de Grasa Corporal</label>
              <p className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                {data.body_fat_goal ?? 'N/A'}
              </p>
            </div>
          </div>
          {/* Add more goal displays here */}
          <div className="flex justify-end">
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Editar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserGoalsSection;