import { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export default function DetalleScreen({ route }) {
  const board = route.params?.board;
  const [pins, setPins] = useState([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  // Abrir la cámara (pide permiso si hace falta)
  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara para tomar fotos.');
        return;
      }
    }
    setCameraOpen(true);
  };

  // Tomar la foto y agregarla como pin
  const takePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setPins((prev) => [{ id: Date.now().toString(), uri: photo.uri }, ...prev]);
      // TODO: enviar la foto al backend junto con el id del tablero
      setCameraOpen(false);
    } catch (e) {
      Alert.alert('Error', 'No se pudo tomar la foto.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{board?.nombre ?? board?.name ?? 'Detalle de tablero'}</Text>

      <FlatList
        data={pins}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <Image source={{ uri: item.uri }} style={styles.pin} />}
        ListEmptyComponent={
          <Text style={styles.empty}>Aún no hay pines. ¡Toma una foto con el botón de la cámara!</Text>
        }
      />

      <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
        <Ionicons name="camera" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Vista de cámara a pantalla completa */}
      <Modal visible={cameraOpen} animationType="slide" onRequestClose={() => setCameraOpen(false)}>
        <View style={styles.cameraContainer}>
          <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} />

          <TouchableOpacity style={styles.closeButton} onPress={() => setCameraOpen(false)}>
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>

          <View style={styles.controls}>
            <TouchableOpacity
              onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
              style={styles.flipButton}
            >
              <Ionicons name="camera-reverse" size={30} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.shutter} onPress={takePicture} />

            <View style={styles.flipButton} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1220', paddingHorizontal: 12 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginVertical: 16, color: '#F8FAFC' },
  list: { paddingBottom: 110 },
  pin: { flex: 1, aspectRatio: 1, margin: 4, borderRadius: 12 },
  empty: { textAlign: 'center', color: '#8896AC', marginTop: 40 },
  cameraButton: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#66F1C2',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  closeButton: { position: 'absolute', top: 50, left: 20, padding: 8 },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  flipButton: { width: 50, alignItems: 'center' },
  shutter: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#F8FAFC',
    borderWidth: 5,
    borderColor: '#233047',
  },
});