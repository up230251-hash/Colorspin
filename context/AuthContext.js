import { createContext, useContext, useState } from "react";

// Contexto de autenticación: guarda quién es el usuario logueado (o null si nadie ha iniciado sesión).
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null); // null = no hay sesión

    // Se llama cuando el login (o el sign up) tiene éxito.
    // Por ahora recibe el objeto que arme la pantalla; cuando esté el backend,
    // aquí es donde guardarías lo que regrese la API (token, datos del user, etc).
    const login = (datosUsuario) => {
        setUsuario(datosUsuario);
    };

    const logout = () => {
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook para consumir el contexto desde cualquier pantalla: const { usuario, login, logout } = useAuth();
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
    }
    return context;
}
