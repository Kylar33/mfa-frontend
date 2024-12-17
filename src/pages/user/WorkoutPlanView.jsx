export default function WorkoutPlanView({ plan }) {
    return (
      <div className="border rounded-lg p-4 mb-4">
        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
        <p className="text-gray-600 mb-4">{plan.description}</p>
        
        <h4 className="font-bold mb-2">Ejercicios:</h4>
        <div className="space-y-2">
          {plan.exercises.map((exercise, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded">
              <p className="font-medium">{exercise.name}</p>
              <p className="text-sm text-gray-600">
                {exercise.sets} series x {exercise.reps} repeticiones
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }