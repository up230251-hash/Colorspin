import { api } from "./client";

export const iniciarSesion = (correo, contraseña) =>
  api.post("/api/Usuario/login", { correo, contraseña });

export const registrarUsuario = (nombre, correo, contraseña) =>
  api.post("/api/Usuario", { nombre, correo, contraseña });