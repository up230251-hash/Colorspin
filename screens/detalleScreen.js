import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
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
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { obtenerFotosTablero, subirFoto } from '../api/fotos';

export default function DetalleScreen({ route }) {
  const board = route.params?.board;
  const { usuario } = useAuth();
  const [pins, setPins] = useState([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [facing, setFacing] = useState('back');
  const [subiendo, setSubiendo] = useState(false);
  const [cargandoFotos, setCargandoFotos] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      let pantallaActiva = true;

      const cargarFotos = async () => {
        if (!board?.idTablero) {
          setPins([]);
          setCargandoFotos(false);
          return;
        }

        setPins([]);
        setCargandoFotos(true);
        try {
          const fotos = await obtenerFotosTablero(board.idTablero);
          if (pantallaActiva) {
            setPins(fotos.map((foto) => ({
              id: String(foto.idFoto),
              uri: foto.url,
            })));
          }
        } catch (error) {
          if (pantallaActiva) {
            Alert.alert(
              'No se pudieron cargar las fotos',
              error.response?.data?.mensaje ?? 'Revisa la conexión con el servidor e inténtalo de nuevo.'
            );
          }
        } finally {
          if (pantallaActiva) setCargandoFotos(false);
        }
      };

      cargarFotos();
      return () => {
        pantallaActiva = false;
      };
    }, [board?.idTablero])
  );

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
    if (!cameraRef.current || subiendo) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (!usuario?.idUsuario || !board?.idTablero) {
        Alert.alert('No se pudo subir la foto', 'Falta el usuario o el tablero. Vuelve a entrar al tablero desde tu perfil.');
        return;
      }

      setSubiendo(true);
      const respuesta = await subirFoto(photo.uri, usuario.idUsuario, board.idTablero);
      setPins((prev) => [
        { id: String(respuesta.data.id), uri: respuesta.data.url },
        ...prev,
      ]);
      setCameraOpen(false);
    } catch (error) {
      Alert.alert(
        'No se pudo guardar la foto',
        error.response?.data?.mensaje ?? 'Revisa la conexión con el servidor e inténtalo de nuevo.'
      );
    } finally {
      setSubiendo(false);
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
        ListEmptyComponent={cargandoFotos ? (
          <ActivityIndicator style={styles.loading} size="large" color="#66F1C2" />
        ) : (
          <Text style={styles.empty}>Aún no hay pines. ¡Toma una foto con el botón de la cámara!</Text>
        )}
      />

      <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
        <Ionicons name="camera" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Vista de cámara a pantalla completa */}
      <Modal visible={cameraOpen} animationType="slide" onRequestClose={() => setCameraOpen(false)}>
        <View style={styles.cameraContainer}>
          <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setCameraOpen(false)}
            disabled={subiendo}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>

          <View style={styles.controls}>
            <TouchableOpacity
              onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
              style={styles.flipButton}
            >
              <Ionicons name="camera-reverse" size={30} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.shutter, subiendo && styles.shutterDisabled]}
              onPress={takePicture}
              disabled={subiendo}
              accessibilityLabel={subiendo ? 'Subiendo foto' : 'Tomar foto'}
            >
              {subiendo && <ActivityIndicator color="#111827" />}
            </TouchableOpacity>

            <View style={styles.flipButton} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // 1. Quitamos el centrado global para que la lista/fotos ocupen su espacio bien
  container: {
    flex: 1,
    backgroundColor: '#0B1220',
    paddingHorizontal: 12, // Añadido para que coincida con el margen de la versión funcional
  },
  
  // 2. Centramos el título usando alineación de texto o un contenedor específico si hace falta
  titulo: { 
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
    color: '#F8FAFC',
    textAlign: 'center', // Esto centra el texto perfectamente sin afectar a la pantalla
  },
  
  list: { paddingBottom: 110 },
  pin: { flex: 1, aspectRatio: 1, margin: 4, borderRadius: 12 },
  empty: { textAlign: 'center', color: 'gray', marginTop: 40 },
  loading: { marginTop: 40 },
  
  cameraButton: {
    position: 'absolute',
    bottom: 70,
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
    backgroundColor: '#fff',
    borderWidth: 5,
    borderColor: '#ccc',
  },
  shutterDisabled: { opacity: 0.7 },
});
