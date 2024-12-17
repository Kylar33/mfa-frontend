import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { axiosPrivate } from "../../api/axios";
import { useState } from "react";
import AssignPlansModal from "./AssignPlansModal";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


export default function UserList({ onEdit }) {
  const queryClient = useQueryClient();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false); // State for user info modal
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      axiosPrivate.get("/trainer/users/").then((response) => response.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosPrivate.delete(`/trainer/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });

  const handleDeleteUser = (userId) => {
    if (window.confirm("¿Estás seguro?")) {
      deleteMutation.mutate(userId);
    }
  };

  const handleAssignPlans = (user) => {
    setSelectedUser(user);
    setShowAssignModal(true);
  };

  const handleCloseModal = () => {
    setShowAssignModal(false);
    setSelectedUser(null);
  };

  const handleShowUserInfo = (user) => {
    setSelectedUser(user);
    setShowUserInfoModal(true); // Show user info modal
  };

  const handleCloseUserInfoModal = () => {
    setShowUserInfoModal(false);
    setSelectedUser(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {users?.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div
              onClick={() => handleShowUserInfo(user)}
              className="cursor-pointer"
            >
              {" "}
              {/* Clickable div for user info */}
              <img
                src={`https://api.multiavatar.com/${user.id}.png`}
                alt={`${user.full_name}'s avatar`}
                className="w-16 h-16 rounded-full mr-4"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {user.full_name}
              </h3>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => onEdit(user)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => handleAssignPlans(user)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                  Asignar Planes
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showAssignModal && (
        <AssignPlansModal user={selectedUser} onClose={handleCloseModal} />
      )}
      {showUserInfoModal && ( // Render user info modal if active
        <UserInfoModal user={selectedUser} onClose={handleCloseUserInfoModal} />
      )}
    </div>
  );
}



 export const UserInfoModal = ({ user, onClose }) => {
  const { data: workoutPlans, isLoading: isWorkoutLoading } = useQuery({
    queryKey: ["workout-plans", user.id],
    queryFn: async () => {
      const response = await axiosPrivate.get(
        `/trainer/users/${user.id}/workout-plans/`
      );
      return response.data;
    },
    enabled: !!user.id,
  });

  const { data: nutritionPlans, isLoading: isNutritionLoading } = useQuery({
    queryKey: ["nutrition-plans", user.id],
    queryFn: async () => {
      const response = await axiosPrivate.get(
        `/trainer/users/${user.id}/nutritional-plans/`
      );
      return response.data;
    },
    enabled: !!user.id,
  });

  const { data: userMetrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: ["user-metrics", user.id],
    queryFn: async () => {
      const response = await axiosPrivate.get(
        `/metrics/user/${user.id}/metrics`
      );
      return response.data;
    },
    enabled: !!user.id,
  });

  if (isWorkoutLoading || isNutritionLoading || isMetricsLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-1">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  const latestMetrics = userMetrics[0]; // Usar los últimos datos de métricas

  const handleDownloadPDF = () => {
    const content = document.getElementById('pdf-content');
    html2canvas(content).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('user-info.pdf');
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-1">
      <div
        id="pdf-content"
        className="bg-white rounded-lg shadow-lg p-6 w-full  z-50 h-[100%] overflow-auto"
        style={{
          maxHeight: "100%",
          overflowY: "100%",
          overflowX: "100%",
        }}
      >
        <div className="flex items-center mb-4">
          <img
            src={`https://randomuser.me/api/portraits/men/${user.id}.jpg`}
            alt={`${user.full_name}'s avatar`}
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h2 className="text-xl font-semibold">{user.full_name}</h2>
            <p className="text-gray-700">Teléfono: {user.emergency_contact}</p>
            <p className="text-gray-700">Peso: {user.target_weight} kg</p>
            <p className="text-gray-700">Altura: {user.height} cm</p>
            <p className="text-gray-700">ID: {user.id}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="border-b border-gray-200 pb-4 mb-4">
          <h3 className="text-lg font-medium mb-2">Planes Asignados</h3>
          <div className="grid grid-cols-2 gap-4">
            {workoutPlans?.map((plan) => (
              <div
                key={plan.id}
                className="border rounded-lg p-4 flex flex-col items-center justify-center"
              >
                <i className="fas fa-dumbbell text-4xl text-green-500 mb-2"></i>
                <h4 className="font-medium text-center">{plan.name}</h4>
                <p className="text-center">{plan.description}</p>
              </div>
            ))}
            {nutritionPlans?.map((plan) => (
              <div
                key={plan.id}
                className="border rounded-lg p-4 flex flex-col items-center justify-center"
              >
                <i className="fas fa-utensils text-4xl text-orange-500 mb-2"></i>
                <h4 className="font-medium text-center">{plan.name}</h4>
                <p className="text-center">{plan.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-4">
          <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
            <i className="fas fa-weight text-4xl text-blue-500 mb-2"></i>
            <h3 className="font-medium text-center">Peso Objetivo</h3>
            <p className="text-center">{user.target_weight}</p>
          </div>
          <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
            <i className="fas fa-dumbbell text-4xl text-green-500 mb-2"></i>
            <h3 className="font-medium text-center">Meta de Fitness</h3>
            <p className="text-center">{user.fitness_goal}</p>
          </div>
          <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
            <i className="fas fa-heartbeat text-4xl text-red-500 mb-2"></i>
            <h3 className="font-medium text-center">Condiciones de Salud</h3>
            <p className="text-center">{user.health_conditions}</p>
          </div>
          <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
            <i className="fas fa-chart-line text-4xl text-yellow-500 mb-2"></i>
            <h3 className="font-medium text-center">Meta de Peso</h3>
            <p className="text-center">{user.weight_goal}</p>
          </div>
          <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
            <i className="fas fa-percentage text-4xl text-indigo-500 mb-2"></i>
            <h3 className="font-medium text-center">Meta de Grasa Corporal</h3>
            <p className="text-center">{user.body_fat_goal}</p>
          </div>
          <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
            <i className="fas fa-users text-4xl text-pink-500 mb-2"></i>
            <h3 className="font-medium text-center">Meta de Masa Muscular</h3>
            <p className="text-center">{user.muscle_mass_goal}</p>
          </div>
          <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
            <i className="fas fa-running text-4xl text-purple-500 mb-2"></i>
            <h3 className="font-medium text-center">Nivel de Actividad</h3>
            <p className="text-center">{user.activity_level_goal}</p>
          </div>
          <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
            <i className="fas fa-fire text-4xl text-orange-500 mb-2"></i>
            <h3 className="font-medium text-center">Meta de Calorías</h3>
            <p className="text-center">{user.calories_goal}</p>
          </div>
          <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
            <i className="fas fa-egg text-4xl text-gray-500 mb-2"></i>
            <h3 className="font-medium text-center">Meta de Proteínas</h3>
            <p className="text-center">{user.protein_goal}</p>
          </div>
          <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
            <i className="fas fa-bread-slice text-4xl text-teal-500 mb-2"></i>
            <h3 className="font-medium text-center">Meta de Carbohidratos</h3>
            <p className="text-center">{user.carbs_goal}</p>
          </div>
          <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
            <i className="fas fa-drumstick-bite text-4xl text-lime-500 mb-2"></i>
            <h3 className="font-medium text-center">Meta de Grasas</h3>
            <p className="text-center">{user.fat_goal}</p>
          </div>
          <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
            <i className="fas fa-tint text-4xl text-cyan-500 mb-2"></i>
            <h3 className="font-medium text-center">Meta de Agua</h3>
            <p className="text-center">{user.water_goal}</p>
          </div>
          <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
            <i className="fas fa-shoe-prints text-4xl text-black mb-2"></i>
            <h3 className="font-medium text-center">Meta de Pasos</h3>
            <p className="text-center">{user.steps_goal}</p>
          </div>
        </div>

        <UserMetricsSection userId={user.id} />
        <UserMetricsChart userMetrics={userMetrics} />

        <div className="flex justify-end">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Descargar PDF
          </button>
          <button
            onClick={onClose}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue -600 transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
    </div>
  );
};

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="bg-black bg-opacity-50 absolute inset-0 cursor-pointer"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-lg z-10 max-w-2xl w-full">
        {children}
      </div>
    </div>
  );
};




const UserMetricsSection = ({ userId }) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [muscleMass, setMuscleMass] = useState("");
  const [height, setHeight] = useState("");
  const [notes, setNotes] = useState("");

  const { data: userMetrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: ["user-metrics", userId],
    queryFn: async () => {
      const response = await axiosPrivate.get(
        `/metrics/user/${userId}/metrics`
      );
      return response.data;
    },
    enabled: !!userId,
  });

  const { data: userProgress, isLoading: isProgressLoading } = useQuery({
    queryKey: ["user-progress", userId],
    queryFn: async () => {
      const response = await axiosPrivate.get(
        `/metrics/user/${userId}/progress`
      );
      return response.data;
    },
    enabled: !!userId,
  });

  const createMetricsMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosPrivate.post(
        `/metrics/user/${userId}/metrics`,
        {
          weight: parseFloat(weight),
          body_fat: parseFloat(bodyFat),
          muscle_mass: parseFloat(muscleMass),
          height: parseFloat(height),
          notes,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user-metrics", userId]);
      setIsCreating(false);
    },
  });

  const updateMetricsMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosPrivate.put(
        `/metrics/user/${userId}/metrics`,
        {
          weight: parseFloat(weight),
          body_fat: parseFloat(bodyFat),
          muscle_mass: parseFloat(muscleMass),
          height: parseFloat(height),
          notes,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user-metrics", userId]);
      setIsEditing(false);
    },
  });

  const latestMetrics = userMetrics?.[0];

  if (
    isMetricsLoading ||
    isProgressLoading
  ) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  const handleEditMetrics = (metric) => {
    setWeight(metric.weight.toString());
    setBodyFat(metric.body_fat.toString());
    setMuscleMass(metric.muscle_mass.toString());
    setHeight(metric.height.toString());
    setNotes(metric.notes || "");
    setIsEditing(true);
  };

  const handleSaveMetrics = () => {
    if (isCreating) {
      createMetricsMutation.mutate();
    } else if (isEditing) {
      updateMetricsMutation.mutate();
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleAddMetrics = () => {
    setWeight("");
    setBodyFat("");
    setMuscleMass("");
    setHeight("");
    setNotes("");
    setIsCreating(true);
  };

  return (
    <div>
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h3 className="text-lg font-medium mb-2">Métricas</h3>
        <button
          onClick={handleAddMetrics}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors duration-200 mb-4"
        >
          Agregar Nuevas Métricas
        </button>
        {isEditing ? (
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-4">
            <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
              <i className="fas fa-weight text-4xl text-blue-500 mb-2"></i>
              <h3 className="font-medium text-center">Peso</h3>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="text-center"
              />
            </div>
            <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
              <i className="fas fa-percentage text-4xl text-indigo-500 mb-2"></i>
              <h3 className="font-medium text-center">Grasa Corporal</h3>
              <input
                type="number"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="text-center"
              />
            </div>
            <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
              <i className="fas fa-users text-4xl text-pink-500 mb-2"></i>
              <h3 className="font-medium text-center">Masa Muscular</h3>
              <input
                type="number"
                value={muscleMass}
                onChange={(e) => setMuscleMass(e.target.value)}
                className="text-center"
              />
            </div>
            <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
              <i className="fas fa-ruler text-4xl text-teal-500 mb-2"></i>
              <h3 className="font-medium text-center">Altura</h3>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="text-center"
              />
            </div>
            <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
              <i className="fas fa-sticky-note text-4xl text-gray-500 mb-2"></i>
              <h3 className="font-medium text-center">Notas</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-center"
              ></textarea>
            </div>
            <div className="col-span-full flex justify-end space-x-2">
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveMetrics}
                disabled={createMetricsMutation.isLoading || updateMetricsMutation.isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                {createMetricsMutation.isLoading || updateMetricsMutation.isLoading
                  ? 'Guardando...'
                  : 'Guardar Métricas'}
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">Fecha</th>
                  <th className="border border-gray-300 p-2">Peso (kg)</th>
                  <th className="border border-gray-300 p-2">Grasa Corporal (%)</th>
                  <th className="border border-gray-300 p-2">Masa Muscular (kg)</th>
                  <th className="border border-gray-300 p-2">Altura (cm)</th>
                  <th className="border border-gray-300 p-2">BMI</th>
                  <th className="border border-gray-300 p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {userMetrics?.map((metric) => (
                  <tr key={metric.date}>
                    <td className="border border-gray-300 p-2">{metric.date}</td>
                    <td className="border border-gray-300 p-2">{metric.weight} kg</td>
                    <td className="border border-gray-300 p-2">{metric.body_fat}%</td>
                    <td className="border border-gray-300 p-2">{metric.muscle_mass} kg</td>
                    <td className="border border-gray-300 p-2">{metric.height} cm</td>
                    <td className="border border-gray-300 p-2">{metric.BMI}</td>
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={() => handleEditMetrics(metric)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md transition-colors duration-200"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isCreating && (
        <Modal onClose={handleCancelEdit}>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium mb-4">Agregar Nuevas Métricas</h3>
            <div className="grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-4">
              <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
                <i className="fas fa-weight text-4xl text-blue-500 mb-2"></i>
                <h3 className="font-medium text-center">Peso</h3>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="text-center"
                />
              </div>
              <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
                <i className="fas fa-percentage text-4xl text-indigo-500 mb-2"></i>
                <h3 className="font-medium text-center">Grasa Corporal</h3>
                <input
                  type="number"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  className="text-center"
                />
              </div>
              <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
                <i className="fas fa-users text-4xl text-pink-500 mb-2"></i>
                <h3 className="font-medium text-center">Masa Muscular</h3>
                <input
                  type="number"
                  value={muscleMass}
                  onChange={(e) => setMuscleMass(e.target.value)}
                  className="text-center"
                />
              </div>
              <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
                <i className="fas fa-ruler text-4xl text-teal-500 mb-2"></i>
                <h3 className="font-medium text-center">Altura</h3>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="text-center"
                />
              </div>
              <div className="border rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
                <i className="fas fa-sticky-note text-4xl text-gray-500 mb-2"></i>
                <h3 className="font-medium text-center">Notas</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="text-center"
                ></textarea>
              </div>
              <div className="col-span-full flex justify-end space-x-2">
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveMetrics}
                  disabled={createMetricsMutation.isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  {createMetricsMutation.isLoading ? 'Guardando...' : 'Guardar Métricas'}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      
</div>);
}





const UserMetricsChart = ({ userMetrics }) => {
  // Transformar los datos de métricas a un formato adecuado para los gráficos
  const chartData = userMetrics.map((metric) => ({
    date: metric.date,
    weight: metric.weight,
    bodyFat: metric.body_fat,
    muscleMass: metric.muscle_mass,
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-medium mb-4">Métricas del Usuario</h3>
      <div className="h-[400px]">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis type="number" domain={['dataMin', 'dataMax']} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="weight" stroke="#8884d8" name="Peso" />
            <Line type="monotone" dataKey="bodyFat" stroke="#82ca9d" name="Grasa Corporal" />
            <Line type="monotone" dataKey="muscleMass" stroke="#ffc658" name="Masa Muscular" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};