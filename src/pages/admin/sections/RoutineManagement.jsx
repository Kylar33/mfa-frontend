import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { axiosPrivate } from '../../../api/axios';
import RoutineForm from './RoutineForm';

export default function RoutineManagement() {
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: routines, isLoading } = useQuery({
    queryKey: ['routines'],
    queryFn: async () => {
      const response = await axiosPrivate.get('/admin/routines/');
      return response.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosPrivate.delete(`/admin/routines/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['routines']);
    }
  });

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Rutinas</h2>
        <button
          onClick={() => {
            setSelectedRoutine(null);
            setShowForm(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Nueva Rutina
        </button>
      </div>

      {showForm ? (
        <RoutineForm
          routine={selectedRoutine}
          onClose={() => {
            setShowForm(false);
            setSelectedRoutine(null);
          }}
        />
      ) : (
        <div className="space-y-6">
          {routines?.map((routine) => (
            <div
              key={routine.id}
              className="bg-white shadow overflow-hidden sm:rounded-lg"
            >
              <div className="px-4 py-5 sm:px-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {routine.name}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      {routine.description}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setSelectedRoutine(routine);
                        setShowForm(true);
                      }}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('¿Estás seguro de eliminar esta rutina?')) {
                          deleteMutation.mutate(routine.id);
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
                <div className="px-4 py-5 sm:px-6">
                  <h4 className="text-sm font-medium text-gray-500">Ejercicios</h4>
                  <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {routine.exercises?.map((exercise, index) => (
                      <div
                        key={exercise.id || index}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <h5 className="font-medium">{exercise.name}</h5>
                        <p className="text-sm text-gray-600">
                          {exercise.sets} series x {exercise.reps} repeticiones
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
