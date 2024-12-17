import { useQuery } from '@tanstack/react-query';
import { axiosPrivate } from '../api/axios';

export function ProgressReport({ userId }) {
  const { data: report } = useQuery({
    queryKey: ['user-report', userId],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/metrics/user/${userId}/report`);
      return response.data;
    }
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6">Reporte de Progreso</h2>
      
      <div className="space-y-6">
        <section>
          <h3 className="font-semibold text-lg mb-3">Objetivos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GoalCard
              title="Peso Objetivo"
              current={report?.currentWeight}
              target={report?.targetWeight}
              unit="kg"
            />
            <GoalCard
              title="Grasa Corporal Objetivo"
              current={report?.currentBodyFat}
              target={report?.targetBodyFat}
              unit="%"
            />
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-3">Cumplimiento de Planes</h3>
          <div className="space-y-4">
            {report?.planProgress?.map((plan) => (
              <div key={plan.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{plan.name}</h4>
                  <span className="text-sm text-gray-500">{plan.completionRate}% completado</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${plan.completionRate}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-600">{plan.feedback}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-3">Recomendaciones</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {report?.recommendations?.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

function GoalCard({ title, current, target, unit }) {
  const progress = (current / target) * 100;
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium mb-2">{title}</h4>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">
          {current} / {target} {unit}
        </span>
        <span className="text-sm font-medium text-blue-600">
          {progress.toFixed(1)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}