import { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Esto vendrá de tu API con JOIN foto + tablero (fecha pertenece a tablero, no a foto)
// Estructura esperada por item: { idFoto, idTablero, idUsuario, url, fecha }
// donde `fecha` = tablero.fecha del tablero al que pertenece esa foto
const fotosMock = [
  { idFoto: 1, idTablero: 10, idUsuario: 1, url: 'https://picsum.photos/id/10/400/500', fecha: '2026-09-20' },
  { idFoto: 2, idTablero: 10, idUsuario: 1, url: 'https://picsum.photos/id/20/400/500', fecha: '2026-09-20' },
  { idFoto: 3, idTablero: 11, idUsuario: 1, url: 'https://picsum.photos/id/30/400/500', fecha: '2026-09-15' },
  { idFoto: 4, idTablero: 11, idUsuario: 1, url: 'https://picsum.photos/id/40/400/500', fecha: '2026-09-15' },
  { idFoto: 5, idTablero: 12, idUsuario: 1, url: 'https://picsum.photos/id/50/400/500', fecha: '2026-09-01' },
  { idFoto: 6, idTablero: 12, idUsuario: 1, url: 'https://picsum.photos/id/60/400/500', fecha: '2026-09-01' },
];  

export default function inicioScreen({ navigation }) {
  const [orden, setOrden] = useState('nuevo'); 

  const fotosOrdenadas = [...fotosMock].sort((a, b) => {
    const fechaA = new Date(a.fecha); // fecha del tablero
    const fechaB = new Date(b.fecha);
    return orden === 'nuevo' ? fechaB - fechaA : fechaA - fechaB;
  });

  const renderFoto = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('detalle')}
    >
      <Image source={{ uri: item.url }} style={styles.imagen} resizeMode="cover" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filtros}>
        <TouchableOpacity
          style={[styles.filtroBtn, orden === 'nuevo' && styles.filtroActivo]}
          onPress={() => setOrden('nuevo')}
        >
          <Ionicons name="arrow-down" size={16} color={orden === 'nuevo' ? '#333' : '#333'} />
          <Text style={[styles.filtroTexto, orden === 'nuevo' && styles.filtroTextoActivo]}>
            Más reciente
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filtroBtn, orden === 'viejo' && styles.filtroActivo]}
          onPress={() => setOrden('viejo')}
        >
          <Ionicons name="arrow-up" size={16} color={orden === 'viejo' ? '#fff' : '#333'} />
          <Text style={[styles.filtroTexto, orden === 'viejo' && styles.filtroTextoActivo]}>
            Más antiguo
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={fotosOrdenadas}
        keyExtractor={(item) => item.idFoto.toString()}
        numColumns={2}
        renderItem={renderFoto}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={<Text style={styles.vacio}>Aún no hay fotos</Text>}
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
    marginVertical: 50
    
  },
  filtroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#141C30',
  },
  filtroActivo: { backgroundColor: '#66F1C2' },
  filtroTexto: { fontSize: 13, color: '#8896AC' },
  filtroTextoActivo: { color: '#0B1220' },
  grid: { paddingHorizontal: 8 },
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#141C30',
  },
  imagen: { width: '100%', height: 180 },
  vacio: { textAlign: 'center', marginTop: 40, color: '#8896AC' },
});