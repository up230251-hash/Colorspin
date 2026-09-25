import { api } from "./client";

export function subirFoto(uri, idUsuario, idTablero) {
  const formData = new FormData();
  const extension = uri.split("?")[0].split(".").pop()?.toLowerCase();
  const tiposMime = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
  };
  const extensionValida = tiposMime[extension] ? extension : "jpg";

  formData.append("file", {
    uri,
    name: `foto-${Date.now()}.${extensionValida}`,
    type: tiposMime[extensionValida],
  });
  formData.append("idUsuario", String(idUsuario));
  formData.append("idTablero", String(idTablero));

  return api.post("/api/Fotos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });
}

export async function obtenerFotosTablero(idTablero) {
  try {
    const respuesta = await api.get(`/api/Fotos/tablero/${idTablero}`);
    return respuesta.data;
  } catch (error) {
    // El backend responde 404 cuando el tablero aún no tiene fotos.
    if (error.response?.status === 404) return [];
    throw error;
  }
}

export async function obtenerFotosAleatorias() {
  try {
    const respuesta = await api.get("/api/Fotos/aleatorias");
    return respuesta.data;
  } catch (error) {
    // El backend responde 404 cuando todavía no hay fotos.
    if (error.response?.status === 404) return [];
    throw error;
  }
}
