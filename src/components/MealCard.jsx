export default function MealCard({ meal }) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h5 className="font-semibold text-lg mb-2">{meal.name}</h5>
        <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
        <div className="text-sm">
          <span className="font-medium">Calorías: </span>
          <span className="text-gray-600">{meal.calories}</span>
        </div>
      </div>
    );
  }