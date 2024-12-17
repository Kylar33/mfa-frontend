import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosPrivate } from '../../api/axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const WeightChart = ({ data }) => {
  if (!data) return null;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="weight" stroke="#3B82F6" />
      </LineChart>
    </ResponsiveContainer>
  );
};

const BodyCompositionChart = ({ data }) => {
  if (!data) return null;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="muscle_mass" stackId="1" stroke="#10B981" fill="#10B981" />
        <Area type="monotone" dataKey="body_fat" stackId="1" stroke="#EF4444" fill="#EF4444" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const NutrientProgress = ({ label, current, target, color }) => {
  const percentage = (current / target) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{current}/{target}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded">
        <div
          className={`h-full rounded bg-${color}-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end mb-4">
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const ProfileEditForm = ({ profile, onSubmit, onClose, isLoading }) => {
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    height: profile?.height || '',
    target_weight: profile?.target_weight || '',
    fitness_goal: profile?.fitness_goal || '',
    health_conditions: profile?.health_conditions || '',
    emergency_contact: profile?.emergency_contact || '',
    calories_goal: profile?.calories_goal || '',
    protein_goal: profile?.protein_goal || '',
    carbs_goal: profile?.carbs_goal || '',
    fat_goal: profile?.fat_goal || '',
    water_goal: profile?.water_goal || '',
    steps_goal: profile?.steps_goal || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Editar Perfil</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Altura (cm)</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Peso Objetivo (kg)</label>
          <input
            type="number"
            name="target_weight"
            value={formData.target_weight}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Objetivo Fitness</label>
          <select
            name="fitness_goal"
            value={formData.fitness_goal}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccionar objetivo</option>
            <option value="pérdida de peso">Pérdida de peso</option>
            <option value="ganancia muscular">Ganancia muscular</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="rendimiento">Mejora de rendimiento</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Condiciones de Salud</label>
          <textarea
            name="health_conditions"
            value={formData.health_conditions}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contacto de Emergencia</label>
          <input
            type="text"
            name="emergency_contact"
            value={formData.emergency_contact}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Meta de Calorías Diarias</label>
          <input
            type="number"
            name="calories_goal"
            value={formData.calories_goal}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Objetivos Nutricionales</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Proteínas (g)</label>
              <input
                type="number"
                name="protein_goal"
                value={formData.protein_goal}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Carbohidratos (g)</label>
              <input
                type="number"
                name="carbs_goal"
                value={formData.carbs_goal}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Grasas (g)</label>
              <input
                type="number"
                name="fat_goal"
                value={formData.fat_goal}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Agua (L)</label>
              <input
                type="number"
                name="water_goal"
                value={formData.water_goal}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Meta de Pasos Diarios</label>
          <input
            type="number"
            name="steps_goal"
            value={formData.steps_goal}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
};

const TimeRangeSelector = ({ selectedRange, onChange }) => {
  const ranges = [
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mes' },
    { value: 'year', label: 'Año' }
  ];

  return (
    <div className="flex space-x-2">
      {ranges.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-3 py-1 rounded-md transition-colors ${
            selectedRange === value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

const calculateBMI = (weight, height) => {
  if (!weight || !height) return 0;
  return ((weight / ((height / 100) ** 2))).toFixed(1);
};

const UserDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const queryClient = useQueryClient();

  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await axiosPrivate.get('/user/profile/');
      return response.data;
    }
  });

  const { data: userMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['user-metrics'],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/metrics/user/${userProfile?.id}/metrics`);
      return response.data;
    },
    enabled: !!userProfile?.id
  });

  const { data: userPlans, isLoading: plansLoading } = useQuery({
    queryKey: ['user-plans'],
    queryFn: async () => {
      const response = await axiosPrivate.get('/user/plans/');
      return response.data;
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosPrivate.put('/user/profile/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-profile']);
      setIsModalOpen(false);
    },
  });

  const logMeal = async (planId, mealId) => {
    try {
      await axiosPrivate.post('/progress/nutrition', {
        plan_id: planId,
        meal_id: mealId,
        completed: true,
        date: new Date().toISOString()
      });
      queryClient.invalidateQueries(['user-plans']);
    } catch (error) {
      console.error('Error logging meal:', error);
    }
  };

  if (profileLoading || metricsLoading || plansLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const latestMetrics = Array.isArray(userMetrics) ? userMetrics[0] : userMetrics;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-8 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
            <h1 className="text-3xl font-bold">Bienvenido, {userProfile?.full_name}</h1>
              <p className="mt-2 text-blue-100">Aquí está tu resumen diario de progreso</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              Editar Perfil
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 rounded-lg p-4">
              <span className="text-2xl mb-2">⚖️</span>
              <p className="text-sm text-blue-100">Peso Actual</p>
              <p className="text-xl font-bold">{latestMetrics?.weight || 0} kg</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <span className="text-2xl mb-2">🔥</span>
              <p className="text-sm text-blue-100">Calorías Diarias</p>
              <p className="text-xl font-bold">{userProfile?.calories_goal || 0} kcal</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <span className="text-2xl mb-2">🎯</span>
              <p className="text-sm text-blue-100">Meta de Peso</p>
              <p className="text-xl font-bold">{userProfile?.target_weight || 0} kg</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <span className="text-2xl mb-2">📈</span>
              <p className="text-sm text-blue-100">IMC</p>
              <p className="text-xl font-bold">
                {calculateBMI(latestMetrics?.weight, userProfile?.height)}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Progreso de Peso</h3>
              <TimeRangeSelector
                selectedRange={timeRange}
                onChange={setTimeRange}
              />
            </div>
            <div className="h-80">
              <WeightChart data={userMetrics} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Composición Corporal
            </h3>
            <div className="h-80">
              <BodyCompositionChart data={userMetrics} />
            </div>
          </div>
        </div>

        {/* Plans Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Workout Plans */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Planes de Ejercicio</h3>
            <div className="space-y-4">
              {userPlans?.workout_plans?.map((plan) => (
                <div key={plan.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">{plan.name}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(plan.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="space-y-2">
                    {plan.exercises?.map((exercise) => (
                      <div key={exercise.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{exercise.name}</span>
                        <span className="text-gray-600">
                          {exercise.sets}x{exercise.reps}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition Plans */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Planes Nutricionales</h3>
            <div className="space-y-4">
              {userPlans?.nutrition_plans?.map((plan) => (
                <div key={plan.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-gray-900 mb-2">{plan.name}</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <NutrientProgress
                      label="Calorías"
                      current={plan.current_calories}
                      target={plan.target_calories}
                      color="blue"
                    />
                    <NutrientProgress
                      label="Proteínas"
                      current={plan.current_protein}
                      target={plan.target_protein}
                      color="red"
                    />
                    <NutrientProgress
                      label="Carbohidratos"
                      current={plan.current_carbs}
                      target={plan.target_carbs}
                      color="green"
                    />
                    <NutrientProgress
                      label="Grasas"
                      current={plan.current_fat}
                      target={plan.target_fat}
                      color="yellow"
                    />
                  </div>
                  <div className="space-y-2">
                    {plan.meals?.map((meal) => (
                      <div key={meal.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{meal.name}</span>
                        <button
                          onClick={() => logMeal(plan.id, meal.id)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Registrar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Edit Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ProfileEditForm
            profile={userProfile}
            onSubmit={updateProfileMutation.mutate}
            onClose={() => setIsModalOpen(false)}
            isLoading={updateProfileMutation.isLoading}
          />
        </Modal>
      </div>
    </div>
  );
};

export default UserDashboard;