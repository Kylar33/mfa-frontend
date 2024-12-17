import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "../../components/Layout";
import UserList from "./UserList";
import UserForm from "./UserForm";
import WorkoutPlanList from "./WorkoutPlanList";
import NutritionPlanList from "./NutritionPlanList";
import WorkoutPlansSection from "./WorkoutPlansSection";
import NutritionPlansSection from "./NutritionPlansSection";
import UserProgressChart from "./UserProgressChart";
import UserGoalsSection from "./UserGoalsSection";
import UserMetricsSection from "./UserMetricsSection";
import { axiosPrivate } from "../../api/axios";
import { UserInfoModal } from "./UserList"; // Import UserInfoModal

export default function TrainerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false); // State for user info modal

  const { data: trainerStats } = useQuery({
    queryKey: ["trainer-stats"],
    queryFn: async () => {
      const response = await axiosPrivate.get("/trainer/dashboard/stats");
      console.log(response.data);
      return response.data;
    },
  });

  const { data: selectedUserProgress } = useQuery({
    queryKey: ["user-progress", selectedUserId],
    queryFn: async () => {
      if (!selectedUserId) return null;
      const response = await axiosPrivate.get(
        `/trainer/user-stats/${selectedUserId}`,
        {
          params: { period: "month" },
        }
      );
      return response.data;
    },
    enabled: !!selectedUserId,
  });

  const { data: selectedUserGoals } = useQuery({
    queryKey: ["user-goals", selectedUserId],
    queryFn: async () => {
      if (!selectedUserId) return null;
      const response = await axiosPrivate.get(
        `/trainer/user/goals/${selectedUserId}`
      );
      return response.data;
    },
    enabled: !!selectedUserId,
  });

  const { data: selectedUserMetrics } = useQuery({
    queryKey: ["user-metrics", selectedUserId],
    queryFn: async () => {
      if (!selectedUserId) return null;
      const response = await axiosPrivate.get(
        `/metrics/user/${selectedUserId}/metrics`
      );
      return response.data;
    },
    enabled: !!selectedUserId,
  });

  const StatCard = ({ title, value, subValue }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
      </div>
    </div>
  );

  const handleSearchUserById = () => {
    const userId = prompt("Ingrese el ID del usuario:");
    if (userId) {
      setSelectedUserId(userId);
      setShowUserInfoModal(true); // Show user info modal
    }
  };

  const renderContent = () => {
    if (activeTab === "metrics") {
      return (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Usuarios Activos"
              value={trainerStats?.total_stats.users || 0}
              subValue="usuarios totales"
            />
            <StatCard
              title="Tasa de Completitud (Ejercicio)"
              value={`${Math.round(
                trainerStats?.completion_rates.workout || 0
              )}%`}
              subValue="promedio general"
            />
            <StatCard
              title="Tasa de Completitud (Nutrición)"
              value={`${Math.round(
                trainerStats?.completion_rates.nutrition || 0
              )}%`}
              subValue="promedio general"
            />
            <StatCard
              title="Total de Usuarios"
              value={trainerStats?.total_stats.users || 0}
              subValue="usuarios registrados"
            />
          </div>

          {selectedUserProgress && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">
                Progreso del Usuario
              </h3>
              <UserProgressChart data={selectedUserProgress} />
            </div>
          )}

          {selectedUserGoals && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">
                Objetivos del Usuario
              </h3>
              <UserGoalsSection data={selectedUserGoals} />
            </div>
          )}

          {selectedUserMetrics && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">
                Métricas del Usuario
              </h3>
              <UserMetricsSection data={selectedUserMetrics} />
            </div>
          )}
        </div>
      );
    }

    if (showForm) {
      switch (activeTab) {
        case "users":
          return (
            <UserForm
              user={selectedItem}
              onClose={() => {
                setShowForm(false);
                setSelectedItem(null);
              }}
            />
          );
        case "workouts":
          return <WorkoutPlansSection />;
        case "nutrition":
          return <NutritionPlansSection />;

        default:
          return null;
      }
    }

    switch (activeTab) {
      case "users":
        return (
          <UserList
            onEdit={(user) => {
              setSelectedItem(user);
              setShowForm(true);
            }}
            onSelectUser={(userId) => setSelectedUserId(userId)}
          />
        );
      case "workouts":
        return (
          <WorkoutPlanList
            onEdit={(plan) => {
              setSelectedItem(plan);
              setShowForm(true);
            }}
          />
        );
      case "nutrition":
        return (
          <NutritionPlanList
            onEdit={(plan) => {
              setSelectedItem(plan);
              setShowForm(true);
            }}
          />
        );
      case "metrics":
        return <>
        <UserMetricsSection data={selectedUserMetrics} />

        </>;
      default:
        return null;
    }
  };

  const tabs = [
    { id: "metrics", label: "Vista General" },
    { id: "users", label: "Usuarios" },
    { id: "workouts", label: "Planes de Ejercicio" },
    { id: "nutrition", label: "Planes Nutricionales" },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Panel de Entrenador
            </h1>
            {activeTab !== "overview" && (
              <button
                onClick={() => {
                  setSelectedItem(null);
                  setShowForm(true);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Nuevo{" "}
                {activeTab === "users"
                  ? "Usuario"
                  : activeTab === "workouts"
                  ? "Plan de Ejercicios"
                  : activeTab === "nutrition"
                  ? "Plan Nutricional"
                :""}
              </button>
            )}
          </div>

          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm 
                    ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } transition-colors`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <button
            onClick={handleSearchUserById}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Buscar Usuario por ID
          </button>

          {renderContent()}
        </div>
      </div>
      {showUserInfoModal && ( // Render user info modal if active
        <UserInfoModal user={{ id: selectedUserId }} onClose={() => setShowUserInfoModal(false)} />
      )}
    </Layout>
  );
}