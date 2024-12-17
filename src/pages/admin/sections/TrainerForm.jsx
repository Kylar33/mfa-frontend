import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { axiosPrivate } from "../../../api/axios";

export default function TrainerForm({ trainer, onClose }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: trainer
      ? {
          email: trainer.email,
          full_name: trainer.full_name,
        }
      : {
          email: "",
          full_name: "",
          password: "",
        },
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosPrivate.post("/admin/trainers/", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["trainers"]);
      onClose();
      reset();
    },
    onError: (error) => {
      alert(error.response?.data?.detail || "Error al crear el entrenador");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      try {
        // Remover campos vacíos
        if (!data.password?.trim()) {
          delete data.password;
        }

        console.log("Datos enviados:", data); // Para debuggear

        const response = await axiosPrivate.put(
          `/admin/trainers/${trainer.id}`,
          data
        );
        return response.data;
      } catch (error) {
        console.error("Error completo:", error.response?.data); // Para ver el error completo
        throw error;
      }
    },
    onError: (error) => {
      console.error("Error de mutación:", error);
      alert(
        error.response?.data?.detail || "Error al actualizar el entrenador"
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["trainers"]);
      onClose();
    },
  });

  const onSubmit = async (data) => {
    // Si no se proporciona contraseña en actualización, la eliminamos del objeto
    if (trainer && !data.password) {
      delete data.password;
    }

    if (trainer) {
      await updateMutation.mutateAsync(data);
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {trainer ? "Editar Entrenador" : "Crear Nuevo Entrenador"}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "El email es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido",
              },
            })}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.email
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Nombre Completo */}
        <div>
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre Completo
          </label>
          <input
            type="text"
            id="full_name"
            {...register("full_name", {
              required: "El nombre completo es requerido",
              minLength: {
                value: 3,
                message: "El nombre debe tener al menos 3 caracteres",
              },
            })}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.full_name
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
          />
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.full_name.message}
            </p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            {trainer ? "Nueva Contraseña (opcional)" : "Contraseña"}
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: !trainer ? "La contraseña es requerida" : false,
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
            })}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.password
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : trainer ? "Actualizar" : "Crear"}
          </button>
        </div>

        {/* Mensajes de error generales */}
        {(createMutation.isError || updateMutation.isError) && (
          <div className="mt-2 text-sm text-red-600">
            Hubo un error al {trainer ? "actualizar" : "crear"} el entrenador.
            Por favor, intente nuevamente.
          </div>
        )}
      </form>
    </div>
  );
}
