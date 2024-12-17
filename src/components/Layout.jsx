import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">Fitness App</span>
            </div>
            <div className="flex items-center">
              <span className="mx-4">{auth?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}