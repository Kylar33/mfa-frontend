import { useState } from 'react';
import WorkoutPlanList from './WorkoutPlanList';
import WorkoutPlanForm from './WorkoutPlanForm';
import WorkoutPlanDetailModal from './WorkoutPlanDetailModal';

export default function WorkoutPlansSection() {
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setShowForm(true);
  };

  const handleView = (plan) => {
    setSelectedPlan(plan);
    setShowDetailModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Planes de Ejercicio</h2>
        <button
          onClick={() => {
            setSelectedPlan(null);
            setShowForm(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Nuevo Plan
        </button>
      </div>

      {showForm ? (
        <WorkoutPlanForm
          plan={selectedPlan}
          onClose={() => {
            setShowForm(false);
            setSelectedPlan(null);
          }}
        />
      ) : (
        <WorkoutPlanList 
          onEdit={handleEdit}
          onView={handleView}
        />
      )}

      {showDetailModal && (
        <WorkoutPlanDetailModal
          plan={selectedPlan}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedPlan(null);
          }}
        />
      )}
    </div>
  );
}