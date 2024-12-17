import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserMetricsSection = ({ data }) => {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="weight" stroke="#8884d8" />
          <Line type="monotone" dataKey="body_fat" stroke="#82ca9d" />
          <Line type="monotone" dataKey="muscle_mass" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserMetricsSection;