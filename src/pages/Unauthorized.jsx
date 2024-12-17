export default function Unauthorized() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center p-6">
          <h1 className="text-4xl font-bold text-red-600 mb-4">No Autorizado</h1>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a esta página.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    );
  }
  