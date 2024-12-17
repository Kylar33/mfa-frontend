export default function WorkoutPlanDetailModal({ plan, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{plan.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
  
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Descripción:</h3>
            <p className="text-gray-600">{plan.description}</p>
          </div>
  
          <div>
            <h3 className="font-semibold mb-2">Ejercicios:</h3>
            <div className="space-y-3">
              {plan.exercises?.map((exercise, index) => (
                <div 
                  key={exercise.id || index}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded"
                >
                  <div>
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-sm text-gray-600">
                      {exercise.sets} series x {exercise.reps} repeticiones
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }