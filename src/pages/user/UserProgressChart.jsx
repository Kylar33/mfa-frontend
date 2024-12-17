import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const UserProgressChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data) return [];

    // Función para obtener el último día de cada semana
    const getWeekNumber = (date) => {
      const d = new Date(date);
      const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
      const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    // Procesar y agregar los datos por semana
    const weeklyData = new Map();

    // Procesar métricas
    data.metrics?.forEach((metric) => {
      const week = getWeekNumber(metric.date);
      const existing = weeklyData.get(week) || {
        week: `Semana ${week}`,
        date: metric.date,
      };

      weeklyData.set(week, {
        ...existing,
        weight: metric.weight || null,
        bodyFat: metric.body_fat || null,
        muscleMass: metric.muscle_mass || null,
        bmi: metric.bmi || null,
      });
    });

    // Procesar progreso de rutinas
    data.workout_progress?.forEach((progress) => {
      const week = getWeekNumber(progress.date);
      const existing = weeklyData.get(week) || {
        week: `Semana ${week}`,
        date: progress.date,
      };
      
      const workoutCount = existing.workoutCount || 0;
      const workoutComplete = existing.workoutComplete || 0;

      weeklyData.set(week, {
        ...existing,
        workoutCount: workoutCount + 1,
        workoutComplete: workoutComplete + (progress.completed ? 1 : 0),
        workoutProgress: Math.round(((workoutComplete + (progress.completed ? 1 : 0)) / (workoutCount + 1)) * 100),
      });
    });

    // Procesar progreso nutricional
    data.nutrition_progress?.forEach((progress) => {
      const week = getWeekNumber(progress.date);
      const existing = weeklyData.get(week) || {
        week: `Semana ${week}`,
        date: progress.date,
      };
      
      const nutritionCount = existing.nutritionCount || 0;
      const nutritionComplete = existing.nutritionComplete || 0;

      weeklyData.set(week, {
        ...existing,
        nutritionCount: nutritionCount + 1,
        nutritionComplete: nutritionComplete + (progress.completed ? 1 : 0),
        nutritionProgress: Math.round(((nutritionComplete + (progress.completed ? 1 : 0)) / (nutritionCount + 1)) * 100),
      });
    });

    // Convertir a array y ordenar por semana
    return Array.from(weeklyData.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data]);

  // Personalización del tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded shadow-lg border">
          <p className="font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value?.toFixed(1) || 'N/A'} 
              {entry.name.includes('%') ? '%' : entry.name.includes('kg') ? ' kg' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="week" 
            className="text-xs"
            tick={{ fill: '#6B7280' }}
          />
          
          {/* Eje Y izquierdo para medidas físicas */}
          <YAxis 
            yAxisId="left"
            tick={{ fill: '#6B7280' }}
            className="text-xs"
          />
          
          {/* Eje Y derecho para porcentajes */}
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            tick={{ fill: '#6B7280' }}
            className="text-xs"
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Líneas de métricas físicas */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="weight"
            name="Peso (kg)"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
          />
          
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="bodyFat"
            name="Grasa Corporal (%)"
            stroke="#EF4444"
            strokeWidth={2}
            dot={false}
          />
          
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="muscleMass"
            name="Masa Muscular (kg)"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
          />

          {/* Líneas de progreso */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="workoutProgress"
            name="Progreso Ejercicios (%)"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={false}
          />
          
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="nutritionProgress"
            name="Progreso Nutrición (%)"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserProgressChart;