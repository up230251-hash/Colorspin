import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerFotosAleatorias } from '../api/fotos';

function valorFecha(foto) {
  if (foto.fecha) {
    const fecha = new Date(foto.fecha).getTime();
    if (Number.isFinite(fecha)) return fecha;
  }
  return Number(foto.idFoto);
}

export default function InicioScreen({ navigation }) {
  const [orden, setOrden] = useState('nuevo');
  const [fotos, setFotos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [intentoCarga, setIntentoCarga] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let pantallaActiva = true;

      const cargarFotos = async () => {
        setCargando(true);
        setError('');
        try {
          const datos = await obtenerFotosAleatorias();
          if (pantallaActiva) setFotos(datos);
        } catch (e) {
          if (pantallaActiva) {
            setError(e.response?.data?.mensaje ?? 'No se pudieron cargar las fotos.');
          }
        } finally {
          if (pantallaActiva) setCargando(false);
        }
      };

      cargarFotos();
      return () => {
        pantallaActiva = false;
      };
    }, [intentoCarga])
  );

  const fotosOrdenadas = [...fotos].sort((a, b) => {
    const fechaA = valorFecha(a);
    const fechaB = valorFecha(b);
    return orden === 'nuevo' ? fechaB - fechaA : fechaA - fechaB;
  });

  const renderFoto = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('detalle', {
        board: { idTablero: item.idTablero, nombre: 'Tablero' },
      })}
    >
      <Image source={{ uri: item.url }} style={styles.imagen} resizeMode="cover" />
    </TouchableOpacity>
  );

  const contenidoVacio = cargando ? (
    <ActivityIndicator style={styles.estado} size="large" color="#66F1C2" />
  ) : error ? (
    <View style={styles.estado}>
      <Text style={styles.vacio}>{error}</Text>
      <TouchableOpacity onPress={() => setIntentoCarga((intento) => intento + 1)}>
        <Text style={styles.reintentar}>Volver a cargar</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <Text style={styles.vacio}>Aún no hay fotos</Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filtros}>
        <TouchableOpacity
          style={[styles.filtroBtn, orden === 'nuevo' && styles.filtroActivo]}
          onPress={() => setOrden('nuevo')}
        >
          <Ionicons name="arrow-down" size={16} color="#333" />
          <Text style={[styles.filtroTexto, orden === 'nuevo' && styles.filtroTextoActivo]}>
            Más reciente
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filtroBtn, orden === 'viejo' && styles.filtroActivo]}
          onPress={() => setOrden('viejo')}
        >
          <Ionicons name="arrow-up" size={16} color="#333" />
          <Text style={[styles.filtroTexto, orden === 'viejo' && styles.filtroTextoActivo]}>
            Más antiguo
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={fotosOrdenadas}
        keyExtractor={(item) => String(item.idFoto)}
        numColumns={2}
        renderItem={renderFoto}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={contenidoVacio}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1220', paddingTop: 10 },
  filtros: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
    marginVertical: 50,
  },
  filtroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filtroActivo: { backgroundColor: '#66F1C2' },
  filtroTexto: { fontSize: 13, color: '#333' },
  filtroTextoActivo: { color: '#333' },
  grid: { paddingHorizontal: 8, flexGrow: 1 },
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#141C30',
  },
  imagen: { width: '100%', height: 180 },
  estado: { alignSelf: 'center', marginTop: 40, marginHorizontal: 24 },
  vacio: { textAlign: 'center', marginTop: 40, color: '#8896AC' },
  reintentar: { textAlign: 'center', color: '#66F1C2', fontWeight: '700', marginTop: 14 },
});
