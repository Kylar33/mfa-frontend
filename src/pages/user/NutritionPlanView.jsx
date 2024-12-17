export default function NutritionPlanView({ plan }) {
    return (
      <div className="border rounded-lg p-4 mb-4">
        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
        <p className="text-gray-600 mb-4">{plan.description}</p>
        
        <h4 className="font-bold mb-2">Comidas:</h4>
        <div className="space-y-2">
          {plan.meals.map((meal, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded">
              <p className="font-medium">{meal.name}</p>
              <p className="text-gray-600">{meal.description}</p>
              <p className="text-sm text-gray-500">Calorías: {meal.calories}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }