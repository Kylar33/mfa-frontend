import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { axiosPrivate } from '../api/axios';
import { LineChart, XAxis, YAxis, Tooltip, Line, ResponsiveContainer } from 'recharts';

export function MetricsTracking({ userId }) {
  const [timeRange, setTimeRange] = useState('month');
  const queryClient = useQueryClient();

  const { data: metrics } = useQuery({
    queryKey: ['user-metrics', userId, timeRange],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/metrics/user/${userId}/metrics`, {
        params: { range: timeRange }
      });
      return response.data;
    }
  });

  const { data: progress } = useQuery({
    queryKey: ['user-progress', userId],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/metrics/user/${userId}/progress`);
      return response.data;
    }
  });

  const addMetricsMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosPrivate.post(`/metrics/user/${userId}/metrics`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-metrics']);
    }
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Progreso Físico</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <MetricCard
            title="Peso Actual"
            value={metrics?.currentWeight}
            unit="kg"
            change={metrics?.weightChange}
          />
          <MetricCard
            title="Grasa Corporal"
            value={metrics?.currentBodyFat}
            unit="%"
            change={metrics?.bodyFatChange}
          />
          <MetricCard
            title="Masa Muscular"
            value={metrics?.currentMuscleMass}
            unit="kg"
            change={metrics?.muscleMassChange}
          />
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics?.history}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#2563eb" />
              <Line type="monotone" dataKey="bodyFat" stroke="#dc2626" />
              <Line type="monotone" dataKey="muscleMass" stroke="#16a34a" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Progreso de Entrenamiento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Planes de Ejercicio</h3>
            <div className="space-y-2">
              {progress?.workoutProgress?.map((workout) => (
                <div key={workout.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                  <span>{workout.name}</span>
                  <span className="text-green-600">{workout.completionRate}%</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Planes Nutricionales</h3>
            <div className="space-y-2">
              {progress?.nutritionProgress?.map((nutrition) => (
                <div key={nutrition.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                  <span>{nutrition.name}</span>
                  <span className="text-green-600">{nutrition.adherenceRate}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, unit, change }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-1 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">
          {value} {unit}
        </p>
        {change && (
          <span className={`ml-2 text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change} {unit}
          </span>
        )}
      </div>
    </div>
  );
}