import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { obtenerTablerosUsuario } from "../api/tableros";

function mostrarFecha(fecha) {
  if (!fecha) return "";
  const [anio, mes, dia] = String(fecha).slice(0, 10).split("-");
  return dia && mes && anio ? `${dia}/${mes}/${anio}` : "";
}

export default function PerfilScreen({ navigation }) {
  const { usuario, logout } = useAuth();
  const [tableros, setTableros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [intentoCarga, setIntentoCarga] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let pantallaActiva = true;

      const cargarTableros = async () => {
        if (!usuario?.idUsuario) {
          setError("No se encontró el identificador del usuario. Vuelve a iniciar sesión.");
          setCargando(false);
          return;
        }

        setCargando(true);
        setError("");
        try {
          const datos = await obtenerTablerosUsuario(usuario.idUsuario);
          if (pantallaActiva) setTableros(datos);
        } catch (e) {
          if (pantallaActiva) {
            setError(e.response?.data?.mensaje ?? "No se pudieron cargar tus tableros.");
          }
        } finally {
          if (pantallaActiva) setCargando(false);
        }
      };

      cargarTableros();
      return () => {
        pantallaActiva = false;
      };
    }, [usuario?.idUsuario, intentoCarga])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => Alert.alert("Compartir perfil")}>
            <Ionicons name="share-outline" size={20} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert("Configuración")}>
            <Ionicons name="settings-outline" size={20} color="#111827" />
          </TouchableOpacity>
        </View>

        <View style={styles.perfilInfo}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300" }}
            style={styles.avatar}
          />
          <Text style={styles.nombre}>{usuario?.nombre ?? "Mi perfil"}</Text>
          {!!usuario?.correo && <Text style={styles.correo}>{usuario.correo}</Text>}
        </View>

        <View style={styles.tabs}>
          <View style={styles.tab}>
            <Text style={[styles.tabTexto, styles.tabTextoActivo]}>Mis tableros</Text>
            <View style={styles.lineaActiva} />
          </View>
        </View>

        {cargando ? (
          <ActivityIndicator style={styles.estado} size="large" color="#66F1C2" />
        ) : error ? (
          <View style={styles.estado}>
            <Text style={styles.mensajeEstado}>{error}</Text>
            <TouchableOpacity onPress={() => setIntentoCarga((intento) => intento + 1)}>
              <Text style={styles.reintentar}>Volver a cargar</Text>
            </TouchableOpacity>
          </View>
        ) : tableros.length === 0 ? (
          <Text style={styles.mensajeEstado}>Aún no tienes tableros. Crea uno desde la ruleta.</Text>
        ) : (
          <View style={styles.grid}>
            {tableros.map((item) => (
              <TouchableOpacity
                key={String(item.idTablero)}
                style={styles.tablero}
                onPress={() => navigation.navigate('detalle', { board: item })}
              >
                <Image
                  source={{ uri: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600" }}
                  style={styles.tableroImagen}
                />
                <Text style={styles.tableroNombre}>{item.nombre}</Text>
                <Text style={styles.tableroFecha}>{mostrarFecha(item.fecha)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutTexto}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  perfilInfo: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginBottom: 12,
    backgroundColor: "#141C30",
  },
  nombre: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  correo: {
    fontSize: 13,
    color: "#8896AC",
    marginTop: 4,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#233047",
  },
  tab: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tabTexto: {
    fontSize: 14,
    color: "#8896AC",
    fontWeight: "600",
  },
  tabTextoActivo: {
    color: "#F8FAFC",
  },
  lineaActiva: {
    width: 32,
    height: 3,
    borderRadius: 3,
    backgroundColor: "#F8FAFC",
    marginTop: 6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  tablero: {
    width: "48%",
    marginBottom: 20,
  },
  tableroImagen: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    backgroundColor: "#141C30",
  },
  tableroNombre: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F8FAFC",
    marginTop: 8,
  },
  tableroFecha: {
    fontSize: 12,
    color: "#8896AC",
    marginTop: 2,
  },
  estado: {
    alignItems: "center",
    marginTop: 40,
    marginHorizontal: 24,
  },
  mensajeEstado: {
    color: "#8896AC",
    textAlign: "center",
    marginTop: 32,
    marginHorizontal: 24,
  },
  reintentar: {
    color: "#66F1C2",
    fontWeight: "700",
    marginTop: 14,
  },
  logoutButton: {
    alignSelf: "center",
    padding: 14,
    marginBottom: 24,
  },
  logoutTexto: {
    fontSize: 13,
    fontWeight: "600",
    color: "#dc2626",
  },
});
