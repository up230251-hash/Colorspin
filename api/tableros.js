import { api } from "./client";

export async function obtenerTablerosUsuario(idUsuario) {
  try {
    const respuesta = await api.get(`/api/Tablero/usuario/${idUsuario}`);
    return respuesta.data;
  } catch (error) {
    // El backend responde 404 cuando el usuario todavía no tiene tableros.
    if (error.response?.status === 404) return [];
    throw error;
  }
}

export function crearTablero(idUsuario, nombre, fecha) {
  return api.post("/api/Tablero", { idUsuario, nombre, fecha });
}
