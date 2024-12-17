export default function ExerciseCard({ exercise }) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h5 className="font-semibold text-lg mb-2">{exercise.name}</h5>
        <div className="space-y-1 text-sm text-gray-600">
          <p>Series: {exercise.sets}</p>
          <p>Repeticiones: {exercise.reps}</p>
        </div>
      </div>
    );
  }