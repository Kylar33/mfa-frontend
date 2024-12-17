import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../../components/Layout';
import TrainerManagement from './sections/TrainerManagement';
import UserManagement from './sections/UserManagement';
import WorkoutPlanManagement from './sections/WorkoutPlanManagement';
import NutritionPlanManagement from './sections/NutritionPlanManagement';
import RoutineManagement from './sections/RoutineManagement';
import { axiosPrivate } from '../../api/axios'; // Import axiosPrivate

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');

  // Obtener estadísticas del dashboard
  const { data: dashboardStats } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const response = await axiosPrivate.get('/admin/dashboard/stats');
      return response.data;
    }
  });

  // Verificar estado del sistema
  const { data: systemHealth } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      const response = await axiosPrivate.get('/admin/system/health');
      return response.data;
    },
    refetchInterval: 30000 // Actualizar cada 30 segundos
  });

  const StatCard = ({ title, value, subValue }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {subValue && (
          <p className="text-xs text-gray-500 mt-1">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Entrenadores"
              value={dashboardStats?.total_stats.trainers || 0}
              subValue={`+${dashboardStats?.newTrainersThisMonth || 0} este mes`}
            />
            <StatCard
              title="Usuarios Activos"
              value={dashboardStats?.total_stats.users || 0}
              subValue={`+${dashboardStats?.monthly_stats.new_users || 0} este mes`}
            />
            <StatCard
              title="Planes de Ejercicio"
              value={dashboardStats?.totalWorkoutPlans || 0}
            />
            <StatCard
              title="Planes Nutricionales"
              value={dashboardStats?.totalNutritionPlans || 0}
            />

            {/* Gráfico de actividad reciente */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
              <div className="space-y-4">
                {dashboardStats?.recentActivity?.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600">{activity.description}</span>
                    <span className="text-sm text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Estadísticas de rendimiento */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Rendimiento del Sistema</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>CPU</span>
                  <span className="text-sm font-medium">{systemHealth?.cpu}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Memoria</span>
                  <span className="text-sm font-medium">{systemHealth?.memory}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Almacenamiento</span>
                  <span className="text-sm font-medium">{systemHealth?.storage}%</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'trainers':
        return <TrainerManagement />;
      case 'users':
        return <UserManagement />;
      case 'workouts':
        return <WorkoutPlanManagement />;
      case 'nutrition':
        return <NutritionPlanManagement />;
      case 'routines':
        return <RoutineManagement />;
      default:
        return null;
    }
  };

  const navigationItems = [
    { id: 'overview', label: 'Vista General' },
    { id: 'trainers', label: 'Entrenadores' },
    { id: 'users', label: 'Usuarios' },
    { id: 'workouts', label: 'Planes de Ejercicio' },
    { id: 'nutrition', label: 'Planes Nutricionales' },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            {systemHealth && !systemHealth.healthy && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                ¡Alerta! Hay problemas con el sistema. Por favor, revise el estado.
              </div>
            )}
          </div>

          <nav className="flex space-x-4 border-b border-gray-200 mb-6">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`pb-4 px-2 ${
                  activeSection === item.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-6">
            {renderSection()}
          </div>
        </div>
      </div>
    </Layout>
  );
}