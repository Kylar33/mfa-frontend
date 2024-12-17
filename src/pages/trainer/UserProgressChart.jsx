import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserProgressChart = ({ data }) => {
  // Formateamos los datos para el gráfico
  const formatChartData = (progressData) => {
    if (!progressData) return [];
    
    const { metrics = [], workoutProgress = [], nutritionProgress = [] } = progressData;

    // Creamos un mapa de fechas para combinar todas las métricas
    const dateMap = new Map();

    // Añadimos métricas (peso, grasa corporal, etc.)
    metrics.forEach(metric => {
      const date = new Date(metric.date).toLocaleDateString();
      dateMap.set(date, {
        date,
        weight: metric.weight || null,
        bodyFat: metric.body_fat || null,
        muscleMass: metric.muscle_mass || null,
      });
    });

    // Añadimos progreso de ejercicios
    workoutProgress.forEach(progress => {
      const date = new Date(progress.date).toLocaleDateString();
      const existing = dateMap.get(date) || { date };
      dateMap.set(date, {
        ...existing,
        workoutCompletion: progress.completed ? 100 : 0,
      });
    });

    // Añadimos progreso de nutrición
    nutritionProgress.forEach(progress => {
      const date = new Date(progress.date).toLocaleDateString();
      const existing = dateMap.get(date) || { date };
      dateMap.set(date, {
        ...existing,
        nutritionCompletion: progress.completed ? 100 : 0,
      });
    });

    // Convertimos el mapa a un array y ordenamos por fecha
    return Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const chartData = formatChartData(data);

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          
          {/* Línea de peso */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="weight"
            stroke="#8884d8"
            name="Peso (kg)"
            dot={false}
          />
          
          {/* Línea de grasa corporal */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="bodyFat"
            stroke="#82ca9d"
            name="Grasa Corporal (%)"
            dot={false}
          />
          
          {/* Línea de masa muscular */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="muscleMass"
            stroke="#ffc658"
            name="Masa Muscular (kg)"
            dot={false}
          />
          
          {/* Línea de completitud de ejercicios */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="workoutCompletion"
            stroke="#ff7300"
            name="Completitud Ejercicios (%)"
            dot={false}
          />
          
          {/* Línea de completitud de nutrición */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="nutritionCompletion"
            stroke="#0088fe"
            name="Completitud Nutrición (%)"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserProgressChart;